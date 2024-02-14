#!/usr/bin/env node
import { extname } from "path";
import { exit } from "process";
import { files, options } from "@/argParser";
import { constants, accessSync } from "fs";
import extractFile from "@/extractFile";

const hasOneFile: boolean = files.length === 1;
const hasTwoOrMoreFiles: boolean = files.length >= 2;

function main(file: string): void {
  const fileType = extname(file);
  extractFile(file, fileType, options);
}

function checkFileExists(path: string): void {
  accessSync(path, constants.F_OK);
}

//  TODO: refactor this code
if (hasOneFile) {
  const file: string = files[0];
  try {
    checkFileExists(file);
    main(file);
  } catch (e) {
    console.error("File does not exist!");
    exit(1);
  }
} else if (hasTwoOrMoreFiles) {
  files.forEach((file) => {
    try {
      checkFileExists(file);
      main(file);
    } catch (e) {
      console.error("File does not exist!");
    }
  });
} else {
  console.error("No file(s) to extract!");
  exit(1);
}
