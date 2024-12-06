pipeline {
    agent any

    stage('Checkout Code') {
        steps {
            checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/jenkins']],
                    userRemoteConfigs: [[url: 'https://github.com/khiemta03/ci-cd-demo']]
                ])
            }
        }

    post {
        always {
            cleanWs()
        }
    }
}
