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
const CurrentSharesNumber = styled.span`
  color: #33C273;
  font-weight: bold;
`
const FormBuyshares = styled.form``
const FormRow = styled.div``
const BtnBuyShares = styled.button``

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

    console.log('buyShares')

    let sharesNumber = this.props.sharesInput
    const addr = checkAddressMNID(this.props.uport.address)
    const actions = this.props.actions

    console.log({sharesNumber, addr, actions})

    this.props.actions.buySharesREQUEST(sharesNumber)

    // this.props.actions.buySharesSUCCESS('0x00', '001')

    SharesContract.updateShares(sharesNumber, (error, txHash) => {
      console.log('updateShares')
      if (error) { this.props.actions.buySharesERROR(error) }
      waitForMined(addr, txHash, { blockNumber: null }, actions, (total) => {
        console.log('waitForMined')
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
            <span>Your current shares of ConsenSys: </span>
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
                    <br />
                    <BtnBuyShares
                      onClick={this.buyShares}>
                      Buy Shares
                    </BtnBuyShares>
                  </FormRow>
                  <FormRow>
                    <br />
                    {
                      this.props.buyingInProgress
                        ? <div>Please wait for transaction card on phone</div>
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
