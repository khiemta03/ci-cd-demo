pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
        // docker 'Docker'
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
        stage ('Install dependencies'){
            steps{
                script{    sh '''
                            apt-get update
                            apt-get install -y docker.io unzip curl
                            rm -rf awscliv2.zip aws/
                            curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
                            unzip -o awscliv2.zip
                            ./aws/install
                        '''
                    
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
                            def imageTag = "${env.BUILD_NUMBER ?: 'latest'}"
                            sh """
                                docker build -t ${ECR_REPOSITORY}:${imageTag} .
                                docker tag ${ECR_REPOSITORY}:${imageTag} ${ECR_REGISTRY}/${ECR_REPOSITORY}:${imageTag}
                                docker push ${ECR_REGISTRY}/${ECR_REPOSITORY}:${imageTag}
                            """
                        }
                    }
                }

        //         stage('Update ECS Service') {
        //             steps {
        //                 script {
        //                     // Fetch current task definition
        //                     sh """
        //                         aws ecs describe-task-definition --task-definition ${ECS_SERVICE} --query taskDefinition > task-definition.json
        //                     """

        //                     // Modify the task definition with the new image
        //                     def taskDef = readJSON file: 'task-definition.json'
        //                     taskDef.containerDefinitions.find { it.name == CONTAINER_NAME }.image = "${ECR_REGISTRY}/${ECR_REPOSITORY}:${env.BUILD_NUMBER}"
        //                     writeJSON file: 'new-task-definition.json', json: taskDef

        //                     // Register new task definition and update ECS service
        //                     sh """
        //                         NEW_TASK_DEF=$(aws ecs register-task-definition --cli-input-json file://new-task-definition.json --query 'taskDefinition.taskDefinitionArn' --output text)
        //                         aws ecs update-service --cluster ${ECS_CLUSTER} --service ${ECS_SERVICE} --task-definition $NEW_TASK_DEF --force-new-deployment
        //                     """
        //                 }
        //             }
        //         }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
