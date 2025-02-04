pipeline {
    agent any

    environment {
        PROJECT_DIR = "/var/www/viktorbezai"
        BRANCH = "master"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: BRANCH, url: 'git@github.com:viktor-bezai/LearnEnglish.git'
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
                    sh '''
                    echo "POSTGRES_NAME=$POSTGRES_NAME" > $PROJECT_DIR/.env
                    echo "POSTGRES_USER=$POSTGRES_USER" >> $PROJECT_DIR/.env
                    echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> $PROJECT_DIR/.env
                    echo "POSTGRES_HOST=$POSTGRES_HOST" >> $PROJECT_DIR/.env
                    echo "POSTGRES_PORT=$POSTGRES_PORT" >> $PROJECT_DIR/.env
                    echo "SECRET_KEY=$SECRET_KEY" >> $PROJECT_DIR/.env
                    echo "GOOGLE_API_KEY=$GOOGLE_API_KEY" >> $PROJECT_DIR/.env
                    echo "NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" >> $PROJECT_DIR/.env
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Backend Dependencies') {
                    steps {
                        sh '''
                        sudo apt-get update -y
                        sudo apt-get install -y python3 python3-venv python3-pip
                        cd $PROJECT_DIR/backend
                        python3 -m venv .venv
                        source .venv/bin/activate
                        pip install -r requirements.txt
                        deactivate
                        '''
                    }
                }
                stage('Frontend Dependencies') {
                    steps {
                        sh '''
                        cd $PROJECT_DIR/frontend
                        npm install
                        npm run build
                        '''
                    }
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('Backend Tests') {
                    steps {
                        sh '''
                        cd $PROJECT_DIR/backend
                        source .venv/bin/activate
                        python manage.py test
                        deactivate
                        '''
                    }
                }
                stage('Frontend Tests') {
                    steps {
                        sh '''
                        cd $PROJECT_DIR/frontend
                        npm test
                        '''
                    }
                }
            }
        }

        stage('Build and Deploy') {
            steps {
                sh '''
                cd $PROJECT_DIR
                docker-compose down
                docker-compose build --no-cache
                docker-compose up -d
                '''
            }
        }

        stage('Restart Nginx') {
            steps {
                sh 'sudo systemctl reload nginx'
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful!'
        }
        failure {
            echo 'Build or deployment failed.'
        }
    }
}
