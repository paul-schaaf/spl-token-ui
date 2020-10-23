import { PublicKey } from "@solana/web3.js";
import { AuthorityType, Token } from "@solana/spl-token";
import { getConnection } from "../solana/connection";
import { createAccount } from "./account";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const createNewToken = async (
  feePayer: string,
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number
) => {
  const token = await Token.createMint(
    getConnection(),
    await createAccount(feePayer),
    new PublicKey(mintAuthority),
    freezeAuthority ? new PublicKey(freezeAuthority) : null,
    decimals,
    TOKEN_PROGRAM_ID
  );
  // @ts-ignore
  return token.publicKey.toString();
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
    new PublicKey(newAuthority),
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
  amount: number
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

  // @ts-ignore
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

  // @ts-ignore
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
  amount: number
) => {
  const token = new Token(
    getConnection(),
    new PublicKey(tokenAddress),
    TOKEN_PROGRAM_ID,
    await createAccount(feePayer)
  );

  // @ts-ignore
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

  // @ts-ignore
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
  amount: number
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
