// Frameworks
import React, { Component } from 'react'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import { withRouter, Link } from 'react-router-dom'

import { SharesContract } from '../utilities/SharesContract'
import { CommunityTokenFactory, CommunityTokenFactoryWeb3, Erc20, Erc20Web3 } from '../utilities/TokensContracts'
import waitForMined from '../utilities/waitForMined'
import checkAddressMNID from '../utilities/checkAddressMNID'
import getShares from '../utilities/getShares'
import { uportConnect } from '../utilities/uportSetup'

import styled from 'styled-components'

const SharesWrap = styled.section`
  @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
    position: inherit;
  }
`
const SharesArea = styled.div``
const CurrentSharesArea = styled.div`
  margin-bottom: 20px;
`
const CurrentSharesNumber = styled.span`
  color: white;
`
const FormBuyshares = styled.form``
const FormRow = styled.div``
const BtnBuyShares = styled.button``
const NextButton = styled.button`
  margin-top: 20px;
`
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class SignTransaction extends Component {

  constructor (props) {
    super(props)
    this.getCurrentShares = this.getCurrentShares.bind(this)
    this.buyShares = this.buyShares.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)

    uportConnect.onResponse('updateShares').then(res => {
      const txHash = res.payload
      console.log(txHash)
      const addr = this.props.uport.address
      const actions = this.props.actions
      console.log('updateShares')
      waitForMined(addr, txHash, { blockNumber: null }, actions,
        () => {
          this.props.actions.buySharesPENDING()
        },
        (total) => {
          console.log('waitForMined complete')
          this.props.actions.buySharesSUCCESS(txHash, total)
          this.props.history.push('/credentials')
        }
      )
    }).catch(error => {
      if (error) { this.props.actions.buySharesERROR(error) }
    })

    uportConnect.onResponse('createERC20TokenResp').then(res => {
      const txHash = res.payload
      console.log(txHash)
      const addr = this.props.uport.address
      const actions = this.props.actions

      waitForMined(addr, txHash, { blockNumber: null }, actions,
        () => {
          console.log('pending ')
        },
        (result) => {
          console.log('waitForMined complete', result)

        }
      )
    }).catch(error => {
      if (error) { console.log(error) }
    })

    uportConnect.onResponse('transferERC20TokenResp').then(res => {
      const txHash = res.payload
      console.log(txHash)
      const addr = this.props.uport.address
      const actions = this.props.actions

      waitForMined(addr, txHash, { blockNumber: null }, actions,
        () => {
          console.log('pending ')
        },
        (result) => {
          console.log('waitForMined complete', result)

        }
      )
    }).catch(error => {
      if (error) { console.log(error) }
    })
    
  }

  getCurrentShares () {
    getShares(this.props.uport.address, this.props.actions)
  }

  buyShares (e) {
    e.preventDefault()

    console.log('buyShares')

    let sharesNumber = this.props.sharesInput
    console.log({sharesNumber, addr: this.props.uport.address, actions: this.props.actions})

    this.props.actions.buySharesREQUEST(sharesNumber)

    SharesContract.updateShares(sharesNumber, 'updateShares')
  }

  createErc20Token (e) {
    e.preventDefault()

    console.log('create token')

    CommunityTokenFactory.createERC20Token('Love coin', 0, 'LOV', '100000', 'createERC20TokenResp')
  }

  createErc20TokenWeb3 (e) {
    e.preventDefault()

    console.log('create token web3')

    CommunityTokenFactoryWeb3.createERC20Token('Love coin', 0, 'LOV', '100000', (a, b) => {
      console.log({a, b})
    })
  }

  transferErc20Token (e) {
    e.preventDefault()

    console.log('send erc20 token')

    Erc20.transfer('0x19711cd19e609febdbf607960220898268b7e24b', 10, 'transferERC20TokenResp')
  }

  transferErc20TokenWeb3 (e) {
    e.preventDefault()

    console.log('send erc20 token web3')

    Erc20Web3.transfer('0x19711cd19e609febdbf607960220898268b7e24b', 10, (a, b) => {
      console.log({a, b})
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
        <SubText>Buy Shares</SubText>

        <SharesArea>
          <CurrentSharesArea >
            <span>Your current shares: </span>
            <br />
            <CurrentSharesNumber>{this.props.sharesTotal}</CurrentSharesNumber>
          </CurrentSharesArea>

          {
            this.props.buyingInProgress
              ? (
                <div>
                  <br />
                  <div className="spinner center">
                    {[...Array(12)].map((x,i) =>
                      <div className="spinner-blade"key={i}/>
                    )}
                  </div>
                  <br />
                </div>
              )
              : (
                <FormBuyshares>
                  <FormRow>
                    <label>Shares to Buy: </label>
                    <input
                      id='sharesInput'
                      type='number'
                      style={{"paddingLeft":".5em", "fontSize":"16px"}}
                      onChange={this.handleInputChange}
                      value={this.props.sharesInput} />
                  </FormRow>
                  <FormRow>
                    <br />
                    <BtnBuyShares onClick={this.buyShares}>
                      Buy Shares
                    </BtnBuyShares>
                  </FormRow>
                  <FormRow>
                    <br />
                    <BtnBuyShares onClick={this.createErc20Token}>
                      Create ERC20 token
                    </BtnBuyShares>
                  </FormRow>
                  <FormRow>
                    <br />
                    <BtnBuyShares onClick={this.createErc20TokenWeb3}>
                      Create ERC20 token (web3)
                    </BtnBuyShares>
                  </FormRow>
                  <FormRow>
                    <br />
                    <BtnBuyShares onClick={this.transferErc20Token}>
                      Transfer ERC20 token
                    </BtnBuyShares>
                  </FormRow>
                  <FormRow>
                    <br />
                    <BtnBuyShares onClick={this.transferErc20TokenWeb3}>
                      Transfer ERC20 token (web3)
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
        {
          this.props.confirmingInProgress
            ? <div>Please confirm the transaction card on your phone</div>
            : null
        }
              <Link to="/credentials">
                <NextButton onClick={this.props.actions.buySharesDemoComplete}>
                  Next
                </NextButton>
              </Link>
      </SharesWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
    sharesInput: state.App.sharesInput,
    gettingShares: state.App.gettingShares,
    confirmingInProgress: state.App.confirmingInProgress,
    sharesTotal: state.App.sharesTotal,
    buyingInProgress: state.App.buyingInProgress,
    tx: state.App.tx,
    error: state.App.error
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignTransaction))
