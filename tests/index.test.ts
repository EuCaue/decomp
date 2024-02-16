/* eslint-disable import/no-unresolved */
import { describe, expect, it } from "bun:test";
import { readdir } from "fs";
import { extname, resolve } from "path";
import extractFile from "../src/extractFile";

const TESTFOLDER = resolve("./test_archive");

describe("Extract File", () => {
  readdir(TESTFOLDER, (_, files) => {
    files.forEach(async (file) => {
      const fileType = extname(file);
      const fileParsed = resolve(`${TESTFOLDER}/${file}`);
      it(`should extract the ${fileType} file into the extracted folder`, async () => {
        if (fileType) {
          const result = await extractFile(fileParsed, fileType, {
            outdir: `${TESTFOLDER}/extracted`
          });
          expect(result).toBeTrue();
        }
      });
    });
  });
});
