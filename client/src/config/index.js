let domainkey = process.env.domainkey ? process.env.domainkey : 'flowzcluster.tk'
let serverPort = process.env.server_port ? process.env.server_port : '3040'
let socketPort = process.env.server_port ? process.env.socket_port : '4040'

var temp = {
  serverURI: 'http://localhost:' + serverPort,
  socketURI: 'http://localhost:' + socketPort,
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://auth.' + domainkey + '/api',
  facebookSuccessCallbackUrl: 'http://localhost:8000',
  loginWithFacebookUrl: 'http://auth.' + domainkey + '/auth/facebook',
  googleSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGoogleUrl: 'http://auth.' + domainkey + '/auth/Gplus',
  twitterSuccessCallbackUrl: 'http://localhost:8000',
  loginWithTwitterUrl: 'http://auth.' + domainkey + '/auth/twitter',
  linkedinSuccessCallbackUrl: 'http://localhost:8000',
  loginWithLinkedinUrl: 'http://auth.' + domainkey + '/auth/linkedin',
  githubSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGithubUrl: 'http://auth.' + domainkey + '/auth/github',
  jobQueueUrl: 'http://api.' + domainkey + '/rjobqueue1/job/create'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.' + domainkey + '/dbetl', // 'http://api.' + process.env.domainkey + '/dbetl', // ws.' + process.env.domainkey + ':4034
    socketURI: 'ws://ws.' + domainkey + ':' + socketPort,
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://auth.' + domainkey + '/api',
    facebookSuccessCallbackUrl: 'http://dbetl.' + domainkey + '/',
    loginWithFacebookUrl: 'http://auth.' + domainkey + '/auth/facebook',
    googleSuccessCallbackUrl: 'http://dbetl.' + domainkey + '/',
    loginWithGoogleUrl: 'http://auth.' + domainkey + '/auth/Gplus',
    linkedinSuccessCallbackUrl: 'http://dbetl.' + domainkey + '/',
    loginWithLinkedinUrl: 'http://auth.' + domainkey + '/auth/linkedin',
    githubSuccessCallbackUrl: 'http://dbetl.' + domainkey + '/',
    loginWithGithubUrl: 'http://auth.' + domainkey + '/auth/github',
    jobQueueUrl: 'http://api.' + domainkey + '/rjobqueue1/job/create'
  }
}
export default temp
