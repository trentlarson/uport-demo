import { uportConnect, web3 } from './uportSetup'

function SharesContractSetup () {
  let SharesABI = uportConnect.contract([{"constant":false,"inputs":[{"name":"share","type":"uint256"}],"name":"updateShares","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}])
  let SharesContractObj = SharesABI.at('0x71845bbfe5ddfdb919e780febfff5eda62a30fdc')
  return SharesContractObj
}

function SharesContractSetupWeb3 () {
  let SharesABI = web3.eth.contract([{"constant":false,"inputs":[{"name":"share","type":"uint256"}],"name":"updateShares","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"getShares","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"}])
  let SharesContractObj = SharesABI.at('0x71845bbfe5ddfdb919e780febfff5eda62a30fdc')
  return SharesContractObj
}

const SharesContract = SharesContractSetup()
const SharesContractWeb3 = SharesContractSetupWeb3()

export { SharesContract, SharesContractWeb3 }
