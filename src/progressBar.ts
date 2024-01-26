const bar: string[] = [] as const;
let firstRunInterval: boolean = true;
let cancelInterval: () => void;
let canceledInterval: boolean = false;

//  HACK: some reason setInterval doesn't work, so here a function to simulate.
function simulateSetInterval(
  callback: () => void,
  interval: number,
): () => void {
  function execute() {
    if (!canceledInterval) {
      callback();
      setTimeout(execute, interval);
    }
  }

  execute();

  return function cancel() {
    canceledInterval = true;
  };
}

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
  cancelInterval = simulateSetInterval(setBar, ms);
}

function resetBar(): void {
  bar.length = 0;
  bar.push("#");
}

export function stopBar(): void {
  resetBar();
  cancelInterval();
  process.stdout.write("\n");
  process.stdout.write(`${bar.join("").repeat(50)} 100%`);
  process.stdout.write("\n");
}
