
var temp = {
  serverURI: 'http://localhost:' + process.env.server_port,
  socketURI: 'http://localhost:' + process.env.socket_port,
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://auth.' + process.env.domainkey + '/api',
  facebookSuccessCallbackUrl: 'http://localhost:8000',
  loginWithFacebookUrl: 'http://auth.' + process.env.domainkey + '/auth/facebook',
  googleSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGoogleUrl: 'http://auth.' + process.env.domainkey + '/auth/Gplus',
  twitterSuccessCallbackUrl: 'http://localhost:8000',
  loginWithTwitterUrl: 'http://auth.' + process.env.domainkey + '/auth/twitter',
  linkedinSuccessCallbackUrl: 'http://localhost:8000',
  loginWithLinkedinUrl: 'http://auth.' + process.env.domainkey + '/auth/linkedin',
  githubSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGithubUrl: 'http://auth.' + process.env.domainkey + '/auth/github',
  jobQueueUrl: 'http://api.' + process.env.domainkey + '/rjobqueue1/job/create'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.' + process.env.domainkey + '/dbetl', // 'http://api.' + process.env.domainkey + '/dbetl', // ws.' + process.env.domainkey + ':4034
    socketURI: 'ws://ws.' + process.env.domainkey + ':' + process.env.socket_port,
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://auth.' + process.env.domainkey + '/api',
    facebookSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithFacebookUrl: 'http://auth.' + process.env.domainkey + '/auth/facebook',
    googleSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithGoogleUrl: 'http://auth.' + process.env.domainkey + '/auth/Gplus',
    linkedinSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithLinkedinUrl: 'http://auth.' + process.env.domainkey + '/auth/linkedin',
    githubSuccessCallbackUrl: 'http://dbetl.' + process.env.domainkey + '/',
    loginWithGithubUrl: 'http://auth.' + process.env.domainkey + '/auth/github',
    jobQueueUrl: 'http://api.' + process.env.domainkey + '/rjobqueue1/job/create'
  }
}
export default temp
