import functions = require("firebase-functions");
import admin = require("firebase-admin");
const spawn = require("child-process-promise").spawn;
import path = require("path");
import os = require("os");
// import fs = require("fs");
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";

// see https://imagemagick.org/script/convert.php
// see https://github.com/firebase/functions-samples/tree/master/convert-images

exports.generateThumbnailBanners = functions
  .runWith({ memory: "2GB", timeoutSeconds: 530 }).storage
  .object()
  .onFinalize(async (object: ObjectMetadata) => {
    const contentType = object.contentType;
    if (contentType && !contentType.startsWith("image/")) {
      // to console.log when troubleshooting
      // const metageneration = object.metageneration;
      // console.log(JSON.stringify(metageneration))
      return;
    }
    const fileBucket = object.bucket;
    const filePath: string = object.name ? object.name : `void`;
    const pathObj = path.parse(filePath)
    const baseDir = pathObj.dir.substr(0, pathObj.dir.length - 4)
    const bucket = admin.storage().bucket(fileBucket);
    const tempSourceFilePath = path.join(os.tmpdir(), pathObj.base);
    const metadata = {
      contentType: contentType,
    };
    const widths: number[] = [100, 500, 700, 1300]
    const types: string[] = ["landscape", "square", "portrait"]
    // let processing: boolean = false;
    types.map(async type => {
      if (
        filePath.startsWith(`images/${type}/raw/`)
        && pathObj.ext === ".jpg"
      ) {
        // console.log(`ACCEPTED ${filePath} for images/${type}/raw/`)
        // processing = true
        await bucket.file(filePath).download({ destination: tempSourceFilePath });
        widths.map( async width => {
          if (width < 2000) {
            const tempWriteFilePath = path.join(os.tmpdir(), `${type}-${width}-${pathObj.base}`)
            // console.log(`TEMP FILE LOCATION ${tempWriteFilePath}`)
            const uploadPath = path.join(baseDir, `${width}/${pathObj.base}`)
            // console.log(`STARTING ON ${uploadPath}`)
            try {
              await spawn("convert", [
                tempSourceFilePath,
                "-thumbnail",
                `${width}`,
                tempSourceFilePath,
              ]);
              // console.log(`PROCESSED ${tempWriteFilePath} '${width}'`);
            } catch (e) {
              console.error(`ERROR IN IMAGEMAGICK CONVERTING ${e}`);
            } finally {
              try {
                bucket.upload(tempSourceFilePath, {
                  destination: uploadPath,
                  predefinedAcl: 'publicRead',
                  metadata: metadata,
                });
              } catch (e) {
                console.error(`ERROR IN UPLOADING TO STORAGE ${e}`);
              } finally {
                console.log(`WROTE ${tempWriteFilePath} to ${uploadPath}`)
                // fs.unlinkSync(tempWriteFilePath);
                // bucket.file(uploadPath).getSignedUrl()
              }
            }

          }
        })
      } else {
        // console.log(`DECLINED ${filePath} for images/${type}/raw/`)
      }
    })
    // if (processing) fs.unlinkSync(tempSourceFilePath);
    return;
  });
