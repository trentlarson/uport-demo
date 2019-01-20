// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { insertSpacesBeforeCaps, firstAndLast3 } from '../utilities/claims.js'
import { withRouter } from 'react-router-dom'
import JSONInput from 'react-json-editor-ajrm'


const WelcomeWrap = styled.section``
const ChoiceButton = styled.button``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const JSONWrapper = styled.div`
  font-family: monospace !important
`

class ExploreConfirms extends Component {

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
      embeddedClaimInfo: null,
      subject: subject
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/claim?subject=' + this.state.subject, {
      headers: {
        "Content-Type": "application/json"
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
        this.setState({ claims: claims, confirmations: confirmations })
      })
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Your Claims</h4>
        <SubText>See the contents of your most recent claims & confirmations</SubText>
        <h3>Claim</h3>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <JSONWrapper>
          <JSONInput
            id='request'
            placeholder={ this.state.claim }
            viewOnly='true'
            confirmGood=''
            height='320px'
            width='550px'
            style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            locale='en'
          />
          </JSONWrapper>

          <JSONWrapper>
          <JSONInput
            id='claimContents'
            viewOnly='true'
            confirmGood=''
            placeholder={ this.state.embeddedClaimInfo ? this.state.embeddedClaimInfo : "" }
            height='320px'
            width='570px'
            theme='light_mitsuketa_tribute'
            colors={{'background':'#D4D4D4', 'string':'#70CE35'}}
            style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            locale='en'
          />
          </JSONWrapper>

        </div>

        <h3>Your Claims</h3>
        {
          this.state
            .claims
            .map(jwt =>
                 {
                   let claim = JSON.parse(atob(jwt.claimEncoded))
                   return <div key={jwt.id}>
                     <ChoiceButton key={jwt.id+"_button"} onClick={() => { this.setState({claim:claim, embeddedClaimInfo:{}}) }}>{insertSpacesBeforeCaps(jwt.claimType)}</ChoiceButton>
                     <ul>
                       <li>{claim.event.organizer.name}</li>
                       <li>{claim.event.name}</li>
                       <li>{claim.event.startTime}</li>
                     </ul>
                   </div>
                 }
                )
        }

        {
          this.state
            .confirmations
            .map(jwt =>
                 {
                   let claim = JSON.parse(atob(jwt.claimEncoded))
                   let embeddedClaim = JSON.parse(atob(claim.claimEncoded))
                   var embeddedClaimInfo = {}
                   embeddedClaimInfo[firstAndLast3(claim.claimEncoded)] = JSON.parse(atob(claim.claimEncoded))
                   return <div key={jwt.id}>
                     <ChoiceButton key={jwt.id+"_button"} onClick={() => { this.setState({claim:claim, embeddedClaimInfo:embeddedClaimInfo}) }}>{jwt.claimType}</ChoiceButton>
                     <ul>
                     <li>{insertSpacesBeforeCaps(embeddedClaim['@type'])}</li>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ExploreConfirms))
