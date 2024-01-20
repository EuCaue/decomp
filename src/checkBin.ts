import { exec } from "child_process";
import { exit } from "process";

export default function checkBin(program: string): boolean {
  let isAvailableOnSystem = false;

  try {
    //  TODO: this need to be tested on windows
    exec(`command -v ${program}`);
    isAvailableOnSystem = true;
    console.info(`${program} it's available on your path.`);
  } catch (error) {
    isAvailableOnSystem = false;
    console.error(`Error: ${program} it's not available on your path.`);
    exit(1);
  }

  return isAvailableOnSystem;
}
