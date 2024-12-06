pipeline {
    agent any

    stages {
        stage('Checkout Code') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/jenkins']],
                    userRemoteConfigs: [[url: 'https://github.com/khiemta03/ci-cd-demo']]
                ])
            }
        }

        stage('Build and Test') {
            steps {
                sh 'npm install'
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
