import { Account } from "@solana/web3.js";
import {
  validateMnemonic as bip39validateMnemonic,
  mnemonicToSeed as bip39mnemonicToSeed
} from "bip39";
import { fromSeed as bip32FromSeed } from "bip32";
import { sign as naclSign } from "tweetnacl";

async function mnemonicToSeed(mnemonic: string): Promise<Buffer> {
  if (!bip39validateMnemonic(mnemonic)) {
    throw new Error("Invalid seed phrase");
  }
  return await bip39mnemonicToSeed(mnemonic);
}

function getAccountFromSeed(
  seed: Buffer,
  walletIndex: number,
  accountIndex = 0
) {
  const derivedSeed = bip32FromSeed(seed).derivePath(
    `m/501'/${walletIndex}'/0/${accountIndex}`
  ).privateKey;
  return new Account(
    naclSign.keyPair.fromSeed(derivedSeed as Uint8Array).secretKey
  );
}

export const createAccount = async (secret: string): Promise<Account> => {
  if (secret.includes(",")) {
    return new Account(
      secret
        .replace(/ /g, "")
        .split(",")
        .map(n => parseInt(n))
    );
  }
  const seed = await mnemonicToSeed(secret);
  return getAccountFromSeed(seed, 0, 0);
};
