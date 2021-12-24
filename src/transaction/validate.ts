import crypto from 'crypto';
import { State } from '../state';
import { Transaction } from './types';

/**
 * validateTransaction takes a given State and a Transaction and verifies it.
 * This includes the following checks:
 * - All spends are covered by enough tokens in the state
 * - We do not create more tokens than we spend
 * - All spends have a valid signature
 *
 * @param state - Input state before the transaction
 * @param transaction - The transaction to be applied
 * @returns - If the transaction is valid
 */
export function validateTransaction(state: State, transaction: Transaction): boolean {
  // check if all spends have a corresponding amount in the state
  for (const [publicKey, amount] of Object.entries(transaction.spend)) {
    if (state[publicKey] < amount) {
      return false;
    }
  }

  // check if we do not create more tokens than we spend
  const spentAmount = Object.values(transaction.spend).reduce((a, b) => a + b, 0);
  const createdAmount = Object.values(transaction.create).reduce((a, b) => a + b, 0);
  // Bitcoin allows spending more tokens than you create. Those tokens are usually given as
  // a tip or compensation to the miner. In our case we want the input to equal the output.
  if (spentAmount !== createdAmount) {
    return false;
  }

  // verify the signature
  for (const [publicKey, amount] of Object.entries(transaction.spend)) {
    if (!transaction.sign[publicKey]) {
      return false;
    }
    if (!crypto.verify(
      'SHA256',
      Buffer.from(`${amount}`),
      publicKey,
      Buffer.from(transaction.sign[publicKey], 'base64'),
    )
    ) {
      return false;
    }
  }

  return true;
}
