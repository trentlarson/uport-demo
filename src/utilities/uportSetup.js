import { Connect, SimpleSigner } from 'uport-connect'

const uport = new Connect('uPort Demo', {
  clientId: '0x2bede7ae69a9aa7684c373ae33fb21162e565e52',
  signer: SimpleSigner('d2942f08d12611429c0ab9ea39eeda128253553d356b4c9f9f17f95e141cafc8')
})

const web3 = uport.getWeb3()
export { web3, uport }

// 0x2bede7ae69a9aa7684c373ae33fb21162e565e52
// d2942f08d12611429c0ab9ea39eeda128253553d356b4c9f9f17f95e141cafc8
