pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.yml"
        BACKEND_SERVICE = "backend"
        FRONTEND_SERVICE = "frontend"
        PROJECT_DIR = "/var/www/viktorbezai"
    }

    stages {
        stage('Pull Latest Code') {
            steps {
                script {
                    sh '''#!/bin/bash
                    mkdir -p ${PROJECT_DIR}
                    cd ${PROJECT_DIR}

                    if [ -d .git ]; then
                        echo "⚠️ Resetting local changes..."
                        git fetch --all
                        git reset --hard origin/master
                        git clean -fd
                        git pull --ff-only origin master
                    else
                        git clone git@github.com:viktor-bezai/LearnEnglish.git .
                    fi
                    '''
                }
            }
        }

        stage('Fix Permissions') {
            steps {
                script {
                    sh '''#!/bin/bash
                    sudo chown -R 1000:1000 ${PROJECT_DIR}/backend/staticfiles ${PROJECT_DIR}/backend/media
                    sudo chmod -R 777 ${PROJECT_DIR}/backend/staticfiles ${PROJECT_DIR}/backend/media
                    sudo chmod +x ${PROJECT_DIR}/backend/entrypoint.sh
                    '''
                }
            }
        }

        stage('Load Environment Variables') {
            steps {
                withCredentials([
                    string(credentialsId: 'VIKTORBEZAI_POSTGRES_NAME', variable: 'POSTGRES_NAME'),
                    string(credentialsId: 'VIKTORBEZAI_POSTGRES_USER', variable: 'POSTGRES_USER'),
                    string(credentialsId: 'VIKTORBEZAI_POSTGRES_PASSWORD', variable: 'POSTGRES_PASSWORD'),
                    string(credentialsId: 'VIKTORBEZAI_POSTGRES_HOST', variable: 'POSTGRES_HOST'),
                    string(credentialsId: 'VIKTORBEZAI_POSTGRES_PORT', variable: 'POSTGRES_PORT'),
                    string(credentialsId: 'VIKTORBEZAI_SECRET_KEY', variable: 'SECRET_KEY'),
                    string(credentialsId: 'VIKTORBEZAI_GOOGLE_API_KEY', variable: 'GOOGLE_API_KEY'),
                    string(credentialsId: 'VIKTORBEZAI_NEXT_PUBLIC_API_BASE_URL', variable: 'NEXT_PUBLIC_API_BASE_URL'),
                    string(credentialsId: 'VIKTORBEZAI_PROXY_USERNAME', variable: 'PROXY_USERNAME'),
                    string(credentialsId: 'VIKTORBEZAI_PROXY_PASS', variable: 'PROXY_PASS'),
                    string(credentialsId: 'VIKTORBEZAI_PROXY_HOST', variable: 'PROXY_HOST')
                ]) {
                    script {
                        sh '''#!/bin/bash
                        cat > ${PROJECT_DIR}/.env <<EOF
ENVIRONMENT=prod
POSTGRES_NAME=${POSTGRES_NAME}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD//$/\\$}
POSTGRES_HOST=${POSTGRES_HOST}
POSTGRES_PORT=${POSTGRES_PORT}
SECRET_KEY=${SECRET_KEY//$/\\$}
GOOGLE_API_KEY=${GOOGLE_API_KEY}
NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
PROXY_USERNAME=${PROXY_USERNAME}
PROXY_PASS=${PROXY_PASS}
PROXY_HOST=${PROXY_HOST}
EOF

                        chmod 600 ${PROJECT_DIR}/.env
                        '''
                    }
                }
            }
        }

        stage('Build & Optimize Docker Images') {
            steps {
                script {
                    sh '''#!/bin/bash
                    cd ${PROJECT_DIR}

                    mkdir -p ${PROJECT_DIR}/backend/staticfiles
                    chmod -R 777 ${PROJECT_DIR}/backend/staticfiles
                    chown -R www-data:www-data ${PROJECT_DIR}/backend/staticfiles

                    mkdir -p ${PROJECT_DIR}/backend/media
                    chmod -R 777 ${PROJECT_DIR}/backend/media
                    chown -R www-data:www-data ${PROJECT_DIR}/backend/media

                    echo "⚠️ Pulling latest Docker images..."
                    docker compose pull || true

                    echo "⚠️ Building updated Docker images..."
                    docker compose build
                    '''
                }
            }
        }

        stage('Zero-Downtime Deployment') {
            steps {
                script {
                    sh '''#!/bin/bash
                    cd ${PROJECT_DIR}

                    echo "⚠️ Starting new containers before stopping old ones..."
                    docker compose up -d --no-deps --build ${BACKEND_SERVICE} ${FRONTEND_SERVICE}

                    echo "⚠️ Removing old containers safely..."
                    docker compose restart ${BACKEND_SERVICE} ${FRONTEND_SERVICE}
                    '''
                }
            }
        }

        stage('Cleanup Unused Docker Resources') {
            steps {
                script {
                    sh '''#!/bin/bash
                    echo "⚠️ Removing only unused Docker resources..."
                    docker image prune -af
                    docker volume prune -f
                    docker network prune -f
                    echo "✅ Cleanup complete!"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed!"
        }
    }
}
