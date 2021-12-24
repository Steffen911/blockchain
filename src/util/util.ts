import crypto from 'crypto';

export function generateKey(namedCurve = 'P-521') {
  const {
    publicKey,
    privateKey,
  } = crypto.generateKeyPairSync(
    'ec',
    { namedCurve },
  );
  return { publicKey, privateKey };
}

export function publicKeyToString(key: crypto.KeyObject): string {
  return key.export({ type: 'spki', format: 'pem' }).toString();
}
