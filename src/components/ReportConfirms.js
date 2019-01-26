// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { firstAndLast3 } from '../utilities/claims.js'
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

function truncAddrFromDid(did) {
  return firstAndLast3(did.split(":")[2].substring(2))
}

/**
 props: eventId
 */
class EventDetails extends Component {
  constructor(props) {
    super(props)
    // acac = actionClaimAndConfirmations
    this.state = { event:props.event, acacList:null }
  }
  render() {
    return <div>
      <ChoiceButton
        onClick={() => {
          this.props.onChoice(this.state.event)
          let url = 'http://localhost:3000/api/event/' + this.state.event.id + '/actionClaimsAndConfirmations'
          fetch(url, {
            headers: {
              "Content-Type": "application/json"
            }})
            .then(response => response.json())
            .then(acacList => {
              this.setState({ acacList: acacList })
            })
        }}
      >{this.state.event.name}</ChoiceButton>
      <ul>
        <li>{this.state.event.orgName}</li>
        <li>{this.state.event.startTime}</li>
        <li>
          <ul>
      {this.state.acacList && this.state.acacList.map(
        acac =>
          <li key={acac.action.id}>{truncAddrFromDid(acac.action.agentDid)} went
            <ul>
            <li>
              <ul><li>Agreed by {acac.confirmations.length}</li></ul>
            </li>
            </ul>
          </li>
        )
      }
          </ul>
        </li>
      </ul>
      </div>
  }
}

class Reports extends Component {

  constructor (props) {
    super(props)

    this.setEventPayload = this.setEventPayload.bind(this)

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

  setEventPayload(claimedEvent) {
    this.setState({event:claimedEvent})
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
                   return <EventDetails key={event.id} event={event} onChoice={this.setEventPayload} />
                 }
                )
        }

        <h3>Details</h3>
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
