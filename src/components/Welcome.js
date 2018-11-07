// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportServer, uportConnect } from '../utilities/uportSetup'
import { crypto } from 'uport-core'

const ConnectReqID = 'ConnectRequest'
const WelcomeWrap = styled.section``
const ConnectUport = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`

class Welcome extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)

    uportConnect.onResponse(ConnectReqID).then(payload => {
      console.log(uportConnect)
      console.log(uportConnect.doc)
      const publicEncKey = uportConnect.doc.publicKey[1].publicKeyBase64
      const resObj = Object.assign(payload.res, {address: uportConnect.address, did: uportConnect.did, mnid: uportConnect.mnid, publicEncKey})
      this.props.actions.connectUport(resObj)
    })
  }

  connectUport () {
    uportServer.requestDisclosure().then(jwt => {
      console.log(jwt)
      uportConnect.request(jwt, ConnectReqID, {type: 'redirect'})
    })
  }

  render () {
    return (
      <WelcomeWrap>
        <h4>Build a Better dApp</h4>
        <SubText>Identity and transaction infrastructure for Ethereum</SubText>
        <ConnectUport
          onClick={this.connectUport}>
          Connect with uPort
        </ConnectUport>
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
export default connect(mapStateToProps, mapDispatchToProps)(Welcome)
