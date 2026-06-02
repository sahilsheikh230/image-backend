import express from "express"
import multer from "multer";



import { registerUser,loginUser,isLogged,isLoggedHandler, logoutUser } from "../Controller/userController.js";
import { deleteImage, getImages, saveImage, uploadFile } from "../Controller/fileUploadController.js";
import { downloadImage, previewImage, savetransformedimage } from "../Controller/editImages.js";

const router=express.Router();
router.post("/registeruser",registerUser)
router.post("/loginuser",loginUser)
router.post("/uploadfile",isLogged,uploadFile)

router.get("/isLogged",isLogged,isLoggedHandler)
router.post("/saveImage",isLogged,saveImage)
router.get("/getImages",isLogged,getImages)


router.post("/deleteImage",deleteImage)


router.post("/previewImage",previewImage)

router.post("/savetransformedimage",savetransformedimage)
router.post("/downloadImage",downloadImage)



router.post("/logoutUser",logoutUser)






export default router;