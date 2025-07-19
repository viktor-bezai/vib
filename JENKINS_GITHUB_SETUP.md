# GitHub-Jenkins Integration Setup Guide

This guide will help you set up automated deployments when you push to GitHub.

## Prerequisites
- Jenkins server with GitHub plugin installed
- GitHub repository access
- Jenkins credentials configured

## Step 1: Install Required Jenkins Plugins

1. Go to **Jenkins → Manage Jenkins → Manage Plugins**
2. Install these plugins:
   - GitHub plugin
   - GitHub Branch Source Plugin
   - GitHub API Plugin
   - Pipeline: GitHub Groovy Libraries
   - Credentials Binding Plugin

## Step 2: Configure GitHub Credentials in Jenkins

1. Go to **Jenkins → Manage Jenkins → Manage Credentials**
2. Add a new credential:
   - Kind: `Username with password`
   - Username: Your GitHub username
   - Password: GitHub Personal Access Token (not your password!)
   - ID: `github-credentials`
   - Description: GitHub Access

### Creating a GitHub Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token with these permissions:
   - `repo` (full control)
   - `admin:repo_hook` (for webhooks)
   - `admin:org_hook` (if using organization)

## Step 3: Create Jenkins Pipeline Job

### Option A: Pipeline from SCM (Recommended)
1. Create new item → Pipeline
2. Under "Pipeline", select "Pipeline script from SCM"
3. SCM: Git
4. Repository URL: `https://github.com/viktor-bezai/vib.git`
5. Credentials: Select your GitHub credentials
6. Branch Specifier: `*/master` (or your default branch)
7. Script Path: `Jenkinsfile`

### Option B: Multibranch Pipeline (For Multiple Branches)
1. Create new item → Multibranch Pipeline
2. Branch Sources → Add source → GitHub
3. Credentials: Select your GitHub credentials
4. Owner: `viktor-bezai`
5. Repository: `vib`
6. Behaviors:
   - Discover branches
   - Discover pull requests from origin
   - Discover pull requests from forks

## Step 4: Configure GitHub Webhook

1. Go to your GitHub repository → Settings → Webhooks
2. Add webhook:
   - Payload URL: `http://YOUR_JENKINS_URL/github-webhook/`
   - Content type: `application/json`
   - Secret: (leave empty or set up a secret)
   - Which events: 
     - Just the push event (for simple setup)
     - OR select individual events: Push, Pull Request
   - Active: ✓

## Step 5: Configure Jenkins Job for GitHub

1. In your Jenkins job configuration:
2. Under "Build Triggers":
   - ✓ GitHub hook trigger for GITScm polling
3. Save the configuration

## Step 6: Test the Setup

1. Make a small change to your repository
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Test Jenkins deployment"
   git push origin master
   ```
3. Check Jenkins - it should automatically start a build

## Step 7: Setup Environment Variables in Jenkins

1. Go to **Jenkins → Manage Jenkins → Configure System**
2. Under "Global properties":
   - ✓ Environment variables
   - Add all required variables

OR in your Job configuration:
1. Go to job → Configure → Build Environment
2. ✓ Use secret text(s) or file(s)
3. Add your credentials

## Troubleshooting

### Webhook not triggering:
1. Check Jenkins logs: `/var/log/jenkins/jenkins.log`
2. Verify webhook URL is accessible from internet
3. Check GitHub webhook recent deliveries for errors

### Permission denied on git clone:
1. Ensure SSH keys are set up:
   ```bash
   sudo -u jenkins ssh-keygen -t rsa -b 4096
   sudo -u jenkins cat ~/.ssh/id_rsa.pub
   ```
2. Add the public key to GitHub deploy keys

### Build fails with Docker permission:
```bash
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

## Security Best Practices

1. **Use Deploy Keys**: Instead of personal tokens, use repository-specific deploy keys
2. **Limit Webhook IPs**: Configure Jenkins to only accept webhooks from GitHub IPs
3. **Use HTTPS**: Always use HTTPS for webhook URLs
4. **Secret Token**: Configure a webhook secret token for verification
5. **Least Privilege**: Give Jenkins only necessary permissions

## Advanced Configuration

### Branch-Specific Deployments
Modify the Jenkinsfile to handle different branches:

```groovy
stage('Deploy') {
    when {
        branch 'master'
    }
    steps {
        // Production deployment
    }
}

stage('Deploy Staging') {
    when {
        branch 'develop'
    }
    steps {
        // Staging deployment
    }
}
```

### Slack/Email Notifications
Add to your Jenkinsfile:

```groovy
post {
    success {
        slackSend(color: 'good', message: "Deployment successful: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
    }
    failure {
        slackSend(color: 'danger', message: "Deployment failed: ${env.JOB_NAME} - ${env.BUILD_NUMBER}")
    }
}
```

## Monitoring

1. **GitHub Webhook Deliveries**: Check Settings → Webhooks → Recent Deliveries
2. **Jenkins Build History**: Monitor job build history
3. **System Logs**: Check both Jenkins and Docker logs

## Next Steps

1. Set up staging environment
2. Implement blue-green deployments
3. Add automated testing before deployment
4. Configure rollback procedures