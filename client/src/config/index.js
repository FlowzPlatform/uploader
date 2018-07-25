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
  facebookSuccessCallbackUrl: protocol + '://localhost:8000/',
  loginWithFacebookUrl: protocol + '://auth.' + domainkey + '/auth/facebook',
  googleSuccessCallbackUrl: protocol + '://localhost:8000/',
  loginWithGoogleUrl: protocol + '://auth.' + domainkey + '/auth/google',
  twitterSuccessCallbackUrl: protocol + '://localhost:8000/',
  loginWithTwitterUrl: protocol + '://auth.' + domainkey + '/auth/twitter',
  linkedinSuccessCallbackUrl: protocol + '://localhost:8000/',
  loginWithLinkedinUrl: protocol + '://auth.' + domainkey + '/auth/linkedin',
  githubSuccessCallbackUrl: protocol + '://localhost:8000/',
  loginWithGithubUrl: protocol + '://auth.' + domainkey + '/auth/github',
  jobQueueUrl: protocol + '://api.' + domainkey + '/rjobqueue1/job/create',
  subscriptionUri: 'https://api.' + domainkey + '/subscription/user-subscription',
  subscriptionUrl: 'https://api.' + domainkey + '/subscription/',
  userDetail: 'https://api.' + domainkey + '/auth/api/userdetails',
  baseUrl: 'https://api.' + domainkey,
  getUserdetailUri: 'https://api.' + domainkey + '/user/getuserdetails/',
  resetPasswordRedirectUrl: 'https://www.uploader.' + domainkey + '/reset-password',
  resetPasswordUrl: 'https://api.' + domainkey + '/auth/api/resetpassword',
  forgotPasswordUrl: 'https://api.' + domainkey + '/auth/api/forgetpassword',
  flowzDashboardUrl: 'https://www.dashboard.' + domainkey,
  crmUrl: 'https://www.crm.' + domainkey,
  websiteBuilderUrl: 'https://www.webbuilder.' + domainkey,
  cloudinaryUrl: 'https://api.' + domainkey + '/crm/cloudinaryupload',
  vshopUrl: 'https://api.flowzcluster.tk/pdmnew/vshop-list?supplier=true&all=1',
  asiUrl: 'https://sandbox-productservice.asicentral.com/api/v4/',
  vshoplist: 'https://api.' + domainkey + '/pdmnew/vshop-list',
  pdmnew: 'https://api.' + domainkey + '/pdmnew/pdm?$limit=9999'
}
if (process.env.MYENV !== 'development') {
  temp = {
    serverURI: protocol + '://api.' + domainkey + '/uploader', // 'http://api.' + process.env.domainkey + '/dbetl', // ws.' + process.env.domainkey + ':4034
    socketURI: 'wss://ws.' + domainkey + ':' + socketPort,
    fixedLayout: false,
    hideLogoOnMobile: false,
    microURI: 'https://api.' + domainkey + '/auth/api',
    facebookSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithFacebookUrl: protocol + '://auth.' + domainkey + '/auth/facebook',
    googleSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithGoogleUrl: protocol + '://auth.' + domainkey + '/auth/google',
    twitterSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithTwitterUrl: protocol + '://auth.' + domainkey + '/auth/twitter',
    linkedinSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithLinkedinUrl: protocol + '://auth.' + domainkey + '/auth/linkedin',
    githubSuccessCallbackUrl: protocol + '://uploader.' + domainkey + '/',
    loginWithGithubUrl: protocol + '://auth.' + domainkey + '/auth/github',
    jobQueueUrl: protocol + '://api.' + domainkey + '/rjobqueue1/job/create',
    subscriptionUri: 'https://api.' + domainkey + '/subscription/user-subscription',
    subscriptionUrl: 'https://api.' + domainkey + '/subscription/',
    userDetail: 'https://api.' + domainkey + '/auth/api/userdetails',
    baseUrl: 'https://api.' + domainkey,
    getUserdetailUri: 'https://api.' + domainkey + '/user/getuserdetails/',
    resetPasswordRedirectUrl: 'https://www.uploader.' + domainkey + '/reset-password',
    resetPasswordUrl: 'https://api.' + domainkey + '/auth/api/resetpassword',
    forgotPasswordUrl: 'https://api.' + domainkey + '/auth/api/forgetpassword',
    flowzDashboardUrl: 'https://www.dashboard.' + domainkey,
    crmUrl: 'https://www.crm.' + domainkey,
    websiteBuilderUrl: 'https://www.webbuilder.' + domainkey,
    cloudinaryUrl: 'https://api.' + domainkey + '/crm/cloudinaryupload',
    vshopUrl: 'https://api.' + domainkey + '/pdmnew/vshop-list?supplier=true&all=1',
    asiUrl: 'https://sandbox-productservice.asicentral.com/api/v4/',
    vshoplist: 'https://api.' + domainkey + '/pdmnew/vshop-list',
    pdmnew: 'https://api.' + domainkey + '/pdmnew/pdm?$limit=9999'
  }
}

export default temp
