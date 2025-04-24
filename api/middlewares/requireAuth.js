const requireAuth = (req, res, next) => {
  if (!req.auth.userId) {
    return next(new Error("Unauthenticated"));
  }
  next();
};

module.exports = { requireAuth };
