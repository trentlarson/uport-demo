// Frameworks
import { decodeJWT, verifyJWT } from 'did-jwt'
import { DateTime, Duration } from 'luxon'
import R from 'ramda'
import React from 'react'
import JSONInput from 'react-json-editor-ajrm'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { HashLoader } from 'react-spinners'
import { bindActionCreators } from 'redux'
import qs from 'qs'
import styled from 'styled-components'
import util from 'util'

import ErrorHandlingComponent from '../ErrorHandlingComponent'
import * as AppActions from '../../actions/AppActions'
import { claimDescription, isHiddenDid } from '../../utilities/claims'
import { getUserDid, getUserToken } from '../../utilities/claimsTest'
import { uportConnect } from '../../utilities/uportSetup'



const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``

const JSONWrapper = styled.div`
  font-family: monospace !important
`
const ConnectUport = styled.button`
  background-color: #4C8F50;
`
const MoreLink = styled.a`
  color: #AAAAFF;
`
const SignLink = styled.a`
  color: #AAAAFF;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`




const DEFAULT_ORG_NAME = "Bountiful Voluntaryist Community"
const DEFAULT_EVENT_NAME = "Saturday Morning Meeting"

class AttendedSaturdayMeeting extends ErrorHandlingComponent {

  constructor (props) {
    super(props)
    this.state = {
      claimStoredError: '',
      claimStoredSuccess: '',
      jwtsToConfirm: [], // from JWTs in DB
      loadedConfirmsStarting: null,
      loadingClaimStoreResponse: false,
      loadingConfirmations: false,
      loadingMoreConfirmations: false,
      progressLog: [],
      responseJWT: '',
      responseJSON: null,
      unsignedClaim: this.defaultClaim(props),
    }
    this.signClaim = this.signClaim.bind(this)
    this.handleSignedClaim = this.handleSignedClaim.bind(this)

    uportConnect.onResponse(SignReqID)
      .then(this.handleSignedClaim)
      .catch(error => {
        this.logMessage("Failed to handle signed claim with error:")
        this.logMessage(error)
        this.setState({claimStoredError: "Some error happened.  Try reloading the page and signing again.", loadingClaimStoreResponse: false, responseJWT: error})
      })

  }

  logMessage(messageObj) {
    console.log(messageObj)
    // ... plus, for times we're on mobile:
    this.setState({progressLog: R.append(messageObj, this.state.progressLog)})
  }

  defaultClaim(props) {
    var claim = null
    if (props.location.search) {
      // these are the request query parameters
      var params = qs.parse(props.location.search, {ignoreQueryPrefix:true})
      if (params && params.claim) {
        try {
          claim = JSON.parse(params.claim)
        } catch (e) {
          throw new Error("Couldn't parse the 'claim' parameter as JSON. " + e)
        }
      }
    }
    return claim || this.joinActionClaim()
  }

  // Note that the default values cause the did-jwt library to fails when verifying a confirmation of that length, so we've changed the eventStartDate to an ISO date string without milliseconds to hack around it.
  joinActionClaim(eventOrgName, eventName, eventStartDate, agentDid) {
    if (!eventOrgName) {
      eventOrgName = DEFAULT_ORG_NAME
    }
    if (!eventName) {
      eventName = DEFAULT_EVENT_NAME
    }
    if (!eventStartDate) {
      var bvolTime = DateTime.local()
      if (bvolTime.weekday < 6) {
        // it's not Saturday, so let's default to last Saturday
        bvolTime = bvolTime.minus({week:1})
      }
      let eventStartDateObj = bvolTime.set({weekday:6}).set({hour:9}).startOf("hour")
      // Hack, but the full ISO pushes the length to 340 which crashes verifyJWT!  Crazy!
      eventStartDate = eventStartDateObj.toISO({suppressMilliseconds:true})
    }
    agentDid = getUserDid() || agentDid
    if (!agentDid) {
      agentDid = uportConnect.did
    }
    return {
      "@context": "http://schema.org",
      "@type": "JoinAction",
      // note that there is constructor code below that sets "did" inside "agent"
      "agent": { "did": agentDid },
      "event": {
        "organizer": { "name": eventOrgName },
        "name": eventName,
        "startTime": eventStartDate
      }
    }
  }

  confirmationSubject(claim) {
    var subjects = R.uniq(R.map(this.getSubject)(claim.object))
    // some people sign hidden DIDs; let's just ignore them
    subjects = R.reject(isHiddenDid, subjects)
    if (subjects.length === 0) {
      // Weird... there's either no claim or they're all hidden DIDs.
      return null
    } else if (subjects.length === 1) {
      return subjects[0]
    } else {
      return "MULTIPLE"
    }
  }

