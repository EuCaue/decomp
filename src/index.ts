#!/usr/bin/env node
import { extname } from "path";
import { files, options } from "@/argParser";
import { constants, accessSync } from "fs";
import extractFile from "@/extractFile";

function main(file: string): void {
  const fileType = extname(file);
  extractFile(file, fileType, options);
}

function checkFileExists(path: string): void {
  accessSync(path, constants.F_OK);
}

files.forEach((file) => {
  try {
    checkFileExists(file);
    main(file);
  } catch (e) {
    console.error("File does not exist!");
  }
});
