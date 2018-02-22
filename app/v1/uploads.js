/////////////////////////
// Requires
///////////////////////// 

const errorCodes    = require("../common/errorCodes.js")
const fileStorage   = require("../../config/fileStorage.js");

module.exports =  function(express, version, passport){

  /////////////////////////
  // Constants
  /////////////////////////

  //Paths
  const IMAGE_UPLOAD_ROUTE  = "/image_upload";
  const EMPTY_PATH          = "";
  //Error Messages
  const IMAGE_FAILED_MOVE_ERROR = "Internal Error: Failed to move images";
  const IMAGE_FAILED_UPLOAD     = 'No files were uploaded';

  /////////////////////////
  // Helper functions 
  /////////////////////////

  function determineStorageRoute(imageType){



  }

  // Helper function:  Moves image to supplied path
  // Promise return an array of file names if resolved.
  function moveImages(files, path){

   let fileNamesArray = [];

   return new Promise(function(resolve, reject){
    // Loop threw all the images and move them to the path
     Object.keys(files).map((key, index) => {
       let currentFile = files[key];
       currentFile.mv(path + currentFile.name, function(err){
         if(err)
           reject(Error(IMAGE_FAILED_MOVE_ERROR));
       });
       fileNamesArray[fileNamesArray.length] = currentFile.name;
     });
     resolve(fileNamesArray);  
   })

  }

  /////////////////////////
  // Request Handlers 
  /////////////////////////

  // Handles image upload request, on success response 
  // sends an array with image names
  function imageUpload(req, res, next){

  if (!req.files)
    return res.status(errorCodes.ERROR_CODE_400).jsend.fail({message: IMAGE_FAILED_UPLOAD});

	 moveImages(req.files, fileStorage.images)
   .then(function(imageNamesArray){
    res.jsend.success(imageNamesArray);
   }).catch(function(err){
    console.log(err);
    res.status(errorCodes.ERROR_CODE_500).jsend.fail(IMAGE_FAILED_MOVE_ERROR);
   })  

  }

  /////////////////////////
  //Routes
  /////////////////////////

  version.use(IMAGE_UPLOAD_ROUTE, express.Router().post(EMPTY_PATH, imageUpload));

}