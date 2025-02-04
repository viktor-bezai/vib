pipeline {
    agent any

    environment {
        PROJECT_DIR = "/var/www/viktorbezai"
        BRANCH = "master"
    }

    stages {
        stage('Prepare Deployment Directory') {
            steps {
                sh '''
                if [ ! -d "$PROJECT_DIR" ]; then
                    echo "Error: Directory $PROJECT_DIR does not exist!"
                    exit 1
                fi
                sudo chown -R jenkins:jenkins $PROJECT_DIR
                sudo chmod -R 755 $PROJECT_DIR

                # Remove old code to ensure a clean checkout
                sudo rm -rf $PROJECT_DIR/*
                '''
            }
        }

        stage('Checkout Code') {
            steps {
                sh '''
                cd $PROJECT_DIR
                git clone -b $BRANCH --depth 1 git@github.com:viktor-bezai/LearnEnglish.git .
                '''
            }
        }

        stage('Ensure Backend and Frontend Exist') {
            steps {
                sh '''
                if [ ! -d "$PROJECT_DIR/backend" ]; then
                    echo "Error: Backend directory not found after Git checkout!"
                    exit 1
                fi
                if [ ! -d "$PROJECT_DIR/frontend" ]; then
                    echo "Error: Frontend directory not found after Git checkout!"
                    exit 1
                fi
                '''
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
                    cd $PROJECT_DIR
                    rm -f .env
                    touch .env
                    chmod 600 .env

                    # Write environment variables to .env file
                    echo "POSTGRES_NAME=$POSTGRES_NAME" > .env
                    echo "POSTGRES_USER=$POSTGRES_USER" >> .env
                    echo "POSTGRES_PASSWORD=$POSTGRES_PASSWORD" >> .env
                    echo "POSTGRES_HOST=$POSTGRES_HOST" >> .env
                    echo "POSTGRES_PORT=$POSTGRES_PORT" >> .env
                    echo "SECRET_KEY=$SECRET_KEY" >> .env
                    echo "GOOGLE_API_KEY=$GOOGLE_API_KEY" >> .env
                    echo "NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL" >> .env
                    '''
                }
            }
        }

        stage('Install Dependencies') {
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
