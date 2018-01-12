console.log('process.env.NODE_ENV', process.env)
var temp = {
  serverURI: 'http://localhost:3034',
  socketURI: 'http://localhost:3034',
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'http://auth.flowzcluster.tk/api',
  facebookSuccessCallbackUrl: 'http://localhost:8000',
  loginWithFacebookUrl: 'http://auth.flowz.com/auth/facebook',
  googleSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGoogleUrl: 'http://auth.flowz.com/auth/Gplus',
  twitterSuccessCallbackUrl: 'http://localhost:8000',
  loginWithTwitterUrl: 'http://auth.flowz.com/auth/twitter',
  linkedinSuccessCallbackUrl: 'http://localhost:8000',
  loginWithLinkedinUrl: 'http://auth.flowz.com/auth/linkedin',
  githubSuccessCallbackUrl: 'http://localhost:8000',
  loginWithGithubUrl: 'http://auth.flowz.com/auth/github',
  jobQueueUrl: 'http://api.flowzcluster.tk/rjobqueue1/job/create'
}
if (process.env.NODE_ENV !== 'development') {
  temp = {
    serverURI: 'http://api.flowz.com/dbetl', // 'http://api.flowz.com/dbetl', // ws.flowz.com:4034
    socketURI: 'http://ws.flowz.com:3034',
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'http://auth.flowz.com/api',
    facebookSuccessCallbackUrl: 'http://dbetl.flowz.com/',
    loginWithFacebookUrl: 'http://auth.flowz.com/auth/facebook',
    googleSuccessCallbackUrl: 'http://dbetl.flowz.com/',
    loginWithGoogleUrl: 'http://auth.flowz.com/auth/Gplus',
    linkedinSuccessCallbackUrl: 'http://dbetl.flowz.com/',
    loginWithLinkedinUrl: 'http://auth.flowz.com/auth/linkedin',
    githubSuccessCallbackUrl: 'http://dbetl.flowz.com/',
    loginWithGithubUrl: 'http://auth.flowz.com/auth/github',
    jobQueueUrl: 'http://api.flowzcluster.tk/rjobqueue1/job/create'
  }
}
export default temp
