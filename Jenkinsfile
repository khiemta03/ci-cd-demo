pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {
            tools {
                nodejs 'NodeJS'
            }

            steps {
                sh 'npm ci'
                sh 'npm run build --if-present'
                sh 'npm test'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
