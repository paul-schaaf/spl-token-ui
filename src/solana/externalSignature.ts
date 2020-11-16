import {
  Account,
  Connection,
  Transaction,
  TransactionInstruction
} from "@solana/web3.js";
//@ts-expect-error
import Wallet from "@project-serum/sol-wallet-adapter";

const PROVIDER_URL = "https://www.sollet.io";
let wallet = new Wallet(PROVIDER_URL, "mainnet-beta");

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
  let txid = await connection.sendRawTransaction(signed.serialize());
  return connection.confirmTransaction(txid, "singleGossip");
};

const connectToWallet = () => {
  if (!wallet.connected) {
    return wallet.connect() as Promise<void>;
  } else {
    return Promise.resolve();
  }
};

export const useWallet = (): [Wallet, () => Promise<void>] => [
  wallet,
  connectToWallet
];