  /**
   @return either a single DID subject or MULTIPLE if many or UNKNOWN if none
   **/
  getSubject(claim) {
    // Now the "sub" is required.
    // https://github.com/uport-project/uport-connect/blob/v1.1.11/src/Connect.js#L332
    var subject = "UNKNOWN"
    switch (claim['@type']) {
      case 'AgreeAction': subject = this.confirmationSubject(claim) || subject; break;
      case 'JoinAction': subject = claim.agent && claim.agent.did; break;
      case 'Organization': subject = claim.member && claim.member.member && claim.member.member.identifier; break;
      case 'Tenure': subject = claim.party && claim.party.did; break;
      default:
    }
    if (subject === null) {
      subject = "UNKNOWN"
    }
    return subject
  }

  domicileClaim(agentDid) {
    let result = {
      "@context": "http://schema.org",
      "@type": "Person",
      "homeLocation": {
        name: "Bountiful",
        containedInPlace: {
          name: "Utah"
        }
      }
    }
    // These settings are a bit different because it's possible that they give no user ID.
    if (getUserDid()) {
      result.identifier = { "did": getUserDid() }
    } else if (agentDid) {
      result.identifier = { "did": agentDid }
    } else if (uportConnect.did) {
      result.identifier = { "did": uportConnect.did }
    }
    return result
  }

  componentDidMount() {
  }

