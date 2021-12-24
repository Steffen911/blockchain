import crypto from 'crypto';
import { Transaction } from './types';
import { PublicKey } from '../state';
import { publicKeyToString } from '../util/util';

/**
 * createTransactions takes a source keyPair and a set of target recipients
 * plus their amounts. It creates a transaction based on those and
 * automatically calculates the amount to be deducted. One limitation is
 * that we only accept one source wallet at the moment.
 * @param keyPair - Public- and Private-Key that form the source of the transaction
 * @param recipients - Recipients with the target amounts
 * @returns - Transaction object
 */
export function createTransaction(
  keyPair: { publicKey: crypto.KeyObject, privateKey: crypto.KeyObject },
  recipients: Record<PublicKey, number>,
): Transaction {
  const totalAmount = Object.values(recipients)
    .reduce((acc, elem) => acc + elem, 0);
  return {
    create: recipients,
    spend: {
      [publicKeyToString(keyPair.publicKey)]: totalAmount,
    },
    sign: {
      [publicKeyToString(keyPair.publicKey)]: crypto.sign(
        'SHA256',
        Buffer.from(`${totalAmount}`),
        keyPair.privateKey,
      ).toString('base64'),
    },
  };
}
