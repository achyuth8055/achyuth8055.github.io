
module.exports = async function isExternal(req, res, proceed) {
  if (req.currentUser.id === User.INTERNAL.id) {
    return res.notFound(); // Forbidden
  }

  return proceed();
};
