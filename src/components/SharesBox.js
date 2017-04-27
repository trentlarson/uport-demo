// Frameworks
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'

import SharesContract from '../utilities/SharesContract'
import waitForMined from '../utilities/waitForMined'
import checkAddressMNID from '../utilities/checkAddressMNID'
import getShares from '../utilities/getShares'

class SharesBox extends Component {

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
      <div id='shares'>
        <div id='shares-text'>
          <span>Your current shares of Company-X: </span>
          <b id='currentShares'>{this.props.sharesTotal}</b>
        </div>

        {
          this.props.confirmingInProgress
            ? <div> SPINNER </div>
            : (
              <form id='form-buyshares'>
                <div className='form-row'>
                  <label>Shares to Buy: </label>
                  <input
                    id='sharesInput'
                    type='number'
                    onChange={this.handleInputChange}
                    value={this.props.sharesInput} />
                </div>
                <div className='form-row'>
                  <button
                    className='btn btn-buy-shares'
                    onClick={this.buyShares}>
                    Buy Shares
                  </button>
                  {
                    this.props.buyingInProgress
                      ? <span>Please wait for transaction card on phone</span>
                      : null
                  }
                </div>
              </form>
            )
        }
      </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(SharesBox)
