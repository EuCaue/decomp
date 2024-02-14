import { spawn } from "child_process";
import { basename } from "path";
import ArchiveExtractor from "@/archiveExtractor";
import checkBin from "@/checkBin";
import { startBar, stopBar } from "@/progressBar";
import { type Options } from "@/argParser";

type DecompCmd = string;
type TarFileType = string;

const FileExtensionToCommandMap = new Map([
  [".rar", "unrar"],
  [".7z", "7z"],
  [".zip", "unzip"],
  [".tar", "tar"]
]);

const supportedFileTypes = new Set([".rar", ".7z", ".zip", ".tar"]);

const tarLongFileTypes: Set<TarFileType> = new Set([
  ".gz",
  ".bz2",
  ".xz",
  ".lz",
  ".lzma",
  ".lzo",
  ".Z",
  ".zst"
]);

const tarShortFileTypes: Set<TarFileType> = new Set([
  ".tgz",
  ".taz",
  ".txz",
  ".tb2",
  ".tbz",
  ".tbz2",
  ".tz2",
  ".tlz",
  ".tZ",
  ".taZ",
  ".tzst"
]);

function getProgramCmd(
  file: string,
  fileType: string,
  options: Options
): DecompCmd {
  let isTar = false;

  if (tarLongFileTypes.has(fileType)) {
    fileType = `.tar${fileType}`; // eslint-disable-line no-param-reassign
    isTar = true;
  }

  if (!isTar && tarShortFileTypes.has(fileType)) {
    isTar = true;
  }

  const selectedFileFormat = isTar
    ? ".tar"
    : (fileType as keyof typeof FileExtensionToCommandMap);

  const fileNameWithoutExt: string = basename(file, fileType);

  const archiveExtractor = new ArchiveExtractor(
    options,
    file,
    fileNameWithoutExt
  );
  const cmdFileTypeKey = FileExtensionToCommandMap.get(
    selectedFileFormat as string
  ) as keyof typeof archiveExtractor;

  return archiveExtractor[cmdFileTypeKey]();
}

function checkFileTypes(fileType: string): boolean {
  const isTar: boolean =
    tarLongFileTypes.has(fileType) || tarShortFileTypes.has(fileType);
  return (
    (supportedFileTypes.has(fileType) || isTar) &&
    checkBin(FileExtensionToCommandMap.get(isTar ? ".tar" : fileType)!)
  );
}

function flush(): void {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
}

export default function extractFile(
  filePath: string,
  fileType: string,
  options: Options
): Promise<boolean | undefined> {
  return new Promise((resolve) => {
    if (checkFileTypes(fileType)) {
      const commandProcess = spawn(getProgramCmd(filePath, fileType, options), {
        shell: true
      });
      startBar();
      commandProcess.stdout.on("end", () => {
        flush();
        process.stdout.write("-".repeat(basename(filePath).length * 2));
        process.stdout.write("\n");
        process.stdout.write(`File ${basename(filePath)} extracted\n`);
        process.stdout.write("-".repeat(basename(filePath).length * 2));
        stopBar();
        resolve(true);
      });
    } else {
      console.error(`${basename(filePath)} has a unsupported file type!`);
      resolve(false);
    }
  });
}
