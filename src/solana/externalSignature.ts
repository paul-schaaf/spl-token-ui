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
  otherSigners: Account[],
  connection: Connection,
  wallet: Wallet
) => {
  let tx = new Transaction().add(...instructions);
  tx.setSigners(wallet.publicKey, ...otherSigners.map(s => s.publicKey));
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
  otherSigners.forEach(acc => {
    tx.partialSign(acc);
  });
  let signed = await wallet.signTransaction(tx);
  let txid = await connection.sendRawTransaction(signed.serialize());
  return connection.confirmTransaction(txid, "singleGossip");
};

export const getWallet = () => wallet;
