// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

const WelcomeWrap = styled.section``

/** When you add this, activate with 'await setup' in componentDidMount()

import R from 'ramda'
import { TEST_CREDS } from '../utilities/claimsTest.js'
const { Credentials } = require('uport-credentials')

let NOW_EPOCH = Math.floor(new Date().getTime() / 1000)
let TOMORROW_EPOCH = NOW_EPOCH + (24 * 60 * 60)

let jwtTemplate = {
  "iat": NOW_EPOCH,
  "exp": TOMORROW_EPOCH,
  // supply "sub"
  // supply "claim", usually including same DID of "sub"
  // supply "iss"
}

let confirmationTemplate = {
  "@context": "http://schema.org",
  "@type": "AgreeAction",
  "object": [
    // supply claims
  ]
}

let claimCornerBakery = {
  "@context": "http://endorser.ch",
  "@type": "Tenure",
  "spatialUnit": {
    "geo": {
      "@type": "GeoShape",
      "polygon": "40.883944,-111.884787 40.884088,-111.884787 40.884088,-111.884515 40.883944,-111.884515 40.883944,-111.884787"
    }
  },
  "party": {
    // supply "did"
  }
}

var credentials = R.map((c) => new Credentials(c), TEST_CREDS)

let pushTokenProms = R.map((c) => c.createVerification({ exp: TOMORROW_EPOCH }), credentials)

let claimCornerBakeryTenureFor0 = R.clone(claimCornerBakery)
claimCornerBakeryTenureFor0.party.did = TEST_CREDS[0].did

let confirmCornerBakeryTenureFor0By2Jwt = R.clone(jwtTemplate)
confirmCornerBakeryTenureFor0By2Jwt.sub = TEST_CREDS[0].did
confirmCornerBakeryTenureFor0By2Jwt.claim = R.clone(confirmationTemplate)
confirmCornerBakeryTenureFor0By2Jwt.claim.object.push(R.clone(claimCornerBakeryTenureFor0))
confirmCornerBakeryTenureFor0By2Jwt.iss = TEST_CREDS[2].did

let confirmCornerBakeryTenureFor0By3Jwt = R.clone(jwtTemplate)
confirmCornerBakeryTenureFor0By3Jwt.sub = TEST_CREDS[0].did
confirmCornerBakeryTenureFor0By3Jwt.claim = R.clone(confirmationTemplate)
confirmCornerBakeryTenureFor0By3Jwt.claim.object.push(R.clone(claimCornerBakeryTenureFor0))
confirmCornerBakeryTenureFor0By3Jwt.iss = TEST_CREDS[3].did

let claimProms =
    R.map((c) => credentials[0].createVerification(c),
          [confirmCornerBakeryTenureFor0By2Jwt, confirmCornerBakeryTenureFor0By3Jwt])

var pushTokens, claims
async function setup() {
  await Promise.all(pushTokenProms).then((allJwts) => { pushTokens = allJwts })
  console.log("Created demo 1 push tokens", pushTokens)

  await Promise.all(claimProms).then((allJwts) => { claims = allJwts })
  console.log("Created demo 1 user tokens")
}
**/

class SignClaim extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    /**
    if (process.env.REACT_APP_ENDORSER_CH_HOST_PORT.startsWith("http://localhost")) {
      fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": pushTokens[2]
        },
        body: JSON.stringify({jwtEncoded:claims[0]})
      })
        .then(response => response.json())
        .then(data => console.log("got post data", data))
    } else {
      alert("Sorry, not automatically submitting tests when not on localhost")
    }
    **/

  }

  render () {
    return (
        <WelcomeWrap>
        <h4>Test</h4>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignClaim))
