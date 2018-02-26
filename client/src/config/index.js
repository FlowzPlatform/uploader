let domainkey = process.env.domainkey ? process.env.domainkey : 'flowzcluster.tk'
let serverPort = process.env.server_port ? process.env.server_port : '3040'
let socketPort = process.env.socket_port ? process.env.socket_port : '4040'
let isSSl = process.env.is_ssl ? process.env.is_ssl : false
let protocol = ''

if (isSSl === 'true') {
  protocol = 'http'
} else {
  protocol = 'https'
}

var temp = {
  serverURI: protocol + '://localhost:' + serverPort,
  socketURI: protocol + '://localhost:' + socketPort,
  fixedLayout: false,
  hideLogoOnMobile: false,
  microURI: 'https://api.' + domainkey + '/auth/api',
  facebookSuccessCallbackUrl: protocol + '://localhost:8000/' + 'uploader-joblist',
  loginWithFacebookUrl: protocol + '://auth.' + domainkey + '/auth/facebook',
  googleSuccessCallbackUrl: protocol + '://localhost:8000/' + 'uploader-joblist',
  loginWithGoogleUrl: protocol + '://auth.' + domainkey + '/auth/Gplus',
  twitterSuccessCallbackUrl: protocol + '://localhost:8000/' + 'uploader-joblist',
  loginWithTwitterUrl: protocol + '://auth.' + domainkey + '/auth/twitter',
  linkedinSuccessCallbackUrl: protocol + '://localhost:8000/' + 'uploader-joblist',
  loginWithLinkedinUrl: protocol + '://auth.' + domainkey + '/auth/linkedin',
  githubSuccessCallbackUrl: protocol + '://localhost:8000/' + 'uploader-joblist',
  loginWithGithubUrl: protocol + '://auth.' + domainkey + '/auth/github',
  jobQueueUrl: protocol + '://api.' + domainkey + '/rjobqueue1/job/create',
  subscriptionUri: 'https://api.' + domainkey + '/subscription/user-subscription',
  getUserdetailUri: 'https://api.' + domainkey + '/user/getuserdetails/',
  resetPasswordRedirectUrl: 'https://uploader.' + domainkey + '/reset-password',
  resetPasswordUrl: 'https://api.' + domainkey + '/auth/api/resetpassword',
  forgotPasswordUrl: 'https://api.' + domainkey + '/auth/api/forgetpassword'
}
if (process.env.MYENV !== 'development') {
  temp = {
    serverURI: protocol + '://api.' + domainkey + '/uploader', // 'http://api.' + process.env.domainkey + '/dbetl', // ws.' + process.env.domainkey + ':4034
    socketURI: 'wss://ws.' + domainkey + ':' + socketPort,
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'https://api.' + domainkey + '/auth/api',
    facebookSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/uploader-joblist',
    loginWithFacebookUrl: protocol + '://auth.' + domainkey + '/auth/facebook',
    googleSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/uploader-joblist',
    loginWithGoogleUrl: protocol + '://auth.' + domainkey + '/auth/Gplus',
    twitterSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/uploader-joblist',
    loginWithTwitterUrl: protocol + '://auth.' + domainkey + '/auth/twitter',
    linkedinSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/uploader-joblist',
    loginWithLinkedinUrl: protocol + '://auth.' + domainkey + '/auth/linkedin',
    githubSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/uploader-joblist',
    loginWithGithubUrl: protocol + '://auth.' + domainkey + '/auth/github',
    jobQueueUrl: protocol + '://api.' + domainkey + '/rjobqueue1/job/create',
    subscriptionUri: 'https://api.' + domainkey + '/subscription/user-subscription',
    getUserdetailUri: 'https://api.' + domainkey + '/user/getuserdetails/',
    resetPasswordRedirectUrl: 'https://uploader.' + domainkey + '/reset-password',
    resetPasswordUrl: 'https://api.' + domainkey + '/auth/api/resetpassword',
    forgotPasswordUrl: 'https://api.' + domainkey + '/auth/api/forgetpassword'
  }
}

export default temp
