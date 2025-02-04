pipeline {
    agent any
    environment {
        BACKEND_DIR = 'backend'
        FRONTEND_DIR = 'frontend'
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Set Up Environment Variables') {
            steps {
                sh '''
                echo "POSTGRES_NAME=${POSTGRES_NAME}" > ${BACKEND_DIR}/.env
                echo "POSTGRES_USER=${POSTGRES_USER}" >> ${BACKEND_DIR}/.env
                echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" >> ${BACKEND_DIR}/.env
                echo "POSTGRES_HOST=${POSTGRES_HOST}" >> ${BACKEND_DIR}/.env
                echo "POSTGRES_HOST=${POSTGRES_HOST}" >> ${BACKEND_DIR}/.env
                echo "POSTGRES_PORT=${POSTGRES_PORT}" >> ${BACKEND_DIR}/.env
                echo "SECRET_KEY=${SECRET_KEY}" >> ${BACKEND_DIR}/.env
                echo "GOOGLE_API_KEY=${GOOGLE_API_KEY}" >> ${BACKEND_DIR}/.env

                echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" > ${FRONTEND_DIR}/.env.local
                '''
            }
        }
        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        dir(BACKEND_DIR) {
                            sh '''
                            python -m venv .venv
                            source .venv/bin/activate
                            pip install --upgrade pip
                            pip install -r requirements.txt
                            '''
                        }
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        dir(FRONTEND_DIR) {
                            sh '''
                            npm install
                            npm run build
                            '''
                        }
                    }
                }
            }
        }
        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        dir(BACKEND_DIR) {
                            sh '''
                            source .venv/bin/activate
                            python manage.py test --verbosity=2
                            '''
                        }
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        dir(FRONTEND_DIR) {
                            sh '''
                            npm run test
                            '''
                        }
                    }
                }
            }
        }
        stage('Build and Deploy') {
            steps {
                sh '''
                docker-compose -f ${DOCKER_COMPOSE_FILE} down
                docker-compose -f ${DOCKER_COMPOSE_FILE} up --build -d
                '''
            }
        }
    }
    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Build and deployment successful.'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}