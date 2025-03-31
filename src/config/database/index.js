const { default: mongoose, connect } = require("mongoose");
const logger = require("../../logger");
const config = require("../env");  

 
exports.MongoDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    logger.info("Connecting to Database...", {service:"database"});
    connect(config.DB_URI);
    logger.info("Database Connected Successfully",{service:"database"});
  } catch (error) {
    logger.error(error);
    // eslint-disable-next-line no-undef
    process.exit(-1);
  }
};


