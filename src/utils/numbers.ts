import BN from "bn.js";

export const tokenAmountToString = (nmbr: BN, decimals: number) => {
  let str = nmbr.toString(10, 64);
  if (str === "") {
    return "0";
  } else {
    str =
      str.slice(0, str.length - decimals) +
      "." +
      str.slice(str.length - decimals);
    str = str.replace(/^0+/, "");
    str = str.replace(/0+$/, "");
    str = str.replace(/\.$/, "");
    return str;
  }
};
