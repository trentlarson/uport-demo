import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('CryptoX', {
  clientId: '0xe2fef711a5988fbe84b806d4817197f033dde050',
  signer: SimpleSigner('4894506ba6ed1a2d21cb11331620784ad1ff9adf1676dc2720de5435dcf76ac2')
})

export default uport
