// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import * as AppActions from '../actions/AppActions'
import { firstAndLast3OfDid } from '../utilities/claims'
import { getUserToken } from '../utilities/claimsTest'
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
          let url = process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/event/' + this.state.event.id + '/actionClaimsAndConfirmations'
          fetch(url, {
            headers: {
              "Content-Type": "application/json",
              "Uport-Push-Token": this.props.userToken
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
          <li key={acac.action.id}>{firstAndLast3OfDid(acac.action.agentDid)} went
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

    this.state = {
      event: {},
      events: []
    }
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/event', {
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
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
                   return <EventDetails key={event.id} event={event} onChoice={this.setEventPayload} userToken={getUserToken(this.props)} />
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
            width='590px'
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
