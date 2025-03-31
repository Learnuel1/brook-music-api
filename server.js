const appServer = require("./src/app")
const { dbConnect } = require("./src/config/db.config.js");
const appLogger = require("./src/logger/index.js");
const { errorMiddleWareModule } = require("./src/middlewares/index.js"); 
const config = require("./src/config/env.js");
const server = require("http").createServer(appServer);
const { engine } = require ('express-handlebars');  
const { defaultAdminAccount } = require("./src/api/admin/controller/admin_account.controller.js");
const { sendEMail } = require("./src/utils/mailer.js");
const expressWinston = require('express-winston'); 
const Router = require("./src/routes/index.js");

server.engine('.handlebars', engine({extname: '.handlebars'}));
server.set('view engine', '.handlebars');
server.set('views', '../src/views');

server.use("/api/v1", Router); 
 
 
const PORT = config.SERVER_PORT || 4000;
server.all("*", errorMiddleWareModule.notFound);
server.use(errorMiddleWareModule.errorHandler);
server.use(expressWinston.logger(appLogger))
server.listen(PORT, async () => {
  try {
    await dbConnect.MongoDB();
    // await defaultAdminAccount();
     
    appLogger.info(`server running on port ${PORT}`, {service:"application"});
  } catch (error) {
    appLogger.error(error, {service:"application"});
    // eslint-disable-next-line no-undef
    process.exit(-1);
  }
});
