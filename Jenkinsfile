nodePod { label ->
  runInNode(label) {
    container('node') {
      npmLogin()

      stage('NPM Install') {
        sh '''
        npm install
        '''
      }

      stage('Build') {
        sh '''
        npm run build
        npm run dist
        '''
      }

      stage('NPM Publish') {
        sh 'npm publish dist'
      }

      stage('Docker Prep') {
        sh 'npm run docker-prep'
      }
    }

    def containerName = "convergence-admin-console"
    stage('Docker Build') {
      container('docker') {
        dir('docker-build') {
          dockerBuild(containerName)
        }
      }
    }

    stage('Docker Push') {
      container('docker') {
        dockerPush(containerName, ["latest", env.GIT_COMMIT])
      }
    }
  }
}
