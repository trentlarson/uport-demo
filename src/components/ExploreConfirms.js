// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { withRouter } from 'react-router-dom'
import JSONInput from 'react-json-editor-ajrm'
import { DateTime } from 'luxon'


const WelcomeWrap = styled.section``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const JSONWrapper = styled.div`
  font-family: monospace !important
`

const attendedClaim = {
  "@context": "http://schema.org",
  "@type": "JoinAction",
  // note that there is constructor code below that sets "did" inside "agent"
  "agent": { "did": "did:ethr:0xdf0d8e5fd234086f6649f77bb0059de1aebd143e" },
  "event": {
    "organizer": { "name": "Bountiful Voluntaryist Community" },
    "name": "Saturday Morning Meeting",
    "startTime": "2018-12-29T08:00:00.000-07:00"
  }
}

function insertSpacesBeforeCaps(text) {
  return text[0] + text.substr(1).replace(/([A-Z])/g, ' $1')
}

class ExploreConfirms extends Component {

  constructor (props) {
    super(props)

    attendedClaim.event.startTime = DateTime.local().startOf("hour").toISO()

    var subject = 'did:uport:2oze6gbJDBVsvvBpzghEhCJsWMazvKmwUCD'
    var claim = attendedClaim
    if (uportConnect.did) {
      subject = uportConnect.did
      claim.agent.did = uportConnect.did
    }

    this.state = {
      claim: claim,
      claims: [],
      confirmations: [],
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
          var claimInside = JSON.parse(atob(d.claimEncoded))
          if (d.claimType === 'Confirmation') {
            claimInside = JSON.parse(atob(claimInside.claimEncoded))
            confirmations.push(d)
          } else {
            claims.push(d)
          }
          d.claim = claimInside
        }
        this.setState({ claims: claims, confirmations: confirmations })
      })
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Explore Confirmations</h4>
        <SubText>Browse network of confirmations by identites</SubText>
        <h3>Claim</h3>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <JSONWrapper>
          <JSONInput
            id='request'
            placeholder={ this.state.claim }
            viewOnly='true'
            confirmGood=''
            height='300px'
            width='550px'
            onChange={(value) => {
              if (value.jsObject !== undefined) {
                this.setState({claim: value.jsObject})
              }
            }}
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
                   <li key={jwt.id}>
                     {insertSpacesBeforeCaps(jwt.claimType)}
                     <ul>
                       <li>{jwt.claim.event.organizer.name}</li>
                       <li>{jwt.claim.event.name}</li>
                       <li>{jwt.claim.event.startTime}</li>
                     </ul>
                   </li>
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
