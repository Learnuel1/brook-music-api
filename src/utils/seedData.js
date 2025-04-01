const removeAuth = (dataObj) => {
  // eslint-disable-next-line no-unused-vars
  const {password, refreshToken, ...data} = dataObj;
  return data;
}
  
const reqResponse = (msg, data, field = "data", others = {}, op = true) => {
  const response = {
    success: op,
    msg,
    [field]: data,
    ...others,
  };
  return response;
}
module.exports = {
  removeAuth,
  reqResponse, 
}