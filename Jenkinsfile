#!/usr/bin/env groovy

pipeline {
	agent {
		docker {
			image 'node:9'
			args '-u 0'
		}
	}
	environment {
		CI = 'true'
		DEBIAN_FRONTEND = 'noninteractive'
	}
	stages {
		stage('Bootstrap') {
			steps {
				echo 'Bootstrapping..'
				sh 'apt-get update && apt-get install -y python3 sox libav-tools'
			}
		}
		stage('Lint') {
			steps {
				echo 'Linting..'
				sh 'make lint-checkstyle'
				checkstyle pattern: 'test/tests.eslint.xml', canComputeNew: false, failedTotalAll: '5', unstableTotalAll: '50'
			}
		}
		stage('Build') {
			steps {
				echo 'Building..'
				sh 'CI=false make'
			}
		}
		stage('Test') {
			when {
				branch 'devel'
			}
			steps {
				echo 'Testing..'
				sh 'make test-coverage'
				junit allowEmptyResults: true, testResults: 'test/jest-test-results.xml'
				publishHTML([allowMissing: false, alwaysLinkToLastBuild: false, keepAll: true, reportDir: 'coverage/lcov-report/', reportFiles: 'index.html', reportName: 'Test Coverage Report', reportTitles: ''])
			}
		}
		stage('Dist') {
			steps {
				echo 'Dist..'
				sh 'make dist'
				archiveArtifacts artifacts: 'dist/*.tar.gz', fingerprint: true
			}
		}
	}
	post {
        always {
            cleanWs()
        }
    }
}
