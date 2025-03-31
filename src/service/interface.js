const AccountModule = require("./account.service");

// ACCOUNT SECTION
exports.createAccount = async (details) => await AccountModule.create(details);
exports.emailExist = async (email) => AccountModule.emailExists(email);
exports.getAccountByToken = async (token) => await AccountModule.accountExistByToken(token);
exports.temporalAccountExist = async (query) => await AccountModule.findTemporalAccount(query);
exports.updateAccount = async (id, info) => await AccountModule.update(id, info);
exports.removeAccount = async (id) => await AccountModule.delete(id);
exports.defaultAccount = async ( details ) => await AccountModule.defaultRegistration( details )
exports.removeAccountByEmail = async (email) => await AccountModule.deleteByEmail(email);