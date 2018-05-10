import { SharesContractWeb3 } from '../utilities/SharesContract'

async function getShares (addr, actions) {
  console.log('address')
  console.log(addr)
  actions.getCurrentSharesREQUEST()
  SharesContractWeb3.getShares
    .call(addr, (error, sharesNumber) => {
      if (error) {
        actions.getCurrentSharesERROR(error)
        throw error
      }
      const sharesNumberDecoded = sharesNumber.toNumber()
      actions.getCurrentSharesSUCCESS(sharesNumberDecoded)
      return sharesNumberDecoded
    })
}

export default getShares
