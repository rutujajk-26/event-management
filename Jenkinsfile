pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "campustix-api"
        DOCKER_TAG = "${env.BUILD_NUMBER}"
        REGISTRY = "docker.io/your-dockerhub-username"
        KUBECONFIG_CREDENTIAL = 'kubeconfig-credentials'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Setup Python') {
            steps {
                echo 'Setting up Python virtual environment...'
                sh '''
                    python3 -m venv venv
                    . venv/bin/activate
                    pip install --upgrade pip
                    pip install -r backend/requirements.txt
                '''
            }
        }

        stage('Lint') {
            steps {
                echo 'Running linter...'
                sh '''
                    . venv/bin/activate
                    pip install flake8
                    flake8 backend/ --max-line-length=120 --exclude=venv,__pycache__
                '''
            }
        }

        stage('Test') {
            steps {
                echo 'Running unit tests...'
                sh '''
                    . venv/bin/activate
                    cd backend
                    python -m pytest tests/ -v --tb=short --junitxml=test-results.xml
                '''
            }
            post {
                always {
                    junit 'backend/test-results.xml'
                }
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "Building Docker image: ${DOCKER_IMAGE}:${DOCKER_TAG}"
                sh '''
                    docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} .
                    docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${DOCKER_IMAGE}:latest
                '''
            }
        }

        stage('Security Scan') {
            steps {
                echo 'Scanning Docker image for vulnerabilities...'
                sh '''
                    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                        aquasec/trivy image --exit-code 0 --severity HIGH,CRITICAL \
                        ${DOCKER_IMAGE}:${DOCKER_TAG} || true
                '''
            }
        }

        stage('Push to Registry') {
            when {
                branch 'main'
            }
            steps {
                echo 'Pushing Docker image to registry...'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker tag ${DOCKER_IMAGE}:${DOCKER_TAG} ${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker tag ${DOCKER_IMAGE}:latest ${REGISTRY}/${DOCKER_IMAGE}:latest
                        docker push ${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG}
                        docker push ${REGISTRY}/${DOCKER_IMAGE}:latest
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying to Kubernetes...'
                withCredentials([file(credentialsId: KUBECONFIG_CREDENTIAL, variable: 'KUBECONFIG')]) {
                    sh '''
                        kubectl set image deployment/campustix-api \
                            api=${REGISTRY}/${DOCKER_IMAGE}:${DOCKER_TAG} \
                            --namespace=campustix
                        kubectl rollout status deployment/campustix-api --namespace=campustix --timeout=120s
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Build #${BUILD_NUMBER} succeeded!"
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "CampusTix API build #${BUILD_NUMBER} deployed successfully."
            )
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed!"
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "CampusTix API build #${BUILD_NUMBER} FAILED. Check Jenkins for details."
            )
        }
        always {
            cleanWs()
            sh 'docker system prune -f || true'
        }
    }
}
