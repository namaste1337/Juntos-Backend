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

 // - Helper function - 
 // Reduces repetition for single and multiple
 // file uploads.
  function moveFile(file, path){
    let currentFile = file;
     currentFile.mv(path + currentFile.name, function(err){
       if(err)
         return err;
     });
  }

  // - Helper function -
  // Moves a single image or an array of images to supplied path.
  // Promise returns an array of file names if resolved.
  function moveImages(files, path){

   let fileNamesArray = [];

   return new Promise(function(resolve, reject){
     // Check if if single file or array.
     if(files.image.length == null){
      let currentFile = files.image;
      let err = moveFile(currentFile, path);
      if(err)
       reject(err);
      fileNamesArray[fileNamesArray.length] = currentFile.name;
     }else{
      files.image.map((object) => {
       let currentFile = object;
       let err = moveFile(currentFile, path);
       if(err)
        reject(err);
       fileNamesArray[fileNamesArray.length] = currentFile.name;
      });
     }
     resolve(fileNamesArray);  
   })

  }

  /////////////////////////
  // Request Handlers 
  /////////////////////////

  // Handles image upload request, on success the response 
  // return an array of image names.
  function imageUpload(req, res, next){

  if (!req.files)
    return res.status(errorCodes.ERROR_CODE_400).jsend.fail({message: IMAGE_FAILED_UPLOAD});

	 moveImages(req.files, fileStorage.images)
   .then(function(imageNamesArray){
    res.jsend.success(imageNamesArray);
   }).catch(function(err){
    console.log(err);
    res.status(errorCodes.ERROR_CODE_500).jsend.fail(err);
   })  

  }

  /////////////////////////
  //Routes
  /////////////////////////

  version.use(IMAGE_UPLOAD_ROUTE, express.Router().post(EMPTY_PATH, imageUpload));

}