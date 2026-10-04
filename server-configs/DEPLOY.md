# Deploy runbook

How viktorbezai.com gets to production, how to roll back, and what to check when it fails.
The server is shared with EnvolPrep and another project, so nothing here touches their
containers, images, networks or nginx files.

## How a deploy works

A push to `master` (a merged `preview` -> `master` PR) runs **Actions -> Deploy VIB**
(`.github/workflows/deploy.yml`):

1. **Pick the release.** The commit must be on `master`. If GHCR already has its images, the build is skipped.
2. **Build.** GitHub Actions builds `ghcr.io/viktor-bezai/vib-backend:<sha>` and
   `vib-frontend:<sha>` in parallel, with a layer cache. Nothing is built on the server.
3. **Deploy.** `scripts/deploy/remote.sh` opens one SSH session. The secrets travel on stdin, and
   the host key must match the `DROPLET_SSH_KNOWN_HOSTS` secret. On the server, `bootstrap.sh`
   takes the lock, checks out the commit, and starts `deploy.sh` detached (`setsid`). A cancelled
   job or a dropped connection cannot stop it halfway. `deploy.sh` then:
   - pulls both images with the job's own short-lived token, in a throwaway Docker config, then
     logs out. If the pull fails, the site is untouched.
   - installs the nginx config (kept only if `nginx -t` passes with no duplicate `server_name`)
     and writes `.env` from the secrets.
   - runs `migrate` and `collectstatic` once, in a one-off container, while the old release still
     serves. Their output goes to `.deploy/migrate-<sha>.log` on the server, not the public log.
   - replaces `vib-backend`, waits until it is healthy, then does the same for `vib-frontend`.
     "Healthy" means the container runs the new image, its own healthcheck passes, and its host
     port (8002 or 3002) answers 200.
   - if either fails, puts **both** back on the previous release (static files included), then
     fails the job. A failed `rebuild` of the live release goes back to the images it replaced.
   - removes old vib images, keeping the last 3 releases on disk.
4. **Prune the registry.** GHCR keeps the 10 newest versions of each image.

### What downtime is left

Each container is stopped and started once (`up`, no `down`). The gap is a few seconds per
container: about 2 seconds for the backend and 2 to 3 seconds for the frontend in the local
rehearsal. During the gap nginx answers with the branded maintenance page (its `error_page 502`
fallback), not a raw error. The old flow was down for the whole build and start, usually 1 to 3
minutes.

No maintenance flag is set. Blue-green would remove the gap, but it needs a second set of ports
and an nginx switch, which this site does not need today.

## Migrations: expand, then contract

Migrations run before the new containers start, while the old code still serves. A rollback
never reverses them. So every migration must work with **both** the old and the new code:

- Adding a nullable column, a column with a default, or a new table is safe.
- To rename or drop a column: release 1 stops using it, release 2 removes it.
- Never make one release both change the schema and need the old schema gone.

## Rolling back

- **Automatic.** A deploy that does not get healthy goes back to the previous release by itself.
- **From GitHub.** Actions -> Deploy VIB -> Run workflow, with `sha` set to an older `master`
  commit (empty means the head of `master`). GHCR still has the last 10 builds, so there is
  usually no rebuild.
- **On the server, fastest.** The last 3 releases are on disk:

  ```bash
  ssh root@174.138.113.224
  cd /home/deploy/vib
  scripts/deploy/rollback.sh            # back to the newest release that is not live
  scripts/deploy/rollback.sh <full sha> # or a named one; add --yes to skip the question
  ```

`rollback.sh` puts the target's static files back, then uses the same health-gated swap. It does
not change the git checkout. Going back to `legacy` is slower (up to 5 minutes): that image still
runs `pip install`, `migrate` and `collectstatic` when it starts.

## Secrets

Repository secrets used by the workflow:

| Secret | What |
|---|---|
| `VPS_HOST`, `VPS_USER`, `VPS_PORT`, `VPS_SSH_KEY` | SSH access to the server |
| `DROPLET_SSH_KNOWN_HOSTS` | **New.** The server's public host keys (not secret, but stored as one) |
| `SECRET_KEY`, `POSTGRES_NAME`, `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_PORT` | Written into `.env` |
| `NEXT_PUBLIC_API_BASE_URL` | Baked into the frontend image at build time, and written into `.env` |

No secret may hold a single quote or a line break: `.env` stores each value in single quotes,
so Compose reads it literally (a `$` stays a `$`).

GHCR needs no secret: the workflow uses its own `GITHUB_TOKEN`.

To refresh `DROPLET_SSH_KNOWN_HOSTS` after the server is rebuilt, scan the keys, compare their
fingerprints with `ssh-keygen -lf /etc/ssh/ssh_host_*_key.pub` on the server (DigitalOcean
console), then:

```bash
ssh-keyscan -t ed25519,ecdsa,rsa 174.138.113.224 2>/dev/null | grep -v '^#' > known_hosts
gh secret set DROPLET_SSH_KNOWN_HOSTS -R viktor-bezai/vib < known_hosts
```

## On the server

Everything lives in `/home/deploy/vib`:

- `.env` holds the app settings and `VIB_RELEASE`, the live release. Manual Compose commands
  read it, so `docker compose -f docker-compose.prod.yml ps` shows the live containers.
- `.deploy/history` lists every deploy, rollback and failure.
- `.deploy/deploy-<sha>.log` is each deploy's full log.
- `.deploy/migrate-<sha>.log` and `.deploy/collectstatic-<sha>.log` hold the one-off runs' output.
- `.deploy/<service>-<sha>.log` holds a failed container's last logs. They stay on the server,
  because the Actions log of this public repo is public.
- `.deploy/compose/<release>.yml` is the compose file each kept release ran with, so a rollback
  starts it exactly as before.

Useful commands:

```bash
docker logs vib-backend --tail 100
docker logs vib-frontend --tail 100
docker compose -f docker-compose.prod.yml ps
cat .deploy/history
```

Do not run `docker system prune -a` or `docker image prune -a` on this server: they delete the
rollback images, and the other projects' too.

The maintenance page can still be shown by hand: `touch /var/www/maintenance-vib.flag`, and
`rm` it to lift it. Deploys do not touch the flag.

## The first deploy (cutover from the old flow)

Today's containers were built on the server by Compose v1 (`docker-compose`). The first run of
the new workflow:

1. Tags the running images as release `legacy`, so a failure can go back to them.
2. Replaces both containers with Compose v2 (`docker compose`, 2.23.3 on the server). The
   pinned `name: vib` matches the old project name, so Compose v2 adopts the old containers and
   the `vib_default` network instead of making new ones.
3. The `legacy` images stay as one of the 3 kept releases, and are removed after three newer
   deploys.

Only commits that contain `scripts/deploy/deploy.sh` can be deployed by the workflow. To go
back to `legacy`, run `scripts/deploy/rollback.sh legacy` on the server.

## Testing changes to the deploy scripts

`scripts/deploy` runs locally against stand-in containers when `VIB_REHEARSAL=true` and
`VIB_PROJECT_DIR=<a folder with docker-compose.prod.yml, scripts/ and a .env>` are set. It
then skips the git checks, the registry pull, nginx and `.env`, and uses images tagged on
the machine. Run it in a Linux container with Compose 2.23.3, the Docker socket and host
networking, since it needs `flock` and reaches the containers on 127.0.0.1.
