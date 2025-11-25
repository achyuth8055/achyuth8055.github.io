
module.exports = async function isAuthenticated(req, res, proceed) {
  if (!req.currentUser) {
    // TODO: provide separate error for API keys?
    return res.unauthorized('Access token is missing, invalid or expired');
  }

  return proceed();
};
