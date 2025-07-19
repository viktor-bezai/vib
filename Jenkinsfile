pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = "docker-compose.prod.yml"
        BACKEND_SERVICE = "vib-backend"
        FRONTEND_SERVICE = "vib-frontend"
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
                        git clone git@github.com:viktor-bezai/vib.git .
                    fi
                    '''
                }
            }
        }

        stage('Fix Permissions') {
            steps {
                script {
                    sh '''#!/bin/bash
                    # Create directories if they don't exist
                    sudo mkdir -p ${PROJECT_DIR}/backend/staticfiles
                    sudo mkdir -p ${PROJECT_DIR}/backend/media
                    
                    # Set proper permissions
                    sudo chown -R 1000:1000 ${PROJECT_DIR}/backend/staticfiles ${PROJECT_DIR}/backend/media
                    sudo chmod -R 755 ${PROJECT_DIR}/backend/staticfiles
                    sudo chmod -R 755 ${PROJECT_DIR}/backend/media
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
                    string(credentialsId: 'VIKTORBEZAI_NEXT_PUBLIC_API_BASE_URL', variable: 'NEXT_PUBLIC_API_BASE_URL')
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
NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
EOF

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

                    echo "⚠️ Building Docker images..."
                    docker compose -f ${DOCKER_COMPOSE_FILE} build --no-cache
                    '''
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    sh '''#!/bin/bash
                    cd ${PROJECT_DIR}

                    echo "⚠️ Stopping existing containers..."
                    docker compose -f ${DOCKER_COMPOSE_FILE} down

                    echo "⚠️ Starting new containers..."
                    docker compose -f ${DOCKER_COMPOSE_FILE} up -d

                    echo "⚠️ Waiting for services to be healthy..."
                    sleep 10

                    echo "⚠️ Running Django migrations..."
                    docker compose -f ${DOCKER_COMPOSE_FILE} exec -T ${BACKEND_SERVICE} python manage.py migrate

                    echo "⚠️ Collecting static files..."
                    docker compose -f ${DOCKER_COMPOSE_FILE} exec -T ${BACKEND_SERVICE} python manage.py collectstatic --noinput
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh '''#!/bin/bash
                    cd ${PROJECT_DIR}

                    echo "⚠️ Checking backend health..."
                    curl -f http://localhost:8001/api/schema/ || exit 1

                    echo "⚠️ Checking frontend health..."
                    curl -f http://localhost:3001/ || exit 1

                    echo "✅ All services are healthy!"
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
            script {
                sh '''#!/bin/bash
                cd ${PROJECT_DIR}
                echo "⚠️ Showing container logs..."
                docker compose -f ${DOCKER_COMPOSE_FILE} logs --tail=50
                '''
            }
        }
    }
}