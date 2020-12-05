import { PublicKey } from "@solana/web3.js";
import { Token, u64, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { getConnection } from "../connection";
import { createAccount } from "../account";
import { useWallet, sendTxUsingExternalSignature } from "../externalWallet";

import { getMintPubkeyFromTokenAccountPubkey } from "./index";

export const mintToken = async (
  feePayerSecret: string,
  mintAuthoritySecret: string,
  destinationAccountAddress: string,
  amount: u64,
  feePayerSignsExternally: boolean,
  mintAuthoritySignsExternally: boolean
) => {
  const destinationPubkey = new PublicKey(destinationAccountAddress);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    destinationPubkey
  );
  const connection = getConnection();

  if (mintAuthoritySignsExternally || feePayerSignsExternally) {
    const wallet = await useWallet();

    const mintAuthorityAccOrWallet = mintAuthoritySignsExternally
      ? wallet
      : await createAccount(mintAuthoritySecret);

    const mintIx = Token.createMintToInstruction(
      TOKEN_PROGRAM_ID,
      tokenMintPubkey,
      destinationPubkey,
      mintAuthorityAccOrWallet.publicKey,
      [],
      amount
    );

    await sendTxUsingExternalSignature(
      [mintIx],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      mintAuthoritySignsExternally ? [] : [mintAuthorityAccOrWallet],
      wallet
    );

    return destinationPubkey.toBase58();
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.mintTo(
      destinationPubkey,
      await createAccount(mintAuthoritySecret),
      [],
      amount
    );

    return destinationPubkey.toBase58();
  }
};

