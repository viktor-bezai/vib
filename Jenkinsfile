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
                    sh """
                    mkdir -p ${PROJECT_DIR}
                    cd ${PROJECT_DIR}
                    if [ -d .git ]; then
                        git pull origin master
                    else
                        git clone git@github.com:viktor-bezai/LearnEnglish.git .
                    fi
                    """
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
                        sh """
                        echo "POSTGRES_NAME=${POSTGRES_NAME}" > ${PROJECT_DIR}/.env
                        echo "POSTGRES_USER=${POSTGRES_USER}" >> ${PROJECT_DIR}/.env
                        echo "POSTGRES_PASSWORD=${POSTGRES_PASSWORD}" >> ${PROJECT_DIR}/.env
                        echo "POSTGRES_HOST=${POSTGRES_HOST}" >> ${PROJECT_DIR}/.env
                        echo "POSTGRES_PORT=${POSTGRES_PORT}" >> ${PROJECT_DIR}/.env
                        echo "SECRET_KEY=${SECRET_KEY}" >> ${PROJECT_DIR}/.env
                        echo "GOOGLE_API_KEY=${GOOGLE_API_KEY}" >> ${PROJECT_DIR}/.env
                        echo "NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}" >> ${PROJECT_DIR}/.env
                        """
                    }
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    sh "cd ${PROJECT_DIR} && docker compose build"
                }
            }
        }

//         stage('Run Tests') {
//             steps {
//                 script {
//                     sh "cd ${PROJECT_DIR} && docker compose run --rm ${BACKEND_SERVICE} pytest"
//                     sh "cd ${PROJECT_DIR} && docker compose run --rm ${FRONTEND_SERVICE} npm test"
//                 }
//             }
//         }

        stage('Deploy Services') {
            when {
                branch 'main'  // Deploy only on main branch
            }
            steps {
                script {
                    sh """
                    cd ${PROJECT_DIR}
                    docker compose down
                    docker compose up -d --build
                    """
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
