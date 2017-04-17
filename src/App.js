// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import * as AppActions from './actions/AppActions'

// Functions
import { uport, web3 } from './uportSetup'

// Assets
import chart from './chart.png'

// Components
import Navbar from './components/Navbar'

class App extends Component {

  constructor (props) {
    super(props)
    this.signInbtnClick = this.signInbtnClick.bind(this)

    this.buySharesContractSetup = this.buySharesContractSetup.bind(this)
    this.getCurrentShares = this.getCurrentShares.bind(this)
    this.buyShares = this.buyShares.bind(this)

    this.waitForMined = this.waitForMined.bind(this)

    const buySharesContract = this.buySharesContractSetup()

    this.state = {
      modalOpen: false,
      buySharesContract: buySharesContract,
      tx: null,
      error: null,
      sharesTotal: null,
      uport: null
    }
  }

  buySharesContractSetup () {
    let buySharesContract = web3.eth.contract([{'constant': false, 'inputs': [{'name': 'share', 'type': 'uint256'}], 'name': 'updateShares', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'addr', 'type': 'address'}], 'name': 'getShares', 'outputs': [{'name': '', 'type': 'uint256'}], 'payable': false, 'type': 'function'}])
    let buyShares = buySharesContract.at('0x432472827c271b795402cd385df9f425d0bf1cfe')
    return buyShares
  }

  getCurrentShares () {
    const self = this
    this.state
        .buySharesContract
        .getShares
        .call(this.state.uport.address, function (error, sharesNumber) {
          if (error) { throw error }
          console.log({sharesNumber})
          self.setState({sharesTotal: sharesNumber})
        })
  }

  buyShares (e) {
    e.preventDefault()
    const self = this

    let sharesNumber = this.refs.sharesInput.value

    this.setState({
      sharesTotal: sharesNumber
    })

    this.state
        .buySharesContract
        .updateShares(sharesNumber, function (err, txHash) {
          console.log(err, txHash)
          self.setState({tx: txHash})
          self.waitForMined(txHash, { blockNumber: null })
        })
  }

  waitForMined (txHash, response) {
    let self = this
    if (response.blockNumber) {
      self.state
          .buySharesContract
          .getShares
          .call(this.state.uport.address, function (error, response) {
            console.log(error, response)
            self.setState({sharesTotal: response})
          })
    } else {
      console.log('not mined yet.')
      setTimeout(function () { // check again in one sec.
        web3.eth.getTransaction(txHash, function (error, response) {
          console.log(error, response)
          if (response === null) { response = { blockNumber: null } } // Some nodes do not return pending tx
          self.waitForMined(txHash, response)
        })
      }, 1000)
    }
  }

  uportBtnClick () {
    this.setState({ modalOpen: false })
    uport.requestCredentials({
      requested: ['name', 'phone', 'country'],
      notifications: true
    })
    .then((credentials) => {
      this.props.actions.connectUport(credentials)
      this.setState({ uport: credentials })
    })
  }

  signInbtnClick () {
    this.setState({ modalOpen: true })
  }

  render () {
    console.log('uport', this.state.uport)
    console.log('sharesTotal', this.state.sharesTotal)
    if (this.state.uport !== null) {
      this.getCurrentShares()
    }
    return (
      <div className='App'>

        <div className='App-header'>
          <Navbar />
        </div>

        <div className='App-banner'>
          <div className='warning-banner slideInDown animated'>
            <b>This demo currently only works on the revived ROPSTEN network.</b>
          </div>
        </div>

        <div className='App-body'>
          <div className='App-body-intro'>
            {
              !this.state.uport
                ? (
                  <div>
                    <h4>Welcome to Crypto X</h4>
                    <h6>
                      This is a test application built by the uPort team
                      to demonstrate the log-in and credentialing
                      functionalities of our uPort libraries.
                    </h6>
                    <button
                      style={{cursor: 'pointer'}}
                      onClick={() => this.signInbtnClick()}
                      className='btn btn-primary btn-md ml-auto p-2'>SIGN IN</button>
                  </div>
                )
                : (
                  <div>
                    <img alt='chart' src={chart} style={{maxWidth: '100%'}} />
                    <div id='shares'>
                      <div>
                        <span>Your current shares of Company-X: </span>
                        <b id='currentShares'>{this.state.sharesTotal}</b>
                      </div>
                      <form>
                        <label>Shares to Buy: </label>
                        <input
                          id='sharesInput'
                          ref='sharesInput'
                          type='number'
                          defaultValue='0' />
                        <button
                          className='btn'
                          onClick={this.buyShares}>
                          Buy Shares
                        </button>
                      </form>
                    </div>
                    {
                      this.state.tx
                        ? (
                          <div id='success' style={{display: 'none'}}>
                            <h3>Success! You have bought shares</h3>
                            <p>
                              <strong>Tx:</strong>
                              <span id='tx' style={{display: 'inline-block', marginLeft: '10px'}} />
                            </p>
                          </div>
                        )
                        : null
                    }
                    {
                      this.state.error
                        ? (
                          <div id='errorDiv'>
                            <h3>Error! You have NOT bought shares.</h3>
                            <p>
                              <strong>Error:</strong>
                              <span id='error' style={{display: 'inline-block', marginLeft: '10px'}} />
                            </p>
                          </div>
                        )
                        : null
                    }
                  </div>
                )
            }
            {
              this.state.modalOpen
                ? (
                  <div id='signInModal' className='Center-Block Absolute-Center is-Fixed is-Variable Modal'>
                    <h2>Sign in to Crypto-X</h2>
                    <button className='fb-btn'>Log in with Facebook</button>
                    <br />
                    <br />
                    <button
                      className='uport-btn'
                      onClick={() => this.uportBtnClick()}>Log in with uPort</button>
                    <hr />
                    <form>
                      <input type='text' placeholder='Name' disabled />
                      <br />
                      <br />
                      <input type='text' placeholder='Password' disabled />
                      <br />
                      <br />
                      <button className='form-btn' disabled>Sign In</button>
                    </form>
                  </div>
                )
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uportState: state.App.uport,
    ui: state.App.ui
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators(AppActions, dispatch)
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App)
