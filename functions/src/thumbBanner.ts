import functions = require("firebase-functions");
import admin = require("firebase-admin");
const spawn = require("child-process-promise").spawn;
import path = require("path");
import os = require("os");
import fs = require("fs");
import { ObjectMetadata } from "firebase-functions/lib/providers/storage";

// see https://imagemagick.org/script/convert.php
// see https://github.com/firebase/functions-samples/tree/master/convert-images

exports.generateThumbnailBanners = functions
  .runWith({ memory: "2GB", timeoutSeconds: 530 }).storage
  .object()
  .onFinalize(async (object: ObjectMetadata) => {
    const fileBucket = object.bucket;
    const filePath: string = object.name ? object.name : `void`;
    const contentType = object.contentType;
    if (contentType && !contentType.startsWith("image/")) {
      // const metageneration = object.metageneration; //to console.log when troubleshooting
      return;
    }
    const widths:number[] = [100, 500, 700, 1300]
    const fileName = path.basename(filePath);
    const dirName:string = path.dirname(filePath);
    const baseDir:string = dirName.substr(0, dirName.length-4);
    console.log(`BASE DIR ${baseDir}`)
    console.log(`widths ${widths}`)
    if (
      fileName.startsWith("thumb100") ||
      fileName.startsWith("banner340") ||
      fileName.startsWith("banner246")
    ) {
      // desired result, complete
      return;
    } else if (
      filePath.endsWith(`/square/raw/${fileName}`) ||
      filePath.endsWith(`/landscape/raw/${fileName}`) ||
      filePath.endsWith(`/portrait/raw/${fileName}`)
    ) {
      console.log(`PROCESSING filePath ${filePath}`)
      const bucket = admin.storage().bucket(fileBucket);
      const tempFilePath = path.join(os.tmpdir(), fileName);
      const metadata = {
        contentType: contentType,
      };
      await bucket.file(filePath).download({ destination: tempFilePath });
      if (filePath.endsWith(`/square/raw/${fileName}`)) {
        const thumb100FileName = `thumb100${fileName.substring(
          fileName.lastIndexOf("."),
          fileName.length
        )}`;
        await spawn("convert", [
          tempFilePath,
          "-thumbnail",
          "100x100>",
          tempFilePath,
        ]);
        const thumb100FilePath = path.join(
          path.dirname(filePath),
          thumb100FileName
        );
        await bucket.upload(tempFilePath, {
          destination: thumb100FilePath,
          metadata: metadata,
        });
      } else if (filePath.endsWith(`/landscape/raw/${fileName}`)) {
        const banner340fileName = `blah/340/${fileName.substring(
          fileName.lastIndexOf("."),
          fileName.length
        )}`;
        await spawn("convert", [
          tempFilePath,
          "-thumbnail",
          "340x190>",
          tempFilePath,
        ]);
        const banner340FilePath = path.join(
          path.dirname(filePath),
          banner340fileName
        );
        await bucket.upload(tempFilePath, {
          destination: banner340FilePath,
          metadata: metadata,
        });
        const banner246FileName = `banner246${fileName.substring(
          fileName.lastIndexOf("."),
          fileName.length
        )}`;
        await spawn("convert", [
          tempFilePath,
          "-thumbnail",
          "246x146>",
          tempFilePath,
        ]);
        const banner246FilePath = path.join(
          path.dirname(filePath),
          banner246FileName
        );
        await bucket.upload(tempFilePath, {
          destination: banner246FilePath,
          metadata: metadata,
        });
      }
      fs.unlinkSync(tempFilePath);
      return;
    } else {
      console.log(`WOOPS ${filePath}`)
    }
  });
