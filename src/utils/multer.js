const multer = require("multer")
const { CONSTANTS } = require("../config")

const imageFilter = (req, file, cb) => {
	if (CONSTANTS.IMAGE_FORMAT.includes(file.mimetype)) {
		cb(null, true)
	} else {
		cb(null, false)
		 cb(new Error("Invalid file format or size (3mb or less)"))
	}
}
  
const multerImage = multer({
	storage: multer.diskStorage({}),
	limits: {
		fileSize: 1024 * 1024 * 3
	},
	fileFilter: imageFilter
}) 

module.exports ={
  multerImage, 
}