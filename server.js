const appServer = require("./src/app")
const { dbConnect } = require("./src/config/db.config.js");
const appLogger = require("./src/logger/index.js");
const { errorMiddleWareModule } = require("./src/middlewares/index.js"); 
const config = require("./src/config/env.js");
const { engine } = require ('express-handlebars');  
const expressWinston = require('express-winston'); 
const { defaultAdminAccount } = require("./src/controllers/auth.controller.js");
const Router = require("./src/routes/index.js");
const rateLimit = require('express-rate-limit');

appServer.engine('.handlebars', engine({extname: '.handlebars'}));
appServer.set('view engine', '.handlebars');
appServer.set('views', '../src/views');

appServer.use("/api/v1", Router); 
 
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

appServer.use(limiter);
const PORT = config.SERVER_PORT || 4000;
appServer.all("*", errorMiddleWareModule.notFound);
appServer.use(errorMiddleWareModule.errorHandler);
appServer.use(expressWinston.logger(appLogger))

appServer.listen(PORT, async () => {
  try {
    await dbConnect.MongoDB();
    await defaultAdminAccount();
     
    appLogger.info(`server running on port ${PORT}`, {service:"application"});
  } catch (error) {
    appLogger.error(error, {service:"application"});
    // eslint-disable-next-line no-undef
    process.exit(-1);
  }
});
