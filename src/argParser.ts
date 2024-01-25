import { program } from "commander";
import { join, parse } from "path";

export type Options = {
  outdir: string;
};

let files: string[] = [];

const parsePath = (path: string) => {
  const parsedPath = parse(path);
  const dir = parsedPath.dir;
  const base = parsedPath.base;
  return join(dir, base);
};

program.name("decomp").version("0.1.0");

program.option(
  "-o, --outdir <PATH>",
  "set the output directory",
  parsePath,
  "./",
);

program.arguments("<files...>").action((args) => {
  files = args as string[];
});

program.parse();

export const options: Options = program.opts();
export default files;
