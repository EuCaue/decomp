#!/usr/bin/env node
import { extname } from "path";
import { exit } from "process";
import extractFile from "./extractFile";

const hasOneFile: boolean = process.argv.length === 3;
const hasTwoOrMoreFiles: boolean = process.argv.length > 3;

function main(argPos: number): void {
  const file = process.argv[argPos];
  const fileType = extname(file);
  extractFile(file, fileType);
}

if (hasOneFile) {
  const argPos: number = 2;
  main(argPos);
} else if (hasTwoOrMoreFiles) {
  for (const argPos in process.argv) {
    if (+argPos > 1) {
      main(+argPos);
    }
  }
} else {
  console.log("No file(s) to extract!");
  exit(1);
}
