// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import { getUserToken } from '../utilities/claimsTest'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'
import JSONInput from 'react-json-editor-ajrm'

const WelcomeWrap = styled.section``
const SubText = styled.p`
  margin: 0 auto 3em auto;
  font-size: 18px;
`
const ChoiceButton = styled.button``
const JSONWrapper = styled.div`
font-family: monospace !important
`

class ReportClaims extends Component {

  constructor (props) {
    super(props)
    this.state = {
      queryValue: "",
      searchResults: ""
    }
  }

  updateQueryValue(evt) {
    this.setState({
      queryValue: evt.target.value
    })
  }

  doSearch(text) {
    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + `/api/claim?claimContents=${this.state.queryValue}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.propsn)
      }})
      .then(response => response.json())
      .then(data => {
        this.setState({searchResults:data})
      })
  }

  render () {

    return (
      <WelcomeWrap>
        <h4>Search Your Network</h4>
        <SubText>See who in your network has a claim or can introduce you.</SubText>

        <div>
        <input type='text' onChange={this.updateQueryValue.bind(this)}/>
        <ChoiceButton onClick={() => this.doSearch(this.state.queryValue)}>Search</ChoiceButton>
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
