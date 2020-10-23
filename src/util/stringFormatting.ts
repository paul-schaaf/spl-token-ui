export const splitAtUppercase = (str: string) => {
  const match = str.match(/([A-Z]?[^A-Z]*)/g);
  if (match === null) {
    return str;
  } else {
    return match.slice(0, -1).join(" ");
  }
};
