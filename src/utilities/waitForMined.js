import { web3 } from './uportSetup'

import checkAddressMNID from './checkAddressMNID'
import getShares from './getShares'

const pollingLoop = (address, txHash, response, actions, cb) => {
  setTimeout(function () {
    web3.eth.getTransaction(txHash, (error, response) => {
      console.log({error, response})
      if (response === null) {
        response = { blockNumber: null }
      } // Some nodes do not return pending tx
      waitForMined(address, txHash, response, actions, cb)
    })
  }, 1000) // check again in one sec.
}

async function waitForMined (address, txHash, response, actions, cb) {
  if (response.blockNumber) {
    console.log('MINED!!!')
    const addr = checkAddressMNID(address)
    getShares(addr, actions)
    cb()
  } else {
    console.log('Not mined yet.')
    pollingLoop(address, txHash, response, actions, cb)
  }
}

export default waitForMined
