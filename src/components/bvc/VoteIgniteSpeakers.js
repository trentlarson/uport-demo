// Frameworks
import React from 'react'
import JSONInput from 'react-json-editor-ajrm'
import { connect } from 'react-redux'
import { HashLoader } from 'react-spinners'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import R from 'ramda'
import styled from 'styled-components'
import { verifyJWT } from 'did-jwt'

import ErrorHandlingComponent from '../ErrorHandlingComponent'
import * as AppActions from '../../actions/AppActions'
import { getUserToken } from '../../utilities/claimsTest'
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
    "actionOption": "A Motorcycle, A Crash, and Discovering A Long Road to Forgiveness",
    "candidate": "Trent Larson",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "Alternative Medicine",
    "candidate": "Craig St Clair",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "Astronomy for Non-Scientists",
    "candidate": "Jay Butler",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "Emergency Medicine",
    "candidate": "Jess St Clair",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "Estate Planning",
    "candidate": "Larry Mulcock",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "How to Listen to Your Intuition",
    "candidate": "Bruce Jeppsen",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "Martial Arts",
    "candidate": "Judd Arnold",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  },
  {
    "@context": "http://schema.org",
    "@type": "VoteAction",
    "actionOption": "Neurofeedback",
    "candidate": "Larry Mulcock",
    "object": {
      "event": {
        "name": "Ignite Bountiful Night",
        "startDate": "2019-11-13T19:00:00.000-06:00"
      }
    }
  }
]

class VoteIgniteSpeakers extends ErrorHandlingComponent {

  constructor (props) {
    super(props)
    this.state = {
      claimStoredResponse: '',
      loading: false,
      voteCounts: [],
      votes: [],
    }
    this.addRemoveVote = this.addRemoveVote.bind(this)
    this.signClaim = this.signClaim.bind(this)
    this.handleSignedClaim = this.handleSignedClaim.bind(this)

    uportConnect.onResponse('SignRequest')
      .then(this.handleSignedClaim)
      .catch(error => {
        this.setState({responseJWT: error})
      })
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/report/voteCounts', {
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(response => response.json())
      .then(data => this.setState({ voteCounts: data }))
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

  handleSignedClaim(res) {
    //console.log(res) // format: { id: "SignRequest", payload: "...", data: undefined }
    this.setState({loading: true})

    verifyJWT(res.payload).then(json => {
      console.log("Response JWT", res.payload)
      console.log("Response JSON", json.payload)
      fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": getUserToken(this.props)
        },
        body: JSON.stringify({jwtEncoded:res.payload})})
        .then(this.alertOrReturnJson("saving signed claim"))
        .then(data => this.setState({ loading: false, claimStoredResponse: "Success!  Your claim is saved with ID " + data }))
        .catch(err => this.setState({ loading: false }))
    })
    .catch(window.alert)

  }

  render () {
    return (
      <WelcomeWrap>

        <h3>Vote for Ignite Bountiful Speakers</h3>

        <div>
        {/** The ClipLoader shows on the right without any CSS setting but the HashLoader doesn't. Weird. **/}
        <HashLoader
          color={'#FF0000'}
          loading={this.state.loading}
          size={30}
          sizeUnit={"px"}
        />
        <span style={{'color':'#66FF00'}}>{this.state.claimStoredResponse}</span>
        </div>


        <div style={{textAlign: 'left', marginRight: '20px'}}>
      {
        R.map(item =>
          <div key={item.actionOption + ' by "' + item.candidate + '"'}>
              <input type="checkbox" onClick={() => {this.addRemoveVote(item)}}/>"{item.actionOption}" by {item.candidate}<br/>
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
        <ul>Results</ul>
        <table>
        {
          R.map(item =>
                <tr key={item.title + ' by "' + item.speaker + '" for ' + item.count}>
                <td>"{item.title}"</td><td>by {item.speaker}</td><td>{item.count}</td>
                </tr>
               )(this.state.voteCounts)
        }
        </table>
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
