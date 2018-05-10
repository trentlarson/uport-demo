import Connect from 'uport-connect'
import { Credentials } from 'uport'
import { transport, message } from 'uport-core'
import { decodeJWT, verifyJWT } from 'did-jwt'
import Web3 from 'web3'

// TODO could be helper func in uport-core, this is just from uport-js-client
const getUrlParams = (url) => (
  url.match(/[^&?]*?=[^&?]*/g)
     .map((param) => param.split('='))
     .reduce((params, param) => {
       params[param[0]] = param[1]
       return params
     }, {}))


// TODO this will move in connect with
const connectTransport = (uri, {data}) => {
  if (/requestToken/.test(uri)) {
  const jwt = getUrlParams(uri)['requestToken']
  let callback = null
  if (jwt) callback = decodeJWT(jwt).payload.callback
  if(/chasqui/.test(callback)) {
    // TODO also with unified urls, the transport for chasqui has to look more like this
    let isCancelled = false
    const cancel = () => { isCancelled = true }
    uri = message.util.paramsToQueryString(uri, {'type': 'post'})
    transport.qr.send()(uri, { cancel })
    return transport.chasqui.poll(callback, 2000, () => isCancelled).then(res => {
      transport.qr.close()
      return {res, data}
    }, err => {
      transport.qr.close()
      throw new Error(err)
    })
  } else {
    transport.qr.send()(uri)
    // return closeQR ??
    return Promise.resolve({data})
  }
} else {
  console.log(uri)
  console.log('calling chasqui send')
  return  transport.qr.chasquiSend()(uri).then(res => ({res, data}))
}
}

const credentials = new Credentials({
   address: '2oeXufHGDpU51bfKBsZDdu7Je9weJ3r7sVG',
   privateKey: 'c818c2665a8023102e430ef3b442f1915ed8dc3abcaffbc51c5394f03fc609e2'
})


// TODO need handle parsing a bit differently in connect
const verifyResponse = (res) => {
    console.log('verify')
    const decodedToken = decodeJWT(res).payload
    return verifyJWT(res, {audience: decodedToken.aud}).then(res => res.payload)
  }


const uportConnect = new Connect('DemoApp', {network: 'rinkeby', transport: connectTransport, verifyResponse})

const uportServer = {
  requestDisclosure: credentials.requestDisclosure.bind(credentials),
  attest: credentials.attest.bind(credentials)
}

const web3 = new Web3(uportConnect.getProvider())
web3.eth.defaultAccount = '0xB42E70a3c6dd57003f4bFe7B06E370d21CDA8087'


export { web3, uportConnect, uportServer }
