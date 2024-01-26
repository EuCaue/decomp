import { spawn } from "child_process";
import { mkdir } from "fs";
import { basename } from "path";
import checkBin from "./checkBin";
import { startBar, stopBar } from "./progressBar";
import { options } from "./argParser";

type DecompCmd = string;
type TarFileType = string;

const FileExtensionToCommandMap = new Map([
  [".rar", "unrar"],
  [".7z", "7z"],
  [".zip", "unzip"],
  [".tar", "tar"],
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
  ".zst",
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
  ".tzst",
]);

const ArchiveCommands = {
  unzip: (file: string, fileNameWithoutExt: string) => {
    const extractPath = `${options.outdir}/${fileNameWithoutExt}`;
    return `unzip -o "${file}" -d "${extractPath}"`;
  },
  "7z": (file: string, fileNameWithoutExt: string) => {
    const extractPath = `${options.outdir}/${fileNameWithoutExt}`;
    return `7z e "${file}" -o"${extractPath}"`;
  },
  unrar: (file: string, fileNameWithoutExt: string) => {
    const extractPath = `${options.outdir}/${fileNameWithoutExt}`;
    mkdir(`${extractPath}`, { recursive: true }, () => {});
    return `unrar x "${file}" -d "${extractPath}"`;
  },
  tar: (file: string, fileNameWithoutExt: string) => {
    const extractPath = `${options.outdir}/${fileNameWithoutExt}`;
    mkdir(`${extractPath}`, { recursive: true }, () => {});
    if (/\.(tar\.gz|tgz|taz)$/.test(file) || /\.(tar\.Z|tZ|taZ)$/.test(file)) {
      return `tar -xzf "${file}" -C "${extractPath}"`;
    }
    if (/\.(tar\.zst|tzst)$/.test(file) && checkBin("zstd")) {
      return `tar -xvf "${file}" -C "${extractPath}"`;
    }
    if (/\.(tar\.xz|txz)$/.test(file)) {
      return `tar -xJf "${file}" -C "${extractPath}"`;
    }
    if (/\.(tar\.bz2|tb2|tbz|tbz2|tz2)$/.test(file) && checkBin("bzip2")) {
      return `tar -xvjf "${file}" -C "${extractPath}"`;
    }
    if (/\.(tar\.lz)$/.test(file) && checkBin("lzip")) {
      return `tar --lzip -xvf "${file}" -C "${extractPath}"`;
    }
    if (/\.(tar\.lzma|tlz)$/.test(file) && checkBin("lzma")) {
      return `tar --lzma -xvf "${file}" -C "${extractPath}"`;
    }
    if (/\.(tar\.lzo)$/.test(file) && checkBin("lzop")) {
      return `tar --lzop -xvf "${file}" -C "${extractPath}"`;
    }
    return `tar`;
  },
} as const;

function getProgramCmd(file: string, fileType: string): DecompCmd {
  let isTar = false;

  if (tarLongFileTypes.has(fileType)) {
    fileType = ".tar" + fileType;
    isTar = true;
  }

  if (!isTar && tarShortFileTypes.has(fileType)) {
    isTar = true;
  }

  const selectedFileFormat = isTar
    ? ".tar"
    : (fileType as keyof typeof FileExtensionToCommandMap);

  const fileNameWithoutExt: string = basename(file, fileType);

  const cmdTypeKey = FileExtensionToCommandMap.get(
    selectedFileFormat as string,
  ) as keyof typeof ArchiveCommands;
  return ArchiveCommands[cmdTypeKey](file, fileNameWithoutExt);
}

function checkFileTypes(fileType: string): boolean {
  let isTar: boolean =
    tarLongFileTypes.has(fileType) || tarShortFileTypes.has(fileType);
  return (
    (supportedFileTypes.has(fileType) || isTar) &&
    checkBin(FileExtensionToCommandMap.get(isTar ? ".tar" : fileType)!)
  );
}

export default function extractFile(filePath: string, fileType: string): void {
  if (checkFileTypes(fileType)) {
    const commandProcess = spawn(getProgramCmd(filePath, fileType), {
      shell: true,
    });
    startBar();
    commandProcess.stdout.on("close", () => {
      process.stdout.write("-".repeat(basename(filePath).length * 2));
      process.stdout.write("\n");
      process.stdout.write(`File ${basename(filePath)} extracted\n`);
      process.stdout.write("-".repeat(basename(filePath).length * 2));
      stopBar();
    });
  } else {
    console.error(`${basename(filePath)} has a unsupported file type!`);
  }
}
