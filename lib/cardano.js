import { AppWallet, ForgeScript, Transaction, KoiosProvider } from '@meshsdk/core';

const networkId = parseInt(process.env.CARDANO_NETWORK_ID);
const providerUrl = process.env.KOIOS_URL;
const mnemonic = process.env.WALLET_MNEMONIC;
const scriptCborHex = process.env.SCRIPT_CBOR;

const provider = new KoiosProvider(providerUrl);

const appWallet = new AppWallet({
  networkId,
  fetcher: provider,
  submitter: provider,
  key: {
    type: 'mnemonic',
    words: mnemonic.split(' '),
  },
});

const script = ForgeScript.fromCbor(scriptCborHex);

export async function createTask(userAddress, taskDetails) {
  const { task_description, deadline, pledge_amount } = taskDetails;
  
  const tx = new Transaction({ initiator: appWallet })
    .sendLovelace(
      script,
      pledge_amount.toString(),
      {
        datum: {
          user: userAddress,
          task: {
            task_description,
            deadline,
            pledge_amount,
          },
          created_at: Math.floor(Date.now() / 1000),
        },
      }
    );

  const unsignedTx = await tx.build();
  const signedTx = await appWallet.signTx(unsignedTx);
  const txHash = await appWallet.submitTx(signedTx);

  return txHash;
}

export async function completeTask(utxoId) {
  const tx = new Transaction({ initiator: appWallet })
    .redeemValue(
      script,
      utxoId,
      { Complete: {} }
    );

  const unsignedTx = await tx.build();
  const signedTx = await appWallet.signTx(unsignedTx);
  const txHash = await appWallet.submitTx(signedTx);

  return txHash;
}

export async function forfeitTask(utxoId) {
  const tx = new Transaction({ initiator: appWallet })
    .redeemValue(
      script,
      utxoId,
      { Forfeit: {} }
    );

  const unsignedTx = await tx.build();
  const signedTx = await appWallet.signTx(unsignedTx);
  const txHash = await appWallet.submitTx(signedTx);

  return txHash;
}

export async function cancelTask(utxoId) {
  const tx = new Transaction({ initiator: appWallet })
    .redeemValue(
      script,
      utxoId,
      { Cancel: {} }
    );

  const unsignedTx = await tx.build();
  const signedTx = await appWallet.signTx(unsignedTx);
  const txHash = await appWallet.submitTx(signedTx);

  return txHash;
}