import Connect from 'uport-connect'
import { Credentials } from 'uport'
import { transport, message, crypto } from 'uport-core'
import { decodeJWT, verifyJWT } from 'did-jwt'
import Web3 from 'web3'

// TODO move to server
const credentials = new Credentials({
   address: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG',
   privateKey: 'c818c2665a8023102e430ef3b442f1915ed8dc3abcaffbc51c5394f03fc609e2'
})

const uportConnect = new Connect('DemoApp', {network: 'rinkeby'})
// Because we are mocking server
uportConnect.credentials = credentials

uportConnect.verifyResponse = (token) => {
      return verifyJWT(token, {audience: credentials.did}).then(res => {
        uportConnect.doc = res.doc
        return credentials.processDisclosurePayload(res)
      })
    }

// Also because we are mocking server, using chasqui in place of our own server
const CHASQUI_URL = 'https://chasqui.uport.me/api/v1/topic/'
const uportServer = {
  requestDisclosure: () => {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true,
                     callbackUrl: CHASQUI_URL + crypto.randomString(16) }
    return credentials.requestDisclosure(reqObj)
  },
  attest: credentials.attest.bind(credentials),
  createVerificationRequest: (sub) => {
    const unsignedClaim = { claim: { "Self Signed": { value: true }}, sub }
    return credentials.signJWT({unsignedClaim, sub, type: 'verReq', callback: CHASQUI_URL + crypto.randomString(16)})
  }
}

const web3 = new Web3(uportConnect.getProvider())
web3.eth.defaultAccount = '0xB42E70a3c6dd57003f4bFe7B06E370d21CDA8087'


export { web3, uportConnect, uportServer }
