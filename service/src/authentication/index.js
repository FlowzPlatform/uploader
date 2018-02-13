const axios = require('axios');
let domainkey = process.env.domainKey ? process.env.domainKey : 'flowzcluster.tk'

var checkAuth = (authToken) => {
  return axios({
    method: 'get',
    url: 'https://api.' + domainkey + 'auth/api/userdetails', // 'http://ec2-54-88-11-110.compute-1.amazonaws.com/api/userdetails',
    headers: {
      'authorization': authToken
    }
  }).then(response => {
    if (response) {
      return response.data.data;
    } else {
      return
    }
  }).catch(error => {
    return
  });
};

module.exports = async(req, res, next) => {
  // req.feathers.headers = req.headers;
  var user = await checkAuth(req.headers.authorization)
  if (user) {
    // req.feathers.headers = req.headers
    req.feathers.user = user
    next();
  } else {
    res.send(401, 'invalid token...');
    return false;
  }
};
