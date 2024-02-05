/* eslint-disable import/no-unresolved */
import extractFile from "@/extractFile";
import { describe, expect, it } from "bun:test";
import { extname } from "path";

describe("Extract File", () => {
  it("should extract file to a specific folder", async () => {
    const file = "/home/caue/Downloads/Compressed/ec.7z";
    const fileType = extname(file);
    const result = await extractFile(file, fileType, {
      outdir: "/home/caue/test/"
    });
    expect(result).toBeTrue();
  });
  it("should return false invalid file type", async () => {
    const file = "/home/caue/Downloads/Compressed/COPYING";
    const fileType = extname(file);
    const result = await extractFile(file, fileType, { outdir: "./" });
    expect(result).toBeFalse();
  });
});