export const freezeAccount = async (
  feePayerSecret: string,
  addressToFreeze: string,
  freezeAuthoritySecret: string,
  feePayerSignsExternally: boolean,
  freezeAuthoritysignsExternally: boolean
) => {
  const pubkeyToFreeze = new PublicKey(addressToFreeze);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    pubkeyToFreeze
  );

  const connection = getConnection();
  if (feePayerSignsExternally || freezeAuthoritysignsExternally) {
    const wallet = await useWallet();

    const authorityAccOrWallet = freezeAuthoritysignsExternally
      ? wallet
      : await createAccount(freezeAuthoritySecret);

    //@ts-ignore
    const freezeIx = Token.createFreezeAccountInstruction(
      TOKEN_PROGRAM_ID,
      pubkeyToFreeze,
      tokenMintPubkey,
      authorityAccOrWallet.publicKey,
      []
    );

    await sendTxUsingExternalSignature(
      [freezeIx],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      freezeAuthoritysignsExternally ? [] : [authorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.freezeAccount(
      pubkeyToFreeze,
      await createAccount(freezeAuthoritySecret),
      []
    );
  }
};

export const thawAccount = async (
  feePayerSecret: string,
  addressToThaw: string,
  freezeAuthoritySecret: string,
  feePayerSignsExternally: boolean,
  freezeAuthoritysignsExternally: boolean
) => {
  const pubkeyToThaw = new PublicKey(addressToThaw);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    pubkeyToThaw
  );
  const connection = getConnection();

  if (feePayerSignsExternally || freezeAuthoritysignsExternally) {
    const wallet = await useWallet();

    const authorityAccOrWallet = freezeAuthoritysignsExternally
      ? wallet
      : await createAccount(freezeAuthoritySecret);

    //@ts-ignore
    const thawIx = Token.createThawAccountInstruction(
      TOKEN_PROGRAM_ID,
      pubkeyToThaw,
      tokenMintPubkey,
      authorityAccOrWallet.publicKey,
      []
    );

    await sendTxUsingExternalSignature(
      [thawIx],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      freezeAuthoritysignsExternally ? [] : [authorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.thawAccount(
      pubkeyToThaw,
      await createAccount(freezeAuthoritySecret),
      []
    );
  }
};

export const transferTokens = async (
  feePayerSecret: string,
  sourceAddress: string,
  destAddress: string,
  ownerSecret: string,
  amount: u64,
  feePayerSignsExternally: boolean,
  accountOwnerSignsExternally: boolean
) => {
  const sourcePubkey = new PublicKey(sourceAddress);
  const destinationPubkey = new PublicKey(destAddress);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    sourcePubkey
  );

  const connection = getConnection();

  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const wallet = await useWallet();
    const ownerAccountOrWallet = accountOwnerSignsExternally
      ? wallet
      : await createAccount(ownerSecret);

    const transferIx = Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      sourcePubkey,
      destinationPubkey,
      ownerAccountOrWallet.publicKey,
      [],
      amount
    );

    await sendTxUsingExternalSignature(
      [transferIx],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      accountOwnerSignsExternally ? [] : [ownerAccountOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.transfer(
      new PublicKey(sourceAddress),
      destinationPubkey,
      await createAccount(ownerSecret),
      [],
      amount
    );
  }
};

export const setTokenAccountOwner = async (
  feePayerSecret: string,
  tokenAccountAddress: string,
  currentAuthoritySecret: string,
  newAuthorityAddress: string,
  feePayerSignsExternally: boolean,
  currentAuthoritySignsExternally: boolean
) => {
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    tokenAccountPubkey
  );
  const newAuthorityPubkey = new PublicKey(newAuthorityAddress);
  const connection = getConnection();

  if (feePayerSignsExternally || currentAuthoritySignsExternally) {
    const wallet = await useWallet();

    const currentAuthorityAccOrWallet = currentAuthoritySignsExternally
      ? wallet
      : await createAccount(currentAuthoritySecret);

    const ix = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      newAuthorityPubkey,
      "AccountOwner",
      currentAuthorityAccOrWallet.publicKey,
      //@ts-expect-error
      []
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      currentAuthoritySignsExternally ? [] : [currentAuthorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.setAuthority(
      tokenAccountPubkey,
      newAuthorityPubkey,
      "AccountOwner",
      await createAccount(currentAuthoritySecret),
      []
    );
  }
};

export const burnTokens = async (
  feePayerSecret: string,
  tokenAccountAddress: string,
  ownerSecret: string,
  amount: u64,
  feePayerSignsExternally: boolean,
  accountOwnerSignsExternally: boolean
) => {
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    tokenAccountPubkey
  );
  const connection = getConnection();

  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const wallet = await useWallet();

    const currentOwnerAccOrWallet = accountOwnerSignsExternally
      ? wallet
      : await createAccount(ownerSecret);

    const ix = Token.createBurnInstruction(
      TOKEN_PROGRAM_ID,
      tokenMintPubkey,
      tokenAccountPubkey,
      currentOwnerAccOrWallet.publicKey,
      [],
      amount
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      accountOwnerSignsExternally ? [] : [currentOwnerAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.burn(
      tokenAccountPubkey,
      await createAccount(ownerSecret),
      [],
      amount
    );
  }
};

export const closeAccount = async (
  feePayerSecret: string,
  tokenAccountAddress: string,
  destinationAccountAddress: string,
  ownerSecret: string,
  feePayerSignsExternally: boolean,
  accountOwnerSignsExternally: boolean
) => {
  const connection = getConnection();
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
  const destinationAccountPubkey = new PublicKey(destinationAccountAddress);
  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const wallet = await useWallet();

    const currentOwnerAccOrWallet = accountOwnerSignsExternally
      ? wallet
      : await createAccount(ownerSecret);

    const ix = Token.createCloseAccountInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      destinationAccountPubkey,
      currentOwnerAccOrWallet.publicKey,
      []
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      accountOwnerSignsExternally ? [] : [currentOwnerAccOrWallet],
      wallet
    );
  } else {
    const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
      tokenAccountPubkey
    );
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.closeAccount(
      tokenAccountPubkey,
      destinationAccountPubkey,
      await createAccount(ownerSecret),
      []
    );
  }
};

