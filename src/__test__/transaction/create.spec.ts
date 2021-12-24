import crypto from 'crypto';
import { State } from '../../state';
import { createTransaction, validateTransaction } from '../../transaction';
import { generateKey, publicKeyToString } from '../../util/util';

describe('createTransaction', () => {
  let keyPairList: { publicKey: crypto.KeyObject, privateKey: crypto.KeyObject }[];
  const state: State = {};

  beforeAll(() => {
    keyPairList = [...Array(10).keys()].map(() => generateKey());
    keyPairList.forEach((keyPair, index) => {
      state[publicKeyToString(keyPair.publicKey)] = index;
    });
  });

  it('should create a transaction to one recipient', () => {
    const source = keyPairList[9];
    const transaction = createTransaction(
      source,
      { [publicKeyToString(keyPairList[2].publicKey)]: 3 },
    );

    expect(transaction.spend).toEqual({
      [publicKeyToString(source.publicKey)]: 3,
    });
    expect(transaction.create).toEqual({ [publicKeyToString(keyPairList[2].publicKey)]: 3 });
    expect(validateTransaction(state, transaction)).toEqual(true);
  });

  it('should create a transaction to multiple recipients', () => {
    const source = keyPairList[9];
    const transaction = createTransaction(
      source,
      {
        [publicKeyToString(keyPairList[2].publicKey)]: 3,
        [publicKeyToString(keyPairList[4].publicKey)]: 1,
      },
    );

    expect(transaction.spend).toEqual({
      [publicKeyToString(source.publicKey)]: 4,
    });
    expect(transaction.create).toEqual({
      [publicKeyToString(keyPairList[2].publicKey)]: 3,
      [publicKeyToString(keyPairList[4].publicKey)]: 1,
    });
    expect(validateTransaction(state, transaction)).toEqual(true);
  });
});
