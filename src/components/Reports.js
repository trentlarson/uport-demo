// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
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

class Reports extends Component {

  constructor (props) {
    super(props)

    var subject = 'INVALID DID... ARE YOU NOT LOGGED IN?'
    if (uportConnect.did) {
      subject = uportConnect.did
    }

    this.state = {
      event: {},
      events: [],
      subject: subject
    }
  }

  componentDidMount() {
    fetch('http://localhost:3000/api/event', {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(events => {
        this.setState({ events: events })
      })
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Event Reports</h4>
        <SubText>See stats on recent events</SubText>
        <h3>Recent Events</h3>
        {
          this.state
            .events
            .map(event =>
                 {
                   return <div key={event.id}>
                     <ChoiceButton key={event.id+"_button"} onClick={() => { this.setState({event:event}) }}>{event.name}</ChoiceButton>
                     <ul>
                       <li>{event.orgName}</li>
                       <li>{event.name}</li>
                       <li>{event.startTime}</li>
                     </ul>
                   </div>
                 }
                )
        }

        <h3>Claim</h3>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <JSONWrapper>
          <JSONInput
            id='request'
            placeholder={ this.state.event }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reports))