  loadMoreJwts() {
    this.setState({loadingConfirmations: true})

    var loadMoreEnding, loadMoreStarting
    if (!this.state.loadedConfirmsStarting) {
      loadMoreEnding = DateTime.local()
      loadMoreStarting = DateTime.local().startOf("day")
    } else {
      loadMoreEnding = this.state.loadedConfirmsStarting
      loadMoreStarting = this.state.loadedConfirmsStarting.minus(Duration.fromISO("P1M")) // - 1 month
    }
    let loadMoreEndingStr = loadMoreEnding.toISO()
    let loadMoreStartingStr = loadMoreStarting.toISO()


    fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim/?issuedAt_greaterThanOrEqualTo=' + loadMoreStartingStr + "&issuedAt_lessThan=" + loadMoreEndingStr + "&excludeConfirmations=true", {
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      }})
      .then(response => response.json())
      .then(data => {
        let newClaims = R.concat(this.state.jwtsToConfirm, data)
        this.setState({ jwtsToConfirm: newClaims, loadedConfirmsStarting: loadMoreStarting, loadingConfirmations: false  })
      })
  }

  signClaim() {
    if (this.state.claimStoredSuccess || this.state.claimStoredError) {
      // somehow a second claim gets lost after it's signed and we get no resolution message
      window.alert("Please reload the page to submit another claim or confirmation.")
    } else {
      this.logMessage("Sending claim to be signed...")
      this.setState({claimStoredError: '', claimStoredSuccess: '', loadingClaimStoreResponse: true, responseJWT: ''})
      let claimToSign = this.state.unsignedClaim
      var subject = this.getSubject(claimToSign)
      uportConnect.requestVerificationSignature(claimToSign, {sub:subject}, SignReqID)
    }
  }

  handleSignedClaim(res) {
    this.logMessage("Successfully received signed claim.  Now will verify it...")
    this.logMessage(res) // format: { id: "SignRequest", payload: "[JWT]...", data: undefined }

    // format: {header:..., payload:..., signature:... data:...}
    let decoded = decodeJWT(res.payload)

    this.setState({
      responseJWT: res.payload,
      responseJSON: decoded.payload
    })

    verifyJWT(res.payload)
    .then(json => {
      this.logMessage("Successfully verified signed claim.  Now will record it...")

      // json format: https://github.com/decentralized-identity/did-jwt/blob/v0.1.3/src/JWT.js#L103
      // { "payload":{"iat":1547430185,"exp":1547516585,"sub":"did:ethr:...","claim":{...},"iss":"did:ethr:..."},
      //   "doc":{"@context":"https://w3id.org/did/v1","id":"did:ethr:...","publicKey":[{"id":"did:ethr:...#owner","type":"Secp256k1VerificationKey2018","owner":"did:ethr:...","ethereumAddress":"..."}],"authentication":[{"type":"Secp256k1SignatureAuthentication2018","publicKey":"did:ethr:...#owner"}]},
      //    "issuer":"did:ethr:...",
      //    "signer":{"id":"did:ethr:...#owner","type":"Secp256k1VerificationKey2018","owner":"did:ethr:...","ethereumAddress":"..."},"jwt":"..."}
      //this.logMessage('Result json: ' + JSON.stringify(json))

      fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": getUserToken(this.props)
        },
        body: JSON.stringify({jwtEncoded:res.payload})})
        .then(this.alertOrReturnJson("saving signed claim"))
        .then(data => {
          this.logMessage("Successfully finished recording signed claim.")
          this.setState({ claimStoredSuccess: "Success!  Your claim is saved with ID " + data, loadingClaimStoreResponse: false })
        })
        .catch(err => {
          this.logMessage("Failed to fully record signed claim:")
          this.logMessage(err)
          this.setState({ claimStoredError: "Some error happened.  Try reloading the page and signing again.", loadingClaimStoreResponse: false })
        })
    })
    .catch(message => {
      this.logMessage("Failed to handle signed claim with error for signed-claim response:" + message)
      this.logMessage(message)
      this.logMessage("Response:")
      this.logMessage(res)
      this.setState({ claimStoredError: "Some error happened.  Try reloading the page and signing again.  Sometimes adding or removing characters from the message (eg. date milliseconds) makes a difference.", loadingClaimStoreResponse: false })
    })

  }

  moveJwtClaimToUnsigned(jwt) {
    // add this claim to the confirmation
    // (Weird: without this clone it doesn't update in the setState, even though it does inside the old "fetch")
    var oldUnsigned = this.state.unsignedClaim
    this.setState({ unsignedClaim: {} })
    var newConfirm = JSON.parse(JSON.stringify(oldUnsigned))
    newConfirm.object.push(jwt.claim)

    // remove this claim from the buttons
    var newClaims = R.reject((remaining)=>remaining.id === jwt.id, this.state.jwtsToConfirm)

    // now set the state
    this.setState({ unsignedClaim: newConfirm, jwtsToConfirm: newClaims })
  }

  render() {

    const confirmClaimButtons = <div>
      {
        R.map(jwt => {
          return <span key={jwt.id}>
            {
              this.state.unsignedClaim.object
              ?
                <ClaimButton onClick={() => this.moveJwtClaimToUnsigned(jwt) }>
                  {jwt.claimType}<br/>
                  {claimDescription(jwt.claim)}
                </ClaimButton>
              :
                // whenever there is no "AgreeAction" type loaded in the unsignedClam Claim Details (though that shouldn't happen)
                ""
            }
            </span>
        },
        this.state.jwtsToConfirm
        )
      }
      {
        <HashLoader
          color={'#FF0000'}
          loading={this.state.loadingConfirmations}
          size={30}
          sizeUnit={"px"}
        />
      }
      <br/>
      {
        (this.state.unsignedClaim.object)
          ?
            <MoreLink href="#" onClick={()=>this.loadMoreJwts()}>
              Load Previous to {this.state.loadedConfirmsStarting ? this.state.loadedConfirmsStarting.toISODate() : "today"}
            </MoreLink>
          :
          <span/>
      }
      {
        <HashLoader
          color={'#FF0000'}
          loading={this.state.loadingMoreConfirmations}
          size={30}
          sizeUnit={"px"}
        />
      }
    </div>

    console.log("this.props.uport",this.props.uport)
    /**/
    fetch(process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/report/whichDidsICanSee', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Uport-Push-Token": getUserToken(this.props)
      },
      })
      .then(data => data.json())
      .then(dataText => {
        console.log("data from report/whichDidsICanSee",dataText)
      })
      .catch(err => {
        this.logMessage(err)
      })
      /**/

    return (
        <WelcomeWrap>
        <h4>Attended {this.state.unsignedClaim.event.startTime.substring(5, 10).replace('-', '/')}</h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
        <div style={{marginRight: '20px'}}>

        <div>
          {/** The ClipLoader shows on the right without any CSS setting but the HashLoader doesn't. Weird. **/}
          <HashLoader
            color={'#FF0000'}
            loading={this.state.loadingClaimStoreResponse}
            size={30}
            sizeUnit={"px"}
          />
          <span style={{'color':'#66FF00'}}>{this.state.claimStoredSuccess}</span>
          <span style={{'color':'#FF6600'}}>{this.state.claimStoredError}</span>
        </div>

      {
        this.props.uport && this.props.uport.name
          ?

        (<div>

          <div style={{textAlign: 'center'}}>
            <ConnectUport onClick={this.signClaim}>
              Sign Claim
            </ConnectUport>
          </div>

          <br/>
          <br/>
          <br/>

          <h3>Claim Details</h3>

          <JSONWrapper>
            <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='400px'
                width='590px'
                onChange={(value) => {
                  if (value.jsObject !== undefined) {
                    this.setState({unsignedClaim: value.jsObject})
                  }
                }}
                style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
             locale='en'
            />
          </JSONWrapper>

          <SignLink href={"/signClaim?claim=" + encodeURIComponent(JSON.stringify(this.state.unsignedClaim))}>
          Here is a link to this claim (useful for sharing).
          </SignLink>



         </div>
        )

        :
          <div>
          <Link to="/">Click here to sign in first.</Link>
          </div>
      }

        </div>

        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>
        <div><br/></div>

        <div>
           <h3>Response (JWT)</h3>
           <input type='text' style={{width: '590px'}} defaultValue={this.state.responseJWT}/>
           <h3>Signed Claim Response (Parsed JWT)</h3>
           <JSONWrapper>
           <JSONInput
                id='response'
                placeholder={ this.state.responseJSON }
                height='320px'
                width='590px'
                viewOnly
                style={{body: {'fontSize': '10pt', textAlign: 'left'}}}
                locale='en'
           />
           </JSONWrapper>
           <ul>
            { this.state.progressLog.length === 0 ? "" : "Progress Log" }
            { this.state.progressLog.map((val, idx) => {
              return <li key={idx}>{val.toString()}<br/>
                Inspected: {util.inspect(val, {depth: null})}
              </li>
            })}
           </ul>
        </div>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AttendedSaturdayMeeting))
