import sharp from "sharp";

async function transform() {
  try {
    await sharp("newimage.png").resize(800,200,{
         fit: 'cover',
    position: 'right top',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
    }).toFile("output1.png")

    // console.log("Image created:", newImage);
  } catch (err) {
    console.log("error in sharp", err);
  }
}

transform();