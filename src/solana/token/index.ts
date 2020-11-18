import { Account, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  AuthorityType,
  MintLayout,
  Token,
  AccountLayout,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";
import { COMMITMENT, getConnection } from "../connection";
import { createAccount } from "../account";
import { useWallet, sendTxUsingExternalSignature } from "../externalWallet";

export * from "./editing";
export * from "./associatedToken";

export const createNewToken = async (
  feePayer: string,
  mintAuthority: string,
  freezeAuthority: string,
  decimals: number,
  signExternally: boolean
) => {
  const connection = getConnection();
  if (signExternally) {
    const wallet = await useWallet();

    const mintAccount = new Account();
    const createAccIx = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: mintAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        MintLayout.span,
        COMMITMENT
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
    const wallet = await useWallet();

    const currentAuthorityAccOrWallet = currentAuthoritySignsExternally
      ? wallet
      : await createAccount(currentAuthority);

    const ix = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenPublicKey,
      newAuthorityOrNull,
      authorityType,
      currentAuthorityAccOrWallet.publicKey,
      //@ts-expect-error
      []
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayer),
      currentAuthoritySignsExternally ? [] : [currentAuthorityAccOrWallet],
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
  tokenMintAddress: string,
  owner: string,
  signExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const ownerPubkey = new PublicKey(owner);
  if (signExternally) {
    const wallet = await useWallet();

    const connection = getConnection();
    //@ts-expect-error
    const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
      connection
    );
    const newAccount = new Account();
    const createAccIx = SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: newAccount.publicKey,
      lamports: balanceNeeded,
      space: AccountLayout.span,
      programId: TOKEN_PROGRAM_ID
    });

    const createTokenAccountIx = Token.createInitAccountInstruction(
      TOKEN_PROGRAM_ID,
      tokenMintPubkey,
      newAccount.publicKey,
      ownerPubkey
    );

    await sendTxUsingExternalSignature(
      [createAccIx, createTokenAccountIx],
      connection,
      null,
      [newAccount],
      wallet
    );

    return newAccount.publicKey.toBase58();
  } else {
    const token = new Token(
      getConnection(),
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    return (await token.createAccount(ownerPubkey)).toString();
  }
};
