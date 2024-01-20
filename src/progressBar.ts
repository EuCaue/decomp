//  TODO: do a better progress bar
export default function createProgressBar(total: number) {
  let currentProgress = 0;
  process.stdout.write("[                    ] 0%");
  return {
    update: (increment: number) => {
      if (currentProgress >= total) return;
      currentProgress += increment;
      const progress = Math.min(
        Math.round((currentProgress / total) * 100),
        100,
      );
      const progressBar =
        "[" + "=".repeat(progress / 2) + " ".repeat(50 - progress / 2) + "]";

      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
      process.stdout.write(`${progressBar} ${progress}%`);
    },
  };
}
