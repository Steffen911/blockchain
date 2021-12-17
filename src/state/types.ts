export type PublicKey = string;
export type PrivateKey = string;

export type KeyPair = { publicKey: PublicKey, privateKey: PrivateKey };

/**
 * State defines the input and output of each transaction.
 * It consists of a map of PublicKeys to the number of coins this key
 * holds.
 */
export type State = Record<PublicKey, number>;
