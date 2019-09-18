// Frameworks
import React from 'react'
import JSONInput from 'react-json-editor-ajrm'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import R from 'ramda'
import styled from 'styled-components'

import ErrorHandlingComponent from '../ErrorHandlingComponent'
import * as AppActions from '../../actions/AppActions'
import { uportConnect } from '../../utilities/uportSetup'

const WelcomeWrap = styled.section``
const CodeStyle = styled.div`
  font-family: monospace !important
`
const SignButton = styled.button`
background-color: #4C8F50;
`

const CANDIDATES = [
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "candidate": "Jay Butler",
    "actionOption": "Astronomy for Non-Scientists",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night"},
        "startTime": "2019-10-09T19:00:00.000-06:00"
      }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "candidate": "Bruce Jeppsen",
    "actionOption": "How to Listen to Your Intuition",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night"},
        "startTime": "2019-10-09T19:00:00.000-06:00"
      }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "candidate": "Judd Arnold",
    "actionOption": "Martial Arts",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night"},
        "startTime": "2019-10-09T19:00:00.000-06:00"
      }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "candidate": "Brandon McKean",
    "actionOption": "Building Confidence, Especially in Kids",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night"},
        "startTime": "2019-10-09T19:00:00.000-06:00"
      }
  }
]

class VoteIgniteSpeakers extends ErrorHandlingComponent {

  constructor (props) {
    super(props)
    this.state = {
      votes: []
    }
    this.addRemoveVote = this.addRemoveVote.bind(this)
    this.signClaim = this.signClaim.bind(this)
  }

  addRemoveVote (item) {
    let i = R.indexOf(item, this.state.votes)
    var newArray
    if (i === -1) {
      newArray = R.append(item, this.state.votes)
    } else {
      newArray = R.remove(i, 1, this.state.votes)
    }
    this.setState({ votes: newArray })
  }

  signClaim () {
    this.setState({responseJWT: ''})
    let claimToSign = this.state.votes
    uportConnect.requestVerificationSignature(claimToSign, uportConnect.did, 'SignRequest')
  }

  render () {
    return (
      <WelcomeWrap>

        <h3>Vote for Ignite Bountiful Speakers</h3>

        <div style={{textAlign: 'left', marginRight: '20px'}}>
      {
        R.map(item =>
          <div key={item.candidate + ' - "' + item.actionOption + '"'}>
              <input type="checkbox" onClick={() => {this.addRemoveVote(item)}}/>{item.candidate} - "{item.actionOption}"<br/>
          </div>
        )(CANDIDATES)
      }
        </div>

        <br/>
        <br/>
        <br/>

        <div style={{textAlign: 'center'}}>
        <SignButton onClick={this.signClaim}>
          Sign Vote
        </SignButton>
        </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>

        <div>
        <CodeStyle>
          <JSONInput
            id='request'
            placeholder={ this.state.votes }
            height='400px'
            width='590px'
            onChange={(value) => {
              if (value.jsObject !== undefined) {
                this.setState({votes: value.jsObject})
              }
            }}
            style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            locale='en'
          />
        </CodeStyle>
        </div>
      </WelcomeWrap>
    )
  }
}

const mapStateToProps = (state, props) => {
  return {
    uport: state.App.uport,
  }
}
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(AppActions, dispatch) }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(VoteIgniteSpeakers))
