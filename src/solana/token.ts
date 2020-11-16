import {
  Account,
  PublicKey,
  SystemProgram,
  Transaction
} from "@solana/web3.js";
import { AuthorityType, MintLayout, Token, u64 } from "@solana/spl-token";
import { getConnection } from "../solana/connection";
import { createAccount } from "./account";
//@ts-expect-error
import Wallet from "@project-serum/sol-wallet-adapter";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

const PROVIDER_URL = "https://www.sollet.io";
let wallet = new Wallet(PROVIDER_URL, "mainnet-beta");

export const createNewToken = async (
  feePayer: string,
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number
) => {
  const connection = getConnection();
  if (!wallet.connected) {
    await wallet.connect();
  }

  const mintAccount = new Account();
  const createAccIx = SystemProgram.createAccount({
    fromPubkey: wallet.publicKey,
    newAccountPubkey: mintAccount.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      MintLayout.span,
      "singleGossip"
    ),
    space: MintLayout.span,
    programId: TOKEN_PROGRAM_ID
  });
  const initMintIx = Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mintAccount.publicKey,
    decimals,
    new PublicKey(mintAuthority),
    freezeAuthority ? new PublicKey(freezeAuthority) : null
  );
  let tx = new Transaction().add(createAccIx, initMintIx);
  tx.setSigners(wallet.publicKey, mintAccount.publicKey);
  tx.recentBlockhash = (await connection.getRecentBlockhash("max")).blockhash;
  let signed = await wallet.signTransaction(tx);
  signed.partialSign(mintAccount);
  let txid = await connection.sendRawTransaction(signed.serialize());
  await connection.confirmTransaction(txid, "singleGossip");
  return mintAccount.publicKey.toString();
};

export const editToken = async (
  feePayer: string,
  tokenAddress: string,
  newAuthority: string,
  currentAuthority: string,
  authorityType: AuthorityType
) => {
  const tokenPublicKey = new PublicKey(tokenAddress);

  const token = new Token(
    getConnection(),
    tokenPublicKey,
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.setAuthority(
    tokenPublicKey,
    newAuthority ? new PublicKey(newAuthority) : null,
    authorityType,
    await createAccount(currentAuthority),
    []
  );
};

export const createTokenAccount = async (
  feePayer: string,
  tokenAddress: string,
  owner: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  return (await token.createAccount(new PublicKey(owner))).toString();
};

export const mintToken = async (
  feePayer: string,
  tokenAddress: string,
  mintAuthority: string,
  destinationAccount: string,
  amount: u64
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  return await token.mintTo(
    new PublicKey(destinationAccount),
    await createAccount(mintAuthority),
    [],
    amount
  );
};

export const freezeAccount = async (
  feePayer: string,
  tokenAddress: string,
  accountToFreeze: string,
  freezeAuthority: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.freezeAccount(
    new PublicKey(accountToFreeze),
    await createAccount(freezeAuthority),
    []
  );
};

export const thawAccount = async (
  feePayer: string,
  tokenAddress: string,
  accountToThaw: string,
  freezeAuthority: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.thawAccount(
    new PublicKey(accountToThaw),
    await createAccount(freezeAuthority),
    []
  );
};

export const transferTokens = async (
  feePayer: string,
  tokenAddress: string,
  sourceAccount: string,
  destAccount: string,
  owner: string,
  amount: u64
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.transfer(
    new PublicKey(sourceAccount),
    new PublicKey(destAccount),
    await createAccount(owner),
    [],
    amount
  );
};

export const setTokenAccountOwner = async (
  feePayer: string,
  tokenAddress: string,
  tokenAccount: string,
  currentAuthority: string,
  newAuthority: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.setAuthority(
    new PublicKey(tokenAccount),
    new PublicKey(newAuthority),
    "AccountOwner",
    await createAccount(currentAuthority),
    []
  );
};

export const burnTokens = async (
  feePayer: string,
  tokenAddress: string,
  tokenAccount: string,
  owner: string,
  amount: u64
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.burn(
    new PublicKey(tokenAccount),
    await createAccount(owner),
    [],
    amount
  );
};

export const closeAccount = async (
  feePayer: string,
  tokenAddress: string,
  tokenAccount: string,
  destinationAccount: string,
  owner: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.closeAccount(
    new PublicKey(tokenAccount),
    new PublicKey(destinationAccount),
    await createAccount(owner),
    []
  );
};

export const setTokenAccountCloser = async (
  feePayer: string,
  tokenAddress: string,
  tokenAccount: string,
  currentAuthority: string,
  newAuthority: string
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  await token.setAuthority(
    new PublicKey(tokenAccount),
    newAuthority ? new PublicKey(newAuthority) : null,
    "CloseAccount",
    await createAccount(currentAuthority),
    []
  );
};
