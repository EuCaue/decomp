/* eslint-disable import/no-unresolved */
import { describe, expect, it } from "bun:test";
import { access, readdir } from "fs/promises";
import { extname, resolve } from "path";
import extractFile from "../src/extractFile";

const TESTDIR = resolve("./test_archive");
const OUTPUTDIR = `${TESTDIR}/extracted`;

async function checkFileExists(path: string) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

function getPrefixBeforeFirstDot(str: string): string {
  const regex = /.*?}/;
  const result = str.match(regex)![0];
  return result;
}

async function processFile(file: string) {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolvePromise) => {
    const fileType = extname(file);
    const filePathResolved = resolve(`${TESTDIR}/${file}`);

    const result = await extractFile(filePathResolved, fileType, {
      outdir: OUTPUTDIR
    });
    resolvePromise(result);
  });
}

describe("Extract files", async () => {
  try {
    const files = await readdir(TESTDIR);
    const filesWithExtensions = files.filter(
      (file) => extname(file).length > 0
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const file of filesWithExtensions) {
      it(`should extract the ${file} file into the ${getPrefixBeforeFirstDot(file)} folder`, async () => {
        const resultExtractedFile = await processFile(file);
        expect(resultExtractedFile).toBeTrue();
        const extractedFilePath = `${OUTPUTDIR}/${getPrefixBeforeFirstDot(file)}`;
        const isFileExtracted = await checkFileExists(extractedFilePath);
        expect(isFileExtracted).toBeTrue();
      });
    }
  } catch (error) {
    console.error(
      "Test files or folder does not exist, please run the script from the root of the project and try again."
    );
  }
});
