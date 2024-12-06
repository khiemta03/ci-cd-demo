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

        stage('Build & Test') {
            stage('Install Dependencies') {
                steps {
                        sh 'npm install'
                    }
                }
                stage('Build') {
                    steps {
                        sh 'npm run build --if-present'
                    }
                }
                stage('Test') {
                    steps {
                        sh 'npm test'
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
