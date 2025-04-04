const AccountModule = require("./account.service");
const ProfileModule = require("./profile.service");
const EventModule = require("./event.service");
// ACCOUNT SECTION
exports.createAccount = async (details) => await AccountModule.create(details);
exports.emailExist = async (email) => AccountModule.emailExists(email);
exports.getAccountByToken = async (token) => await AccountModule.accountExistByToken(token);
exports.userExistById = async (id) => await AccountModule.accountExistById(id);
exports.temporalAccountExist = async (query) => await AccountModule.findTemporalAccount(query);
exports.updateAccount = async (id, info) => await AccountModule.update(id, info);
exports.removeAccount = async (id) => await AccountModule.delete(id);
exports.defaultAccount = async ( details ) => await AccountModule.defaultRegistration( details )
exports.removeAccountByEmail = async (email) => await AccountModule.deleteByEmail(email);
exports.removeTempData = async (query) => await AccountModule.removeTemp(query);
exports.createTemporalInfo = async (info) => await AccountModule.createTempAccount(info);

// PROFILE SECTION 
exports.getExistingPicture = async (userId) => await ProfileModule.existingProfile(userId);
exports.updateAccountProfile = async (account, info) => await ProfileModule.update(account, info)
exports.viewProfile = async (userId) => await ProfileModule.view(userId);
exports.viewArtistProfiles = async (userId) => await ProfileModule.viewArtist(userId);

// EVENT SECTION
exports.createEvent = async (details) => await EventModule.create(details);
exports.updateEvent = async (eventid, details) => await EventModule.update(eventid, details);
exports.getEvents = async (query) => await EventModule.events(query);
exports.getEventById = async (eventId) => await EventModule.eventExistById(eventId);
exports.removeEvent = async (eventId) => await EventModule.delete(eventId);
exports.sendInvite = async (eventId, invite) => await EventModule.inviteArtist(eventId, invite);