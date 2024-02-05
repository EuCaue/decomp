#!/usr/bin/env node
import { extname } from "path";
import { exit } from "process";
import { files, options } from "@/argParser";
import extractFile from "@/extractFile";

const hasOneFile: boolean = files.length === 1;
const hasTwoOrMoreFiles: boolean = files.length >= 2;

function main(file: string): void {
  const fileType = extname(file);
  extractFile(file, fileType, options);
}

if (hasOneFile) {
  const file: string = files[0];
  main(file);
} else if (hasTwoOrMoreFiles) {
  files.forEach((file) => {
    main(file);
  });
} else {
  console.log("No file(s) to extract!");
  exit(1);
}
