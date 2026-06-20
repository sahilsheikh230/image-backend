
import multer from "multer"
import { PDFDocument } from "pdf-lib";
import libre from "libreoffice-convert"
import puppeteer from "puppeteer"
import { fromBuffer } from "pdf2pic";
import { fromPath } from "pdf2pic"
import * as archiver from "archiver";
import {
  Configuration,
  ConvertApi,
  FileApi,
  UploadFileRequest,
  ConvertDocumentRequest,
  ConvertSettings,DownloadFileRequest
} from "groupdocs-conversion-cloud";
console.log(archiver);
const pdfPath = "./uploads/temp.pdf";

export const jpgtopdf=async(req,res)=>{
    const {oreintation,size}=req.body;
    console.log(oreintation,size)

    if(!req.file){
return res.status(403).json({message:"Please select the jpg image"})
    }
 
    if(req.file.mimetype!=="image/jpeg"){
        return res.status(403).json({message:"Only jpeg format is allowed"})
    }
    if(oreintation==null){
        return res.status(403).json({message:"Please Select orientation"})

    }
    try{
let pdfDoc=await PDFDocument.create();
let imageBytes=req.file.buffer;
const jpgImage=await pdfDoc.embedJpg(imageBytes);
 let pageWidth;
    let pageHeight;
    if (!size) {
      pageWidth = jpgImage.width;
      pageHeight = jpgImage.height;
    }
    else if (size === "A4") {
      pageWidth = 595;
      pageHeight = 842;
    }
    else if (size === "US Letter") {
      pageWidth = 612;
      pageHeight = 792;
    }


 if (oreintation === "landscape") {
      [pageWidth, pageHeight] = [pageHeight, pageWidth];
    }
    const page=pdfDoc.addPage([pageWidth,pageHeight]);
     page.drawImage(jpgImage, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=converted.pdf"
    );

    res.send(Buffer.from(pdfBytes));
    }
    catch(err){
res.status(500).json({message:"Internal servor error"})
    }

    
}
export const wordtopdf=async(req,res)=>{
console.log(req.file)
 if(!req.file){
return res.status(403).json({message:"Please select the valid file"})
    }
 
    if(req.file.mimetype!=="application/vnd.openxmlformats-officedocument.wordprocessingml.document" && req.file.mimetype!=="application/vnd.ms-powerpoint"){
        return res.status(403).json({message:"Only .doc format is allowed"})
    }
try
{
const wordBuffer = req.file.buffer;

libre.convert(wordBuffer, ".pdf", undefined, (err, pdfBuffer) => {
    if (err) {
        console.log(err);
        return ;
    }
 res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=converted.pdf"
    );
 res.send(pdfBuffer)

});

   
}
catch(e){
  console.log(e)
return res.status(500).json({message:"Internal servor error"})
}
}
export const htmltopdf=async(req,res)=>{
   if(!req.file){
return res.status(403).json({message:"Please select the HTML file"})
    }
 
    if(req.file.mimetype!=="text/html"){
        return res.status(403).json({message:"Only html file is allowed"})
    }
try{
const htmlContent=req.file.buffer.toString("utf8");
const browser=await puppeteer.launch();
const page=await browser.newPage();

    await page.setContent(
      htmlContent,
      {
        waitUntil: "networkidle0"
      })
      const pdfBuffer =
      await page.pdf({
        format: "A4",
        printBackground: true
      });

    await browser.close();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=converted.pdf"
    );

    res.send(pdfBuffer);

}
catch(e){
  console.log(e)
return res.status(500).json({message:"Internal server error"})
}

}

export const pdftojpg = async (req, res) => {

  const { selected } = req.body;

  if (!req.file) {
    return res.status(403).json({
      message: "Please select the pdf file"
    });
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(403).json({
      message: "Only pdf file is allowed"
    });
  }

  try {

    if (selected === "page") {


      const convert = fromBuffer(req.file.buffer, {
        density: 100,
        format: "jpg",
        width: 1200,
        height: 1200,
      });
console.log("convert",convert)

      const results = await convert.bulk(-1);
     

      res.setHeader(
        "Content-Type",
        "application/zip"
      );

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=pages.zip"
      );

      const archive =  new archiver.ZipArchive("zip", {
        zlib: { level: 9 }
      });

      archive.pipe(res);

      results.forEach((page, index) => {

        archive.file(page.path, {
          name: `page-${index + 1}.jpg`
        });

      });

      await archive.finalize();
    }

  } catch (e) {
    console.log(e);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
};
export const pdftoword=async(req,res)=>{
  const {type}=req.body;
  console.log(type);
   if (!req.file) {
    return res.status(403).json({
      message: "Please select the file"
    });
  }

  if (req.file.mimetype !== "application/pdf") {
    return res.status(403).json({
      message: "Only docx file is allowed"
    });
  }
  try{
const config = new Configuration(
 "ea843d48-b7f1-40e8-88e4-6bad5a8f3ae3",
  "c3ba0f784f439acda69a40953cd42b5b"
);

const convertApi = new ConvertApi(config);
const fileApi = new FileApi(config);
const fileName = "input.pdf";

const uploadRequest = new UploadFileRequest(
  fileName,
  req.file.buffer
);

await fileApi.uploadFile(uploadRequest);

const settings = new ConvertSettings();

settings.filePath = fileName;
settings.storageName = "image";
settings.format = type;
settings.outputPath = `resultant/output.${type}`;

const request = new ConvertDocumentRequest(settings);

const result = await convertApi.convertDocument(request);
const fileInfo=result[0]

const downloadRequest = new DownloadFileRequest();

downloadRequest.path = fileInfo.path;
downloadRequest.storageName = "image";

console.log(downloadRequest);

const downloadResponse =
  await fileApi.downloadFile(downloadRequest);
res.setHeader(
  "Content-Type",
  type === "docx"
    ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    : "application/vnd.ms-powerpoint")

res.setHeader(
  "Content-Disposition",
  `attachment; filename=output.${type}`
);

res.send(downloadResponse);
  }
  catch(e){
console.log(e)
  }
}