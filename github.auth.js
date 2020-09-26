const axios = require('axios');
const clientId = 'e6a046ccf92cd497c3fe';
const clientSecret = 'e64e236ac64f2c70a3f6f9e2fa44841b9e64498d';

const getGithubAccessToken = async function (code) {
  const OAuthDetails = {
    client_id: clientId,
    client_secret: clientSecret,
    code,
  };
  const headers = { headers: { accept: 'application/json' } };
  const url = 'https://github.com/login/oauth/access_token';
  return axios
    .post(url, OAuthDetails, headers)
    .then(({ data }) => data.access_token);
};

const getUserDetailsByAccessToken = function (accessToken) {
  const options = { headers: { Authorization: `token ${accessToken}` } };
  return axios
    .get('https://api.github.com/user', options)
    .then(({ data }) => data);
};

const authorizeUser = function (request, response) {
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
  response.redirect(url);
};

module.exports = {
  authorizeUser,
  getUserDetailsByAccessToken,
  getGithubAccessToken,
};
