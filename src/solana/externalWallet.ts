import {
  Account,
  Connection,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
//@ts-expect-error
import Wallet from "@project-serum/sol-wallet-adapter";
import { chosenCluster, COMMITMENT } from "./connection";

const PROVIDER_URL = "https://www.solflare.com";
let wallet = new Wallet(PROVIDER_URL, chosenCluster.value);

export const sendTxUsingExternalSignature = async (
  instructions: TransactionInstruction[],
  connection: Connection,
  feePayer: Account | null,
  signersExceptWallet: Account[],
  wallet: Wallet
) => {
  let tx = new Transaction().add(...instructions);
  tx.setSigners(
    ...(feePayer
      ? [(feePayer as Account).publicKey, wallet.publicKey]
      : [wallet.publicKey]),
    ...signersExceptWallet.map(s => s.publicKey)
  );
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
  signersExceptWallet.forEach(acc => {
    tx.partialSign(acc);
  });
  let signed = await wallet.signTransaction(tx);
  let txid = await connection.sendRawTransaction(signed.serialize(), {
    skipPreflight: false,
    preflightCommitment: COMMITMENT
  });
  return connection.confirmTransaction(txid, COMMITMENT);
};

const connectToWallet = () => {
  if (!wallet.connected) {
    return wallet.connect() as Promise<void>;
  } else {
    return Promise.resolve();
  }
};

export const useWallet = async (): Promise<Wallet> => {
  await connectToWallet();
  return wallet;
};
