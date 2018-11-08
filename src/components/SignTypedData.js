import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import JSONInput from 'react-json-editor-ajrm'
import { withRouter, Link } from 'react-router-dom'

import * as AppActions from '../actions/AppActions'
import { uportConnect } from '../utilities/uportSetup'

const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const JSONWrapper = styled.div`
  font-family: monospace !important
`
const NextButton = styled.button`
  margin-top: 20px;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`

const TypedDataSigReqID = 'TypedDataSigReqID'
const MAIL_REQ = {
  types: {
      EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
      ],
      Person: [
          { name: 'name', type: 'string' },
          { name: 'wallet', type: 'address' }
      ],
      Mail: [
          { name: 'from', type: 'Person' },
          { name: 'to', type: 'Person' },
          { name: 'contents', type: 'string' }
      ],
  },
  primaryType: 'Mail',
  domain: {
      name: 'Ether Mail',
      version: '1',
      chainId: 1,
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
  },
  message: {
      from: {
          name: 'Cow',
          wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
      },
      to: {
          name: 'Bob',
          wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
      },
      contents: 'Hello, Bob!',
  },
}

class SignTypedData extends Component {
  
  constructor (props) {
    super(props)
    this.state = {
      responseJSON: null,
      typedData: MAIL_REQ
    }

    this.signTypedData = this.signTypedData.bind(this)
    this.handleSignedData = this.handleSignedData.bind(this)

    console.log('constructing...')
    uportConnect.onResponse(TypedDataSigReqID)
      .then(this.handleSignedData)
      .catch(error => {
        this.setState({responseJSON: error})
        throw error
      })
  }

  handleSignedData({payload}) {
    this.setState({
      responseJSON: payload.signature,
    })
  }

  signTypedData () {
    this.setState({responseJWT: null})
    const { typedData } = this.state
    console.log('sending request')
    uportConnect.requestTypedDataSignature(typedData, TypedDataSigReqID)
  }

  render() {
    const { typedData, responseJSON } = this.state
    console.log('rendering')
    return (
      <WelcomeWrap>
        <h4>Sign the following piece of ERC712 Typed Data: </h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>
          <h3>Typed Data: </h3>
            <JSONWrapper>
            {(typedData !== null) && <JSONInput
                id="request"
                placeholder={ typedData }
                height="300px"
                width="500px"
                onChange={(value) => {
                  if (value.jsObject !== undefined) {
                    this.setState({typedData: value.jsObject})
                  }
                }}
                style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            />}
            </JSONWrapper>
            <ClaimButton onClick={()=>{
              this.setState({typedData: null})
              this.setState({typedData: MAIL_REQ})
            }}>Reset</ClaimButton>
          </div>
          {responseJSON && (
            <div>
              <h3>Signature: </h3>
              <JSONWrapper>
              <JSONInput
                id="response"
                placeholder={ responseJSON }
                height="300px"
                width="500px"
                viewOnly
                style={{body: {fontSize: '10pt', textAlign: 'left'}}}
              />
              </JSONWrapper>
            </div>
          )}
        </div>
        <ConnectUport onClick={this.signTypedData}>
          Sign Claim
        </ConnectUport>
        <div>
        <Link to="/personalsign">
          <NextButton>
            Next
          </NextButton>
        </Link>
        </div>
      </WelcomeWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignTypedData))
