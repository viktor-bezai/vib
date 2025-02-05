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

                    # Reset any local changes to avoid conflicts
                    if [ -d .git ]; then
                        echo "⚠️ Resetting local changes..."
                        git reset --hard HEAD
                        git clean -fd  # Remove untracked files and directories
                        git pull origin master
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
                    chmod +x ${PROJECT_DIR}/backend/entrypoint.sh
                    chmod -R 755 ${PROJECT_DIR}/backend
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
                    string(credentialsId: 'VIKTORBEZAI_NEXT_PUBLIC_API_BASE_URL', variable: 'NEXT_PUBLIC_API_BASE_URL')
                ]) {
                    script {
                        sh '''#!/bin/bash
                        cat > ${PROJECT_DIR}/.env <<EOF
POSTGRES_NAME=${POSTGRES_NAME}
POSTGRES_USER=${POSTGRES_USER}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD//$/\\$}
POSTGRES_HOST=${POSTGRES_HOST}
POSTGRES_PORT=${POSTGRES_PORT}
SECRET_KEY=${SECRET_KEY//$/\\$}
GOOGLE_API_KEY=${GOOGLE_API_KEY}
NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
EOF

                        # Ensure the .env file has correct permissions
                        chmod 600 ${PROJECT_DIR}/.env
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh '''#!/bin/bash
                    cd ${PROJECT_DIR}

                    # Ensure correct permissions for static files
                    mkdir -p ${PROJECT_DIR}/backend/staticfiles
                    chmod -R 777 ${PROJECT_DIR}/backend/staticfiles
                    chown -R www-data:www-data ${PROJECT_DIR}/backend/staticfiles

                    docker compose build --no-cache
                    '''
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    sh '''#!/bin/bash
                    cd ${PROJECT_DIR}

                    # Stop and remove old containers
                    docker compose down --rmi all --volumes --remove-orphans
                    docker system prune -a --volumes -f

                    # Ensure correct permissions for static and media files before deployment
                    mkdir -p ${PROJECT_DIR}/backend/staticfiles ${PROJECT_DIR}/backend/media
                    chmod -R 777 ${PROJECT_DIR}/backend/staticfiles ${PROJECT_DIR}/backend/media
                    chown -R www-data:www-data ${PROJECT_DIR}/backend/staticfiles ${PROJECT_DIR}/backend/media

                    # Build and start new containers
                    docker compose build --no-cache
                    docker compose up -d --force-recreate --build
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
