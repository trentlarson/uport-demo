// Frameworks
import React, { Component } from 'react'
import JSONInput from 'react-json-editor-ajrm'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { bindActionCreators } from 'redux'

import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { insertSpacesBeforeCaps, claimDescription } from '../utilities/claims'
import { getUserToken } from '../utilities/claimsTest'


const WelcomeWrap = styled.section``
const ChoiceButton = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const JSONWrapper = styled.div`
  font-family: monospace !important
`

class ReportClaims extends Component {

  constructor (props) {
    super(props)

    var subject = 'INVALID DID... ARE YOU NOT LOGGED IN?'
    if (uportConnect.did) {
      subject = uportConnect.did
    }

    this.state = {
      claim: {},
      claims: [],
      confirmations: [],
      loading: true,
      subject: subject
    }
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim?issuer=' + this.state.subject, {
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(response => response.json())
      .then(data => {
        var claims = [], confirmations = []
        for (var i = 0; i < data.length; i++) {
          let d = data[i]
          if (d.claimType === 'Confirmation') {
            confirmations.push(d)
          } else {
            claims.push(d)
          }
        }
        this.setState({ claims: claims, confirmations: confirmations, loading: false })
      })
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Your Claims</h4>
        <SubText>See the contents of your most recent claims & confirmations</SubText>
        <h3>Claim</h3>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <JSONWrapper>
          <JSONInput
            id='request'
            placeholder={ this.state.claim }
            viewOnly='true'
            confirmGood=''
            height='320px'
            width='590px'
            style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            locale='en'
          />
          </JSONWrapper>

        </div>

        <h3>Your Claims</h3>

        <div style={{'marginLeft':'auto','marginRight':'auto','width':'2em'}}>
        <HashLoader
          color={'#FF0000'}
          loading={this.state.loading}
          size={30}
          sizeUnit={"px"}
        />
        </div>

        {
          this.state
            .claims
            .map(jwt =>
                 {
                   // REMEMBER: if you change this format you'll probably want to change the confirmation format, too (below).
                   return <div key={jwt.id}>
                     <ChoiceButton onClick={() => { this.props.history.push('/reportClaim?claimId=' + jwt.id) }}>{insertSpacesBeforeCaps(jwt.claimType)}</ChoiceButton>
                       <br/>
                       <br/>
                       { jwt.claim ? claimDescription(jwt.claim) : "(details error)" }
                       &nbsp;
                       <a href="#" onClick={() => { if (jwt.claim) { this.setState({claim:jwt.claim}) } } }>(load above)</a>
                       <br/>
                       <br/>
                     </div>
                 }
                )
        }

        {
          this.state
            .confirmations
            .map(jwt =>
                 {
                   let embeddedClaims = jwt.claim.originalClaims || []
                   if (jwt.claim.originalClaim) {
                     embeddedClaims.push(jwt.claim.originalClaim)
                   }
                   return <div key={jwt.id}>
                     <ChoiceButton onClick={() => { this.props.history.push('/reportClaim?claimId=' + jwt.id) } }>{jwt.claimType}</ChoiceButton>
                     <ul>
                       { embeddedClaims.map(
                         embeddedClaim =>
                           <li>
                           { claimDescription(embeddedClaim) }
                           &nbsp;
                           <a href="#" onClick={() => { this.setState({claim:embeddedClaim}) }}>(load above)</a>
                           </li>
                         )
                       }
                     </ul>
                   </div>
                 }
                )
        }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportClaims))
