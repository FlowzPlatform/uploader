let domainkey = process.env.domainkey ? process.env.domainkey : 'flowzcluster.tk'
let serverPort = process.env.server_port ? process.env.server_port : '3040'
let socketPort = process.env.socket_port ? process.env.socket_port : '4040'
let isSSl = process.env.is_ssl ? process.env.is_ssl : false
let protocol = ''

if (isSSl === 'true') {
  protocol = 'https'
} else {
  protocol = 'http'
}

var temp = {
  serverURI: protocol + '://localhost:' + serverPort,
  socketURI: protocol + '://localhost:' + socketPort,
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: protocol + '://auth.' + domainkey + '/api',
  facebookSuccessCallbackUrl: protocol + '://localhost:8000',
  loginWithFacebookUrl: protocol + '://auth.' + domainkey + '/auth/facebook',
  googleSuccessCallbackUrl: protocol + '://localhost:8000',
  loginWithGoogleUrl: protocol + '://auth.' + domainkey + '/auth/Gplus',
  twitterSuccessCallbackUrl: protocol + '://localhost:8000',
  loginWithTwitterUrl: protocol + '://auth.' + domainkey + '/auth/twitter',
  linkedinSuccessCallbackUrl: protocol + '://localhost:8000',
  loginWithLinkedinUrl: protocol + '://auth.' + domainkey + '/auth/linkedin',
  githubSuccessCallbackUrl: protocol + '://localhost:8000',
  loginWithGithubUrl: protocol + '://auth.' + domainkey + '/auth/github',
  jobQueueUrl: protocol + '://api.' + domainkey + '/rjobqueue1/job/create'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: protocol + '://api.' + domainkey + '/uploader', // 'http://api.' + process.env.domainkey + '/dbetl', // ws.' + process.env.domainkey + ':4034
    socketURI: 'ws://ws.' + domainkey + ':' + socketPort,
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: protocol + '://auth.' + domainkey + '/api',
    facebookSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithFacebookUrl: protocol + '://auth.' + domainkey + '/auth/facebook',
    googleSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithGoogleUrl: protocol + '://auth.' + domainkey + '/auth/Gplus',
    linkedinSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithLinkedinUrl: protocol + '://auth.' + domainkey + '/auth/linkedin',
    githubSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithGithubUrl: protocol + '://auth.' + domainkey + '/auth/github',
    jobQueueUrl: protocol + '://api.' + domainkey + '/rjobqueue1/job/create'
  }
}

export default temp
