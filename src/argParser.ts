import { program } from "commander";
import { join, parse } from "path";
import pkg from "../package.json";

export type Options = {
  outdir: string;
};

let files: string[] = [];

function parsePath(path: string): string {
  const parsedPath = parse(path);
  const dir = parsedPath.dir;
  const base = parsedPath.base;
  return join(dir, base);
}

program
  .name("decomp")
  .version(pkg.version, "-V, --version", "output the current version");

program.option(
  "-o, --outdir <PATH>",
  "set the output directory",
  parsePath,
  "./",
);

program.arguments("<files...>").action((args: string[]) => {
  //  TODO: make work for arguments with spaces without quotes
  files = args;
});

program.parse();

export const options: Options = program.opts();
export default files;
