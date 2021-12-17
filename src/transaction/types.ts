import { PublicKey } from '../state';

/**
 * Transactions will be applied to a given state to produce a new state.
 * They contain the tokens to spend (which are deducated for the given public key),
 * the tokens to create (which are added to the given public key),
 * and a signature that verifies guarantees that only the original owner spends the tokens.
 */
export type Transaction = {
  spend: Record<PublicKey, number>,
  create: Record<PublicKey, number>,
  sign: Record<PublicKey, string>,
};