export const setTokenAccountCloser = async (
  feePayerSecret: string,
  tokenAccountAddress: string,
  currentAuthoritySecret: string,
  newAuthorityAddress: string,
  feePayerSignsExternally: boolean,
  currentAuthoritySignsExternally: boolean
) => {
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
  const tokenMintPubkey = await getMintPubkeyFromTokenAccountPubkey(
    tokenAccountPubkey
  );
  const connection = getConnection();
  const newAuthorityPubkeyOrNull = newAuthorityAddress
    ? new PublicKey(newAuthorityAddress)
    : null;

  if (feePayerSignsExternally || currentAuthoritySignsExternally) {
    const wallet = await useWallet();
    const currentAuthorityAccOrWallet = currentAuthoritySignsExternally
      ? wallet
      : await createAccount(currentAuthoritySecret);

    const ix = Token.createSetAuthorityInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      newAuthorityPubkeyOrNull,
      "CloseAccount",
      currentAuthorityAccOrWallet.publicKey,
      //@ts-expect-error
      []
    );
    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      currentAuthoritySignsExternally ? [] : [currentAuthorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayerSecret)
    );

    await token.setAuthority(
      tokenAccountPubkey,
      newAuthorityAddress ? newAuthorityPubkeyOrNull : null,
      "CloseAccount",
      await createAccount(currentAuthoritySecret),
      []
    );
  }
};

export const approveDelegate = async (
  feePayerSecret: string,
  feePayerSignsExternally: boolean,
  accountOwnerSecret: string,
  accountOwnerSignsExternally: boolean,
  tokenAccountAddress: string,
  delegateAccountAddress: string,
  amount: u64
) => {
  const delegateAccountPubkey = new PublicKey(delegateAccountAddress);
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);

  const connection = getConnection();
  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const wallet = await useWallet();
    const accountOwnerAccOrWallet = accountOwnerSignsExternally
      ? wallet
      : await createAccount(accountOwnerSecret);

    const ix = Token.createApproveInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      delegateAccountPubkey,
      accountOwnerAccOrWallet.publicKey,
      [],
      amount
    );

    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      accountOwnerSignsExternally ? [] : [accountOwnerAccOrWallet],
      wallet
    );

    return tokenAccountPubkey.toBase58();
  } else {
    const mintPubkey = await getMintPubkeyFromTokenAccountPubkey(
      tokenAccountPubkey
    );

    const feePayerAccount = await createAccount(feePayerSecret);
    const currentOwnerAcc = await createAccount(accountOwnerSecret);

    const token = new Token(
      connection,
      mintPubkey,
      TOKEN_PROGRAM_ID,
      feePayerAccount
    );

    await token.approve(
      tokenAccountPubkey,
      delegateAccountPubkey,
      currentOwnerAcc,
      [],
      amount
    );

    return tokenAccountPubkey.toBase58();
  }
};

export const revoke = async (
  feePayerSecret: string,
  feePayerSignsExternally: boolean,
  accountOwnerSecret: string,
  accountOwnerSignsExternally: boolean,
  tokenAccountAddress: string
) => {
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);
  const connection = getConnection();

  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const wallet = await useWallet();

    const accountOwnerAccOrWallet = accountOwnerSignsExternally
      ? wallet
      : await createAccount(accountOwnerSecret);

    const ix = Token.createRevokeInstruction(
      TOKEN_PROGRAM_ID,
      tokenAccountPubkey,
      accountOwnerAccOrWallet.publicKey,
      []
    );

    await sendTxUsingExternalSignature(
      [ix],
      connection,
      feePayerSignsExternally ? null : await createAccount(feePayerSecret),
      accountOwnerSignsExternally ? [] : [accountOwnerAccOrWallet],
      wallet
    );
  } else {
    const feePayerAccount = await createAccount(feePayerSecret);
    const accountOwnerAccount = await createAccount(accountOwnerSecret);
    const mintPubkey = await getMintPubkeyFromTokenAccountPubkey(
      tokenAccountPubkey
    );
    const token = new Token(
      connection,
      mintPubkey,
      TOKEN_PROGRAM_ID,
      feePayerAccount
    );

    await token.revoke(tokenAccountPubkey, accountOwnerAccount, []);
  }

  return tokenAccountPubkey.toBase58();
};
