export const handleServerError = (error, _, next) => {
  error.status = 400;
  next();
};

export const setUpdateOptions = function (next) {
  this.options.new = true;
  this.options.runValidators = true;
  next();
};
