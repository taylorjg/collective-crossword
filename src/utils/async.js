const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const minDuration = async (promise, ms) => {
  await Promise.all([promise, delay(ms)]);
};
