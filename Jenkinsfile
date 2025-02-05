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
                    sh '''
                    mkdir -p ${PROJECT_DIR}
                    cd ${PROJECT_DIR}
                    if [ -d .git ]; then
                        git pull origin master
                    else
                        git clone git@github.com:viktor-bezai/LearnEnglish.git .
                    fi
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
                        sh '''
                        cat > ${PROJECT_DIR}/.env << EOF
                        POSTGRES_NAME=${POSTGRES_NAME}
                        POSTGRES_USER=${POSTGRES_USER}
                        POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
                        POSTGRES_HOST=${POSTGRES_HOST}
                        POSTGRES_PORT=${POSTGRES_PORT}
                        SECRET_KEY=${SECRET_KEY}
                        GOOGLE_API_KEY=${GOOGLE_API_KEY}
                        NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
                        EOF
                        '''
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh '''
                    cd ${PROJECT_DIR}
                    docker compose build
                    '''
                }
            }
        }

        stage('Deploy Services') {
            steps {
                script {
                    sh '''
                    cd ${PROJECT_DIR}
                    docker compose down --rmi all --volumes --remove-orphans
                    docker system prune -a --volumes -f
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
