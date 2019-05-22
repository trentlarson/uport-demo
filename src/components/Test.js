// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import R from 'ramda'

const { Credentials } = require('uport-credentials')

const WelcomeWrap = styled.section``

let creds = [
    { did: 'did:ethr:0x00c9c2326c73f73380e8402b01de9defcff2b064', privateKey: '8de6e2bd938a29a8348316cbae3811475f22f2ae87a42ad0ece727ff25c613b5' },
    { did: 'did:ethr:0x11bb3621f8ea471a750870ae8dd5f4b8203e9557', privateKey: 'e4a3d47ed1058e5c07ed825b5cf0516aab757b1d141a4dc24392271537e10aa0' },
    { did: 'did:ethr:0x22c51a43844e44b59c112cf74f3f5797a057837a', privateKey: '590e1a75d89e453d9b33f982badc4fdcd67046c8dbf4323f367b847776126d1b' },
    { did: 'did:ethr:0x332661e9e6af65eea6df253296a26257ff304647', privateKey: 'ae945c106dc5538b5dc6acffef7901ef5e30b22c80d7af0a5d466432a49eeb9c' },
    { did: 'did:ethr:0x44afb67bb333f2f61aa160532de0490f6dc9f441', privateKey: 'c729c12f5b95db8ab048b95319329f35e9165585a3e9f69f36e7309f2f1c77bc' },
    { did: 'did:ethr:0x5592ea1a9a3c9bb12abe5fc91bfa40622b24a932', privateKey: '3561bed03fb41bf3dec3926273b302f20bb25a25c723a93e1e6c9212edff6d1d' },
    { did: 'did:ethr:0x66b50b886a7df641c96f787002de3ace753bb1b1', privateKey: '7bd14ba3709d0d31f8ba56f211856bdb021655c5d99aa5ef055e875159e695a6' },
    { did: 'did:ethr:0x777d6361330d047e99bee0a275a8adb908fe5514', privateKey: 'e078084054c30a94f648cfde5bc1bbcbc341ee71431f1b37abf1dc7c8f2f5d35' },
  ]

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
  "@context": "http://endorser.ch",
  "@type": "Confirmation",
  "originalClaims": [
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

var credentials = R.map((c) => new Credentials(c), creds)

let pushTokenProms = R.map((c) => c.createVerification({ exp: TOMORROW_EPOCH }), credentials)

let claimCornerBakeryTenureFor0 = R.clone(claimCornerBakery)
claimCornerBakeryTenureFor0.party.did = creds[0].did

let confirmCornerBakeryTenureFor0By2Jwt = R.clone(jwtTemplate)
confirmCornerBakeryTenureFor0By2Jwt.sub = creds[0].did
confirmCornerBakeryTenureFor0By2Jwt.claim = R.clone(confirmationTemplate)
confirmCornerBakeryTenureFor0By2Jwt.claim.originalClaims.push(R.clone(claimCornerBakeryTenureFor0))
confirmCornerBakeryTenureFor0By2Jwt.iss = creds[2].did

let confirmCornerBakeryTenureFor0By3Jwt = R.clone(jwtTemplate)
confirmCornerBakeryTenureFor0By3Jwt.sub = creds[0].did
confirmCornerBakeryTenureFor0By3Jwt.claim = R.clone(confirmationTemplate)
confirmCornerBakeryTenureFor0By3Jwt.claim.originalClaims.push(R.clone(claimCornerBakeryTenureFor0))
confirmCornerBakeryTenureFor0By3Jwt.iss = creds[3].did

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

class SignClaim extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    await setup()
    console.log("claims[0]",claims[0])

    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": pushTokens[2]
      },
      body: JSON.stringify({jwtEncoded:claims[0]})
    })
      .then(response => response.json())
      .then(data => console.log("got post data", data))

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
