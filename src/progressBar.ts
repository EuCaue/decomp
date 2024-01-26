const bar: string[] = [] as const;
let firstRunInterval: boolean = true;
let intervalId: NodeJS.Timeout;

function setBar(): void {
  if (firstRunInterval === false) {
    firstRunInterval = true;
    process.stdout.write("\n");
  }
  if (bar.length >= 100) resetBar();
  bar.push("#");
  process.stdout.write(`${bar.join("")}`);
}

export function startBar(ms: number = 150): void {
  intervalId = setInterval(() => {
    setBar();
    // console.log("from start", intervalId);
  }, ms);
}

function resetBar(): void {
  bar.length = 0;
  bar.push("#");
}

export function stopBar(): void {
  resetBar();
  //  NOTE: for some reason, this works???
  intervalId.unref();
  clearInterval(1);
  process.stdout.write("\n\n");
  process.stdout.write(`${bar.join("").repeat(50)} 100%`);
  process.stdout.write("\n");
  // console.log("from stop");
}
