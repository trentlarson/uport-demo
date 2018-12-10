// From https://github.com/MetaMask/eth-sig-util

import ethUtil from 'ethereumjs-util';

export function recoverPersonalSignature (message, signature) {
  const messageAsBuffer = ethUtil.toBuffer(message)
  const messageHash = ethUtil.hashPersonalMessage(messageAsBuffer)
  const v = signature.v
  const r = ethUtil.toBuffer(signature.r)
  const s = ethUtil.toBuffer(signature.s)
  const publicKey = ethUtil.ecrecover(messageHash, v, r, s)
  const address = ethUtil.publicToAddress(publicKey)
  return `0x${address.toString('hex')}`
}