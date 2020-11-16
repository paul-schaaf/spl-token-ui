import { Account, PublicKey, SystemProgram } from "@solana/web3.js";
import {
  AuthorityType,
  MintLayout,
  Token,
  u64,
  AccountLayout
} from "@solana/spl-token";
import { COMMITMENT, getConnection } from "../solana/connection";
import { createAccount } from "./account";
import { useWallet, sendTxUsingExternalSignature } from "./externalSignature";

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
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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

export const mintToken = async (
  feePayer: string,
  tokenMintAddress: string,
  mintAuthority: string,
  destinationAccount: string,
  amount: u64,
  feePayerSignsExternally: boolean,
  mintAuthoritySignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const destinationPubkey = new PublicKey(destinationAccount);
  const connection = getConnection();

  if (mintAuthoritySignsExternally || feePayerSignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

    const mintAuthorityAccOrWallet = mintAuthoritySignsExternally
      ? wallet
      : await createAccount(mintAuthority);

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
      feePayerSignsExternally ? null : await createAccount(feePayer),
      mintAuthoritySignsExternally ? [] : [mintAuthorityAccOrWallet],
      wallet
    );

    return destinationPubkey.toBase58();
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    await token.mintTo(
      destinationPubkey,
      await createAccount(mintAuthority),
      [],
      amount
    );

    return destinationPubkey.toBase58();
  }
};

export const freezeAccount = async (
  feePayer: string,
  tokenMintAddress: string,
  addressToFreeze: string,
  freezeAuthoritySecret: string,
  feePayerSignsExternally: boolean,
  freezeAuthoritysignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const pubkeyToFreeze = new PublicKey(addressToFreeze);
  const connection = getConnection();
  if (feePayerSignsExternally || freezeAuthoritysignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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
      feePayerSignsExternally ? null : await createAccount(feePayer),
      freezeAuthoritysignsExternally ? [] : [authorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    await token.freezeAccount(
      pubkeyToFreeze,
      await createAccount(freezeAuthoritySecret),
      []
    );
  }
};

export const thawAccount = async (
  feePayer: string,
  tokenMintAddress: string,
  addressToThaw: string,
  freezeAuthoritySecret: string,
  feePayerSignsExternally: boolean,
  freezeAuthoritysignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const pubkeyToThaw = new PublicKey(addressToThaw);
  const connection = getConnection();

  if (feePayerSignsExternally || freezeAuthoritysignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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
      feePayerSignsExternally ? null : await createAccount(feePayer),
      freezeAuthoritysignsExternally ? [] : [authorityAccOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    await token.thawAccount(
      pubkeyToThaw,
      await createAccount(freezeAuthoritySecret),
      []
    );
  }
};

export const transferTokens = async (
  feePayer: string,
  tokenAddress: string,
  sourceAddress: string,
  destAddress: string,
  owner: string,
  amount: u64,
  feePayerSignsExternally: boolean,
  accountOwnerSignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenAddress);
  const sourcePubkey = new PublicKey(sourceAddress);
  const destinationPubkey = new PublicKey(destAddress);
  const connection = getConnection();

  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();
    const ownerAccountOrWallet = accountOwnerSignsExternally
      ? wallet
      : await createAccount(owner);

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
      feePayerSignsExternally ? null : await createAccount(feePayer),
      accountOwnerSignsExternally ? [] : [ownerAccountOrWallet],
      wallet
    );
  } else {
    const token = new Token(
      connection,
      tokenMintPubkey,
      TOKEN_PROGRAM_ID,
      await createAccount(feePayer)
    );

    await token.transfer(
      new PublicKey(sourceAddress),
      destinationPubkey,
      await createAccount(owner),
      [],
      amount
    );
  }
};

export const setTokenAccountOwner = async (
  feePayerSecret: string,
  tokenMintAddress: string,
  tokenAccountAddress: string,
  currentAuthoritySecret: string,
  newAuthorityAddress: string,
  feePayerSignsExternally: boolean,
  currentAuthoritySignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const connection = getConnection();
  const newAuthorityPubkey = new PublicKey(newAuthorityAddress);
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);

  if (feePayerSignsExternally || currentAuthoritySignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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
  tokenMintAddress: string,
  tokenAccountAddress: string,
  ownerSecret: string,
  amount: u64,
  feePayerSignsExternally: boolean,
  accountOwnerSignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const connection = getConnection();
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);

  if (feePayerSignsExternally || accountOwnerSignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();

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
  feePayerSecret: string,
  tokenMintAddress: string,
  tokenAccountAddress: string,
  currentAuthoritySecret: string,
  newAuthorityAddress: string,
  feePayerSignsExternally: boolean,
  currentAuthoritySignsExternally: boolean
) => {
  const tokenMintPubkey = new PublicKey(tokenMintAddress);
  const connection = getConnection();
  const newAuthorityPubkeyOrNull = newAuthorityAddress
    ? new PublicKey(newAuthorityAddress)
    : null;
  const tokenAccountPubkey = new PublicKey(tokenAccountAddress);

  if (feePayerSignsExternally || currentAuthoritySignsExternally) {
    const [wallet, connectToWallet] = useWallet();
    await connectToWallet();
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
