export const sleep = () =>
  new Promise(resolve => {
    setTimeout(() => resolve(), 500);
  });
