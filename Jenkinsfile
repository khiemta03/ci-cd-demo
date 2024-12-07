pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        AWS_REGION = 'ap-southeast-2'
        ECR_REPOSITORY = 'advanced_web'
        ECS_CLUSTER = 'AdvancedWeb'
        ECS_SERVICE = 'UserAPIs'
        CONTAINER_NAME = 'UserAPI'
        AWS_ACCESS_KEY_ID = credentials('aws-access-key-id')
        AWS_SECRET_ACCESS_KEY = credentials('aws-secret-access-key')
        ECR_REGISTRY = "149536464852.dkr.ecr.${AWS_REGION}.amazonaws.com"
    }

    stages {
        stage('Set PATH') {
            steps {
                script {
                    env.PATH = "/usr/local/bin:${env.PATH}"
                    sh 'echo $PATH'
                }
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Build & Test') {

            steps {
                echo 'Installing dependencies'
                sh 'npm ci'
                echo 'Building'
                sh 'npm run build --if-present'
                echo 'Testing'
                sh 'npm test'
            }
        }

        stage('Deploy to AWS') {
            stages {
                stage('Login to ECR') {
                    steps {
                        script {
                            sh """
                                aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
                            """
                        }
                    }
                }

                stage('Build & Push Docker Image') {
                    steps {
                        script {
                            def imageTag = "${GIT_COMMIT}"
                            sh """
                                docker build -t ${ECR_REGISTRY}/${ECR_REPOSITORY}:${imageTag} .
                                docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:${imageTag}
                            """
                        }
                    }
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
