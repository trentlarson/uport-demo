import { decodeJWT, verifyJWT } from 'did-jwt'
import React, { Component } from 'react'

export default class ParseContactJwt extends Component {

  constructor (props) {
    super(props)

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)

    let jwt = urlParams.get('jwt')
    let jwtMessage = 'There is no JWT parameter.'
    let decodeMessage = 'There is no JWT parameter.'
    let decoded = null

    if (jwt) {
      jwtMessage = 'JWT contents are: ' + JSON.stringify(jwt)
      try {
        decoded = decodeJWT(jwt)
        decodeMessage = 'The payload is: ' + JSON.stringify(decoded.payload)
      } catch (e) {
        decodeMessage = 'Got this error decoding the JWT: ' + e
      }
    }

    this.state = {
      decodeMessage: decodeMessage,
      decodeResult: decoded,
      jwt: jwt,
      jwtMessage: jwtMessage,
      verifyMessage: 'Unable to verify the JWT.',
      verifyResult: null,
    }
  }

  async componentDidMount() {
    try {
      const verified = await verifyJWT(this.state.jwt)
      const verifyMessage = 'The result of verification is: ' + JSON.stringify(verified)
      this.setState({ verifyMessage: verifyMessage, verifyResult: verified })
    } catch (e) {
      this.setState({ verifyMessage: 'Got an error verifying the JWT: ' + e })
    }
  }

  render = () => {

    return (
      <div>
      <h1>Contact Info</h1>
        This is only for informational purposes. This URL is meant to be used in the app to import a new contact.
        <br />
        <br />
        { this.state.decodeMessage }
        <br />
        <br />
        {
          /** not showing because it's always an error
          this.state.verifyMessage
          **/
        }
        <br />
        <br />
        {
          /** not showing because it's not really helpful
          this.state.jwtMessage
          **/
        }
      </div>
    )
  }
}

