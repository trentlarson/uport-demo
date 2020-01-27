// Frameworks
import { verifyJWT } from 'did-jwt'
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

import ErrorHandlingComponent from './ErrorHandlingComponent'
import * as AppActions from '../actions/AppActions'
import { claimDescription } from '../utilities/claims'
import { getUserDid, getUserToken } from '../utilities/claimsTest'
import { uportConnect } from '../utilities/uportSetup'



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
  text-decoration: underline;
`
const SignLink = styled.a`
  color: #AAAAFF;
  text-decoration: underline;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`




// 40.883944,-111.884787 is southwest corner of Corner Bakery
const DEFAULT_GEO_SHAPE = "40.883944,-111.884787 40.884088,-111.884787 40.884088,-111.884515 40.883944,-111.884515 40.883944,-111.884787"

const DEFAULT_ORG_NAME = "Bountiful Voluntaryist Community"
const DEFAULT_EVENT_NAME = "Saturday Morning Meeting"
const DEFAULT_ROLE_NAME = "Secretary"

const THIS_YEAR_START_DATE_STRING = DateTime.local().startOf('year').toISODate()
const THIS_YEAR_END_DATE_STRING = DateTime.local().endOf('year').toISODate()

function confirmClaim(claims) {
  return {
    "@context": "http://endorser.ch",
    "@type": "Confirmation",
    "originalClaims": claims
  }
}

function imgPerConfirm(num) {
  var result = []
  for (var i = 0; i < num; i++) {
    result.push(<img src="/green-check.png" key={i} alt="selected"/>)
  }
  return result
}

class SignClaim extends ErrorHandlingComponent {

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
      responseJWT: '',
      responseJSON: null,
      unsignedClaim: this.defaultClaim(props),
    }
    this.signClaim = this.signClaim.bind(this)
    this.handleSignedClaim = this.handleSignedClaim.bind(this)

    uportConnect.onResponse(SignReqID)
      .then(this.handleSignedClaim)
      .catch(error => {
        console.log("Failed to handle signed claim with error:", error)
        this.setState({claimStoredError: "Some error happened.  Try reloading the page and signing again.", loadingClaimStoreResponse: false, responseJWT: error})
      })

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
      eventStartDate = bvolTime.set({weekday:6}).set({hour:8}).startOf("hour").toISO()
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

  orgRoleClaim(agentDid, orgName, roleName, startDate, endDate) {
    if (!orgName) {
      orgName = DEFAULT_ORG_NAME
    }
    if (!roleName) {
      roleName = DEFAULT_ROLE_NAME
    }
    if (!startDate) {
      startDate = THIS_YEAR_START_DATE_STRING
    }
    if (!endDate) {
      endDate = THIS_YEAR_END_DATE_STRING
    }
    agentDid = getUserDid() || agentDid
    if (!agentDid) {
      agentDid = uportConnect.did
    }
    let result = {
      "@context": "http://schema.org",
      "@type": "Organization",
      name: orgName,
      member: {
        "@type": "OrganizationRole",
        member: {
          "@type": "Person",
          identifier: agentDid,
        },
        roleName: roleName,
        startDate: startDate,
        endDate: endDate,
      }
    }
    return result
  }

  getSubject(claim) {
    var subject
    switch (claim['@type']) {
      case 'JoinAction': subject = claim.agent && claim.agent.did; break;
      case 'Organization': subject = claim.member && claim.member.member && claim.member.member.identifier; break;
      case 'Tenure': subject = claim.party && claim.party.did; break;
      case 'Confirmation':
        var subjects = R.uniq(R.map(this.getSubject)(claim.originalClaims))
        if (subjects.length === 1) {
          subject = subjects[0]
        }
        break;
      default:
    }
    return subject
  }

  ownershipClaim(agentDid, polygon) {
    if (!polygon) {
      polygon = DEFAULT_GEO_SHAPE
    }
    let result = {
      "@context": "http://endorser.ch",
      "@type": "Tenure",
      "spatialUnit": {
        "geo": {
          "@type": "GeoShape",
          "polygon": polygon
        }
      }
    }
    // These settings are a bit different because it's possible that they give no owner ID.
    if (getUserDid()) {
      result.party = { "did": getUserDid() }
    } else if (agentDid) {
      result.party = { "did": agentDid }
    } else if (uportConnect.did) {
      result.party = { "did": uportConnect.did }
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


    fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim/?issuedAt_greaterThanOrEqualTo=' + loadMoreStartingStr + "&issuedAt_lessThan=" + loadMoreEndingStr + "&excludeConfirmations=true", {
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
      // somehow, the claim gets lost after it's signed and we get no resolution message
      window.alert("Please reload the page to submit another claim or confirmation.")
    } else {
      console.log("Sending claim to be signed...")
      this.setState({claimStoredError: '', claimStoredSuccess: '', loadingClaimStoreResponse: true, responseJWT: ''})
      let claimToSign = this.state.unsignedClaim
      var subject = this.getSubject(claimToSign) || ''
      uportConnect.requestVerificationSignature(claimToSign, subject, SignReqID)
    }
  }

  handleSignedClaim(res) {
    console.log("Successfully received signed claim.  Now will verify it...")
    console.log(res) // format: { id: "SignRequest", payload: "[JWT]...", data: undefined }

    this.setState({
      responseJWT: res.payload,
      responseJSON: null
    })

    verifyJWT(res.payload)
    .then(json => {
      console.log("Successfully verified signed claim.  Now will record it...")

      // json format: https://github.com/uport-project/did-jwt/blob/288b8a57b44706036ad440c1e0ea7dde06365810/src/JWT.js#L103
      // { "payload":{"iat":1547430185,"exp":1547516585,"sub":"did:ethr:...","claim":{...},"iss":"did:ethr:..."},
      //   "doc":{"@context":"https://w3id.org/did/v1","id":"did:ethr:...","publicKey":[{"id":"did:ethr:...#owner","type":"Secp256k1VerificationKey2018","owner":"did:ethr:...","ethereumAddress":"..."}],"authentication":[{"type":"Secp256k1SignatureAuthentication2018","publicKey":"did:ethr:...#owner"}]},
      //    "issuer":"did:ethr:...",
      //    "signer":{"id":"did:ethr:...#owner","type":"Secp256k1VerificationKey2018","owner":"did:ethr:...","ethereumAddress":"..."},"jwt":"..."}
      //console.log('json', JSON.stringify(json))

      this.setState({
        responseJSON: json.payload
      })
      fetch('http://' + process.env.REACT_APP_ENDORSER_CH_HOST_PORT + '/api/claim', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Uport-Push-Token": getUserToken(this.props)
        },
        body: JSON.stringify({jwtEncoded:res.payload})})
        .then(this.alertOrReturnJson("saving signed claim"))
        .then(data => {
          console.log("Successfully finished recording signed claim.")
          this.setState({ claimStoredSuccess: "Success!  Your claim is saved with ID " + data, loadingClaimStoreResponse: false })
        })
        .catch(err => {
          console.log("Failed to fully record signed claim.")
          this.setState({ claimStoredError: "Some error happened.  Try reloading the page and signing again.", loadingClaimStoreResponse: false })
        })
    })
    .catch(message => {
      console.log("Failed to handle signed claim with error '" + message + "' for signed-claim response:", res)
      this.setState({ claimStoredError: "Some error happened.  Try reloading the page and signing again.", loadingClaimStoreResponse: false })
      window.alert(message)
    })

  }

  moveJwtClaimToUnsigned(jwt) {
    // add this claim to the confirmation
    // (Weird: without this clone it doesn't update in the setState, even though it does inside the old "fetch")
    var oldUnsigned = this.state.unsignedClaim
    this.setState({ unsignedClaim: {} })
    var newConfirm = JSON.parse(JSON.stringify(oldUnsigned))
    newConfirm.originalClaims.push(jwt.claim)

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
              this.state.unsignedClaim.originalClaims
              ?
                <ClaimButton onClick={() => this.moveJwtClaimToUnsigned(jwt) }>
                  {jwt.claimType}<br/>
                  {claimDescription(jwt.claim)}
                </ClaimButton>
              :
                // whenever there is no "Confirmation" type loaded in the unsignedClam Claim Details (though that shouldn't happen)
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
      {
        (this.state.unsignedClaim.originalClaims)
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

    return (
        <WelcomeWrap>
        <h4>Claim to Sign</h4>
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

        <h3>Sample Claims</h3>


        {/* Attendance */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.joinActionClaim()})
        }}
        defaultChecked={this.state.unsignedClaim && this.state.unsignedClaim['@type'] && this.state.unsignedClaim['@type'] === 'JoinAction'}
        /> Set to Join Action
        <br/>

        {/* Org Role */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.orgRoleClaim()})
        }}/> Set to Organization Role
        <br/>


        {/* Land Tenure */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: this.ownershipClaim()})
        }}/> Set to Plot Ownership
        <br/>


        {/* Confirmations */}
        <input type="radio" name="claimType" onClick={()=>{
          this.setState({unsignedClaim: null})
          this.setState({unsignedClaim: confirmClaim([]), jwtsToConfirm: [], loadedConfirmsStarting: null},
                        () => this.loadMoreJwts())
        }}/> Set to Confirmation...

        <span>{
          this.state.unsignedClaim['@type'] === 'Confirmation'
            ? imgPerConfirm(this.state.unsignedClaim.originalClaims.length)
            : ""
        }</span>
        <br/>
        <br/>

          <div>{confirmClaimButtons}</div>

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
          Here is a link to this claim, useful for sharing.
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignClaim))
