import { uportConnect, web3 } from './uportSetup'

// https://github.com/gluon-project/gluon-contracts/blob/feature/erc20-in-factory/build/contracts/CommunityTokenFactory.json
const communityTokenFactoryAbi = [{"constant":true,"inputs":[],"name":"gluon","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"isCommunityToken","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"createdTokens","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"gluonAddress","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"addr","type":"address"}],"name":"TokenCreated","type":"event"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_value","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"tokenFallback","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"exponent","type":"uint8"}],"name":"createCommunityToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"exponent","type":"uint8"}],"name":"createEthCommunityToken","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"exponent","type":"uint8"},{"name":"numTokens","type":"uint256"}],"name":"createEthCommunityTokenAndMint","outputs":[{"name":"","type":"address"}],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"string"},{"name":"_decimals","type":"uint8"},{"name":"_symbol","type":"string"},{"name":"_totalSupply","type":"uint256"}],"name":"createERC20Token","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getNumberOfCreatedTokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}]

// https://github.com/gluon-project/gluon-contracts/blob/feature/erc20-in-factory/build/contracts/ERC20Token.json
const erc20Abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_subtractedValue","type":"uint256"}],"name":"decreaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_addedValue","type":"uint256"}],"name":"increaseApproval","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"},{"name":"_totalSupply","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"}]

function CommunityTokenFactorySetup () {
  let ABI = uportConnect.contract(communityTokenFactoryAbi)
  let Obj = ABI.at('0x96319f39a17fe10fd0be22cbd0ec6cf0c5103900')
  return Obj
}

function CommunityTokenFactorySetupWeb3 () {
  let ABI = web3.eth.contract(communityTokenFactoryAbi)
  let Obj = ABI.at('0x96319f39a17fe10fd0be22cbd0ec6cf0c5103900')
  return Obj
}

function Erc20TokenSetup () {
  let ABI = uportConnect.contract(erc20Abi)
  let Obj = ABI.at('0x872385bd3fac1990a7d7800ce19bf770cd4854e5') // Love token
  return Obj
}

function Erc20TokenSetupWeb3 () {
  let ABI = web3.eth.contract(erc20Abi)
  let Obj = ABI.at('0x872385bd3fac1990a7d7800ce19bf770cd4854e5') // Love token
  return Obj
}

const CommunityTokenFactory = CommunityTokenFactorySetup()
const CommunityTokenFactoryWeb3 = CommunityTokenFactorySetupWeb3()

const Erc20 = Erc20TokenSetup()
const Erc20Web3 = Erc20TokenSetupWeb3()

export { CommunityTokenFactory, CommunityTokenFactoryWeb3, Erc20, Erc20Web3 }
