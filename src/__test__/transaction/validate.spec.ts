import crypto from 'crypto';
import { State } from '../../state';
import { Transaction, validateTransaction } from '../../transaction';
import { generateKey, publicKeyToString } from '../../util/util';

describe('validateTransaction', () => {
  let keyPairList: { publicKey: crypto.KeyObject, privateKey: crypto.KeyObject }[];
  const state: State = {};

  beforeAll(() => {
    keyPairList = [...Array(10).keys()].map(() => generateKey());
    keyPairList.forEach((keyPair, index) => {
      state[publicKeyToString(keyPair.publicKey)] = index;
    });
  });

  it('should confirm a valid transaction', () => {
    const transaction: Transaction = {
      create: {
        [publicKeyToString(keyPairList[2].publicKey)]: 3,
      },
      spend: {
        [publicKeyToString(keyPairList[6].publicKey)]: 3,
      },
      sign: {
        [publicKeyToString(keyPairList[6].publicKey)]: crypto.sign(
          'SHA256',
          Buffer.from('3'),
          keyPairList[6].privateKey,
        ).toString('base64'),
      },
    };

    expect(validateTransaction(state, transaction)).toEqual(true);
  });

  it('should confirm an empty transaction', () => {
    const state: State = {};
    const transaction: Transaction = {
      create: {},
      spend: {},
      sign: {},
    };

    expect(validateTransaction(state, transaction)).toEqual(true);
  });

  it('should reject a wrong signature', () => {
    const transaction: Transaction = {
      create: {
        [publicKeyToString(keyPairList[2].publicKey)]: 3,
      },
      spend: {
        [publicKeyToString(keyPairList[6].publicKey)]: 3,
      },
      sign: {
        [publicKeyToString(keyPairList[6].publicKey)]: crypto.sign(
          'SHA256',
          Buffer.from('3'),
          // Use privateKey of different user to sign
          keyPairList[7].privateKey,
        ).toString('base64'),
      },
    };

    expect(validateTransaction(state, transaction)).toEqual(false);
  });

  it('should reject mismatching amounts', () => {
    const transaction: Transaction = {
      create: {
        [publicKeyToString(keyPairList[2].publicKey)]: 2,
      },
      spend: {
        [publicKeyToString(keyPairList[6].publicKey)]: 3,
      },
      sign: {},
    };

    expect(validateTransaction(state, transaction)).toEqual(false);
  });

  it('should reject insufficient funds', () => {
    const transaction: Transaction = {
      create: {
        [publicKeyToString(keyPairList[2].publicKey)]: 3,
      },
      spend: {
        [publicKeyToString(keyPairList[6].publicKey)]: 12,
      },
      sign: {},
    };

    expect(validateTransaction(state, transaction)).toEqual(false);
  });
});
