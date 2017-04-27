// Frameworks
import React, { Component } from 'react'
import { uport } from '../utilities/uportSetup'

import styled from 'styled-components'

const CredentialsWrap = styled.section``
const CredentialsArea = styled.section``
const Row = styled.div``

class CollectCredentials extends Component {

  constructor (props) {
    super(props)
    this.credentialsbtnClick = this.credentialsbtnClick.bind(this)
  }

  credentialsbtnClick () {
    uport.attestCredentials({
      sub: this.props.uport.address,
      claim: {name: this.props.uport.name},
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // 30 days from now
      uriHandler: (log1, log2, log3) => { console.log(log1, log2, log3) }
    })
  }

  render () {
    return (
      <CredentialsWrap>
        <h4>Reclaim ownership of your data</h4>
        <CredentialsArea>
          <Row>
            <label>Name: XXXXXX</label>
            <button>Get</button>
          </Row>
          <Row>
            <label>Relationship: User</label>
            <button>Get</button>
          </Row>
          <Row>
            <label>Certificate: uPort Demo</label>
            <button>Get</button>
          </Row>
        </CredentialsArea>
        <h6>Credentials take a moment to appear on your device.</h6>
      </CredentialsWrap>
    )
  }
}

export default CollectCredentials
