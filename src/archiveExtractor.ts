import { type Options } from "@/argParser";
import checkBin from "@/checkBin";
import { mkdir } from "fs";
import { extname } from "path";

type DecompCmd = string;

export default class ArchiveExtractor {
  private extractPath: string;

  private fileType: string;

  constructor(
    private options: Options,
    private file: string,
    private fileNameWithoutExt: string
  ) {
    this.extractPath = `${options.outdir}/${fileNameWithoutExt}`;
    this.fileType = extname(file);
  }

  public unzip(): DecompCmd {
    return `unzip -o "${this.file}" -d "${this.extractPath}"`;
  }

  public "7z"(): DecompCmd {
    return `7z e "${this.file}" -o"${this.extractPath}" -y`;
  }

  public unrar(): DecompCmd {
    mkdir(`${this.extractPath}`, { recursive: true }, () => {});
    return `unrar x "${this.file}" "${this.extractPath}"`;
  }

  private tarCommands = new Map([
    [".gz", "-xzf"],
    [".tgz", "-xzf"],
    [".taz", "-xzf"],
    [".Z", "-xvf"],
    [".tZ", "-xvf"],
    [".taZ", "-xvf"],
    [".xz", "-xJf"],
    [".txz", "-xJf"]
  ]);

  private tarCommandsExtraBins = new Map([
    [".zst", { binName: "zstd", cmd: "-xvf" }],
    [".tzst", { binName: "zstd", cmd: "-xvf" }],
    [".bz2", { binName: "bzip2", cmd: "-xvjf" }],
    [".tb2", { binName: "bzip2", cmd: "-xvjf" }],
    [".tbz", { binName: "bzip2", cmd: "-xvjf" }],
    [".tbz2", { binName: "bzip2", cmd: "-xvjf" }],
    [".tz2", { binName: "bzip2", cmd: "-xvjf" }],
    [".lz", { binName: "lzip", cmd: "--lzip -xvf" }],
    [".lzma", { binName: "lzma", cmd: "--lzma -xvf" }],
    [".tlz", { binName: "lzma", cmd: "--lzma -xvf" }],
    [".lzo", { binName: "lzop", cmd: "--lzop -xvf" }]
  ]);

  public tar(): DecompCmd {
    mkdir(`${this.extractPath}`, { recursive: true }, () => {});
    const tarCommand: string | undefined = this.tarCommands.get(this.fileType);
    if (tarCommand) {
      return `tar ${this.tarCommands.get(this.fileType)} "${this.file}" -C "${this.extractPath}"`;
    }
    const tarCommandExtraBin = this.tarCommandsExtraBins.get(this.fileType);
    if (tarCommandExtraBin && checkBin(tarCommandExtraBin.binName)) {
      const { cmd } = tarCommandExtraBin;
      return `tar ${cmd} "${this.file}" -C "${this.extractPath}"`;
    }
    return `tar -xf "${this.file}" -C "${this.extractPath}"`;
  }
}
