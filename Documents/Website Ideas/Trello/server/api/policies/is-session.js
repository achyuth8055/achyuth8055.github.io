
module.exports = async function isSession(req, res, proceed) {
  if (!req.currentSession) {
    return res.notFound(); // Forbidden
  }

  return proceed();
};
