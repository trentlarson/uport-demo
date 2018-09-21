import { Connect } from 'uport-connect'
import Web3 from 'web3'

// TODO move to server, if we want to use app identity in example, should setup server/client example
// const credentials = new Credentials({
//    address: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG',
//    privateKey: 'c818c2665a8023102e430ef3b442f1915ed8dc3abcaffbc51c5394f03fc609e2'
// })

const uportConnect = new Connect('DemoApp', {network: 'rinkeby', accountType: 'keypair'})

let brandingJWT

console.log(uportConnect.credentials)

uportConnect.credentials.signJWT({
  iat: Math.floor(Date.now() / 1000),
  sub: uportConnect.credentials.did,
  claim: {
    name: "uPort Demo",
    description: "uPort demo app",
    url: "https://demo.uport.me",
    profileImage: {"/": "/ipfs/Qmez4bdFmxPknbAoGzHmpjpLjQFChq39h5UMPGiwUHgt8f"},
    bannerImage: {"/": "/ipfs/QmUA7P9tTx3eQQi7k6VfGMADmDDyvG6xdn5P4yXxcMJs7a"},
  }
}).then((jwt) => {
  console.log(jwt)
  brandingJWT = jwt
})

const getBrandingJWT = () => {
  return brandingJWT
}



const web3 = new Web3(uportConnect.getProvider())
web3.eth.defaultAccount = '0xB42E70a3c6dd57003f4bFe7B06E370d21CDA8087'
console.log(uportConnect.state)

export { web3, uportConnect, getBrandingJWT}
