// Frameworks
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

import SharesContract from '../utilities/SharesContract'
import waitForMined from '../utilities/waitForMined'
import checkAddressMNID from '../utilities/checkAddressMNID'
import getShares from '../utilities/getShares'

import styled from 'styled-components'

const SharesWrap = styled.section``
const SharesArea = styled.div``
const CurrentSharesArea = styled.div``
const CurrentSharesNumber = styled.span``
const FormBuyshares = styled.form``
const FormRow = styled.div``
const BtnBuyShares = styled.button``

// #shares {
//   width: 320px;
//   margin: 1rem auto;
//   background: white;
//   padding: 10px 15px;
//   color: black;
// }
// #shares #shares-text {
//   display: block;
//   margin: auto;
// }
//
// #shares #shares-text #currentShares {
//   color: rgb(110, 212, 110);
//   font-size: 1.5rem;
//   position: relative;
//   top: 1px;
// }
//
// #sharesInput {
//   margin-left: 10px;
// }
//
// .btn-buy-shares {
//   background: #5cb85c;
//   margin-left: 20px;
//   color: white;
//   display: block;
//   margin: auto;
//   width: 100%;
// }

class SignTransaction extends Component {

  constructor (props) {
    super(props)
    this.getCurrentShares = this.getCurrentShares.bind(this)
    this.buyShares = this.buyShares.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  getCurrentShares () {
    console.log('getCurrentShares')
    // TODO: Dump this check once MNID is default behavior
    const addr = checkAddressMNID(this.props.uport.address)
    const actions = this.props.actions
    getShares(addr, actions)
  }

  buyShares (e) {
    e.preventDefault()

    let sharesNumber = this.props.sharesInput
    const addr = checkAddressMNID(this.props.uport.address)
    const actions = this.props.actions

    this.props.actions.buySharesREQUEST(sharesNumber)

    SharesContract.updateShares(sharesNumber, (error, txHash) => {
      if (error) { this.props.actions.buySharesERROR(error) }
      waitForMined(addr, txHash, { blockNumber: null }, actions, (total) => {
        this.props.actions.buySharesSUCCESS(txHash, total)
      })
    })
  }

  handleInputChange (event) {
    this.props.actions.updatesharesInput(event.target.value)
  }

  componentDidMount () {
    // Populate existing shares
    this.getCurrentShares()
  }

  render () {
    return (
      <SharesWrap>
        <h4>Sign a transaction</h4>
        <h6>Buy Shares in ConsenSys</h6>

        <SharesArea>
          <CurrentSharesArea>
            <span>Your current shares of Company-X: </span>
            <CurrentSharesNumber>{this.props.sharesTotal}</CurrentSharesNumber>
          </CurrentSharesArea>

          {
            this.props.confirmingInProgress
              ? <div> SPINNER </div>
              : (
                <FormBuyshares>
                  <FormRow>
                    <label>Shares to Buy: </label>
                    <input
                      id='sharesInput'
                      type='number'
                      onChange={this.handleInputChange}
                      value={this.props.sharesInput} />
                  </FormRow>
                  <FormRow>
                    <BtnBuyShares
                      onClick={this.buyShares}>
                      Buy Shares
                    </BtnBuyShares>
                    {
                      this.props.buyingInProgress
                        ? <span>Please wait for transaction card on phone</span>
                        : null
                    }
                  </FormRow>
                </FormBuyshares>
              )
          }
        </SharesArea>
      </SharesWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
    sharesInput: state.App.sharesInput,
    sharesTotal: state.App.sharesTotal,
    buyingInProgress: state.App.buyingInProgress,
    tx: state.App.tx,
    error: state.App.error
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default connect(mapStateToProps, mapDispatchToProps)(SignTransaction)
