import {
  Account,
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL
} from "@solana/web3.js";
import * as bip39 from "bip39";
import * as bip32 from "bip32";
import nacl from "tweetnacl";

const connection = new Connection(clusterApiUrl("testnet"), "single");

async function mnemonicToSeed(mnemonic: string): Promise<Buffer> {
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Invalid seed words");
  }
  return await bip39.mnemonicToSeed(mnemonic);
}

function getAccountFromSeed(
  seed: Buffer,
  walletIndex: number,
  accountIndex = 0
) {
  const derivedSeed = bip32
    .fromSeed(seed)
    .derivePath(`m/501'/${walletIndex}'/0/${accountIndex}`).privateKey;
  return new Account(
    nacl.sign.keyPair.fromSeed(derivedSeed as Uint8Array).secretKey
  );
}

export const createAccount = async (mnemonic: string): Promise<Account> => {
  const seed = await mnemonicToSeed(mnemonic);
  return getAccountFromSeed(seed, 0, 0);
};

export const getBalance = async (mnemonic: string) => {
  return (
    (await connection.getBalance(
      (await createAccount(mnemonic)).publicKey,
      "single"
    )) / LAMPORTS_PER_SOL
  );
};
