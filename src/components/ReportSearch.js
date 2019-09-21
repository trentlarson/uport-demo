// Frameworks
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import { getUserToken } from '../utilities/claimsTest'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import JSONInput from 'react-json-editor-ajrm'

// currently just for the dynamic code for processing results
import R from 'ramda'

import ErrorHandlingComponent from './ErrorHandlingComponent'

const WelcomeWrap = styled.section``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const ChoiceButton = styled.button``
const JSONWrapper = styled.div`
font-family: monospace !important;
display: inline-block;
`

// This is for convenience in the processCode actions.
window.R = R

class ReportClaims extends ErrorHandlingComponent {

  constructor (props) {
    super(props)
    this.state = {
      queryValue: "",
      endpointValue: "",
      searchResults: {},
      processCode: `searchResults.map((obj) => obj.id)`,
      processed: {}
    }
  }

  updateQueryValue(evt) {
    this.setState({queryValue: evt.target.value})
  }

  updateEndpointValue(evt) {
    this.setState({endpointValue: evt.target.value})
  }

  updateProcessCode(evt) {
    this.setState({processCode: evt.target.value})
  }

  doSearch(text) {
    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + `/api/claim?claimContents=${this.state.queryValue}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(this.alertOrReturnJson("claim search"))
      .then(data => {
        this.setState({searchResults:data})
        window.searchResults = data
      })
  }

  doEndpointCall(endpoint) {
    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + endpoint, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(this.alertOrReturnJson("endpoint call to " + endpoint))
      .then(data => {
        this.setState({searchResults:data})
        window.searchResults = data
      })
  }

  processResults() {
    // Because we don't need to see warnings about eval:
    // eslint-disable-next-line
    return eval(this.state.processCode)
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Search Your Network</h4>
        <SubText>See who in your network has a claim or can introduce you.</SubText>

        <div>
        <input type='text' onChange={this.updateQueryValue.bind(this)}/>
        <ChoiceButton onClick={() => this.doSearch(this.state.queryValue)}>Text Search</ChoiceButton>
        </div>

        <br/>
        <JSONWrapper>
        <JSONInput
          id='result'
          placeholder={ this.state.searchResults }
          height='400px'
          width='590px'
          style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
          locale='en'
        />
        </JSONWrapper>

        <br/>
        <br/>

        <div>
        <input type='text' defaultValue='/api/report/orgRoleClaimsAndConfirmationsOnDate?orgName=&roleName=&onDate='onChange={this.updateEndpointValue.bind(this)}/>
        <ChoiceButton onClick={() => this.doEndpointCall(this.state.endpointValue)}>Call Endpoint</ChoiceButton>
        </div>

        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <ChoiceButton onClick={() => this.setState({processed:this.processResults()})}>Manipulate</ChoiceButton>

        <div>
        <textarea cols='80' rows='5' defaultValue={ this.state.processCode } onChange={this.updateProcessCode.bind(this)}></textarea>
        </div>

        <div>
        <JSONWrapper>
        <JSONInput
          id='processed'
          placeholder={ this.state.processed }
          height='400px'
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportClaims))
