// Validation middleware placeholder
module.exports = function validate(_schema) {
  return (req, _res, next) => {
    // TODO: validate req.body/params/query with schema
    next();
  };
};
