import { Account, PublicKey, SystemProgram } from "@solana/web3.js";
import { AuthorityType, MintLayout, Token, u64 } from "@solana/spl-token";
import { getConnection } from "../solana/connection";
import { createAccount } from "./account";
import { getWallet, sendTxUsingExternalSignature } from "./externalSignature";

const TOKEN_PROGRAM_ID = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

export const createNewToken = async (
  feePayer: string,
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number,
  signExternally: boolean
) => {
  const connection = getConnection();
  if (signExternally) {
    const wallet = getWallet();
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

    await sendTxUsingExternalSignature(
      [createAccIx, initMintIx],
      connection,
      null,
      [mintAccount],
      wallet
    );
    return mintAccount.publicKey.toString();
  } else {
    const token = await Token.createMint(
      getConnection(),
      await createAccount(feePayer),
      new PublicKey(mintAuthority),
      freezeAuthority ? new PublicKey(freezeAuthority) : null,
      decimals,
      TOKEN_PROGRAM_ID
    );
    return token.publicKey.toString();
  }
};

export const editToken = async (
  feePayer: string,
  tokenAddress: string,
  newAuthority: string,
  currentAuthority: string,
  authorityType: AuthorityType,
  feePayerSignsExternally: boolean,
  currentAuthoritySignsExternally: boolean
) => {
  const tokenPublicKey = new PublicKey(tokenAddress);
  const newAuthorityOrNull = newAuthority ? new PublicKey(newAuthority) : null;
  const connection = getConnection();
  if (feePayerSignsExternally || currentAuthoritySignsExternally) {
    const wallet = getWallet();
    if (!wallet.connected) {
      await wallet.connect();
    }

    const ix = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenPublicKey,
      newAuthorityOrNull,
      authorityType,
      wallet.publicKey,
      //@ts-expect-error
      []
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayer),
      currentAuthoritySignsExternally
        ? []
        : [await createAccount(currentAuthority)],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenPublicKey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    await token.setAuthority(
      tokenPublicKey,
      newAuthorityOrNull,
      authorityType,
      await createAccount(currentAuthority),
      []
    );
  }
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
