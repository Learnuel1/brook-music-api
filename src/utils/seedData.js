const removeAuth = (dataObj) => {
  // eslint-disable-next-line no-unused-vars
  const {_id, password, refreshToken, ...data} = dataObj;
  return data;
} 
const reqResponse = (message, data, field = "data", others = {}, op = true) => {
  const response = {
    success: op,
    message,
    [field]: data,
    ...others,
  };
  return response;
}
module.exports = {
  removeAuth,
  reqResponse, 
}