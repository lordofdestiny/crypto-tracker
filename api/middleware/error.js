const utils = require("../../utils/utils");

const error_not_found = (req, res, next) => {
  const { err } = res.locals;
  console.log(res.locals.err);
  if (err) next(err);
  else {
    const error = new Error(`Request failed - Not found`);
    error.status = 404;
    next(error);
  }
};

const error_not_catched = (error, req, res, next) => {
  if (!error.status) error.status = 500;
  res.status(error.status);
  res.render("error", { title: "Error", error, stack: true });
};

module.exports = {
  error_not_found,
  error_not_catched
};
