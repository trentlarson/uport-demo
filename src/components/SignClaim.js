// Frameworks
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as AppActions from '../actions/AppActions'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'
import { verifyJWT } from 'did-jwt'
import JSONInput from 'react-json-editor-ajrm'
import { withRouter, Link } from 'react-router-dom'


const SignReqID = 'SignRequest'
const WelcomeWrap = styled.section``

const JSONWrapper = styled.div`
  font-family: monospace !important
`
const ConnectUport = styled.button``
const NextButton = styled.button`
  margin-top: 20px;
`
const ClaimButton = styled.button`
  margin-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 12pt;
  padding: 10px;
`

const simpleClaim = {
  name: 'John'
}

export const complexClaim = {
  names: {
    firstName: 'John',
    lastName: 'Smith'
  },
  location: {
    address: '49 Bogart St #22, Brooklyn',
    state: 'NY',
    zipCode: '11206',
    country: 'US',
    coordinates: {
      lat: '40.7054060',
      lon: '-73.9335480'
    }
  },
  children: [
    {
      firstName: 'Jane',
      lastName: 'Smith',
      address: {
        street: 'Second str. 324-2',
        city: 'London',
        country: 'UK',
      }
    },
    {
      firstName: 'Sam',
      lastName: 'Smith',
      address: {
        street: 'First str. 324-2',
        city: 'Dublin',
        country: 'IR',
      }
    }
  ],
  favouriteColor: 'Blue',
  isBlockChainExpert: true,
  age: 30
}

export const trafficAccidentClaim = {
  generalInfo: {
    accidentDate: '2018-06-12 16:20',
    address: {
      street: 'Main str. 123',
      city: 'Vilnius',
      country: 'LT',
    },
    injuriesEvenIfSlight: false,
  },
  materialDamage: {
    otherThanToVehiclesAAndB: false,
    objectsOtherThanVehicles: false,
  },
  witnesses: [
    {
      name: 'John Smith',
      phoneNumber: '+123242324',
      address: {
        street: 'Second str. 324-2',
        city: 'London',
        country: 'UK',
      }
    },
    {
      name: 'Jane Doe',
      phoneNumber: '+43523234',
      address: {
        street: 'Some av. 43-6',
        city: 'Dublin',
        country: 'IR',
      }
    },
  ],
  vehicleA: {
    policyHolder: {
      nameOrCompanyName: 'Karuzas',
      firstName: 'Simonas',
      personalCodeOrRegNr: '543589343',
      address: {
        postalCode: 'LT-34423',
        street: 'Some str. 554-2',
        city: 'Vilnius',
        country: 'LT',
      },
      phoneNumber: '+37098234423',
      email: 'simonas.karuzas@gmail.com',
    },
    vehicle: {
      make: 'Toyota',
      type: 'RAV4',
      registrationNr: 'ABC123',
      countryOfRegistration: 'LT',
      trailer: false,
    },
    insuranceCompany: {
      country: 'LT',
      name: 'Super Insurance',
      policyNr: '989483',
      greenCardNr: '545423',
      validFrom: '2017-01-01',
      validTo: '2022-01-01',
      agencyOrBroker: 'Your Local Insurance Agent',
      address: 'Real str. 82, Vilnius, Lithuania',
      phoneNumber: '+3704234235',
      email: 'agent@gmail.com',
      doesThePolicyCoverMaterialDamageToTheVehicle: false,
    },
    driver: {
      name: 'Doe',
      firstName: 'John',
      dateOfBirth: '1987-01-05',
      personalCode: '234423423',
      address: 'Third str 3-5, Vilnius',
      country: 'LT',
      phoneNumber: '+370983249234',
      email: 'john.doe@gmail.com',
      drivingLicenseNr: '2324234',
      category: [
        'A',
        'B'
      ],
      validFrom: '2010-01-01',
      validTo: '2022-01-01',
    },
    pointOfInitialImpactToVehicleA: 98,
    visibleDamageToVehicleA: [
      'Right front door',
      'Right rear wheel'
    ],
    additionalDescription: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sit amet ante consequat, feugiat tellus at, fringilla mi. Phasellus egestas, metus sit amet suscipit scelerisque, arcu lorem mollis metus, dignissim gravida nunc velit quis lorem. Phasellus maximus, lorem lobortis cursus molestie, libero lorem venenatis metus, at congue lorem metus quis risus. Vivamus accumsan leo purus, vel mollis lectus mollis vel. Nunc orci nisi, fermentum a lorem non, sodales lobortis lorem. Nullam blandit varius felis in consequat. Vivamus tincidunt viverra mauris, id scelerisque urna tempor auctor. Etiam sed efficitur dolor. Suspendisse pulvinar enim id libero posuere cursus molestie quis purus. Duis at mauris eget augue interdum elementum eget in lacus.',
    circumstances: [
      'Parked',
      'Opening the door'
    ],
    liableForCausingDamage: false,
  },
  vehicleB: {
    policyHolder: {
      nameOrCompanyName: 'Doe',
      firstName: 'Jane',
      personalCodeOrRegNr: '4534534',
      address: {
        postalCode: 'LT-36663',
        street: 'Other str. 555-2',
        city: 'Vilnius',
        country: 'LT',
      },
      phoneNumber: '+37098234423',
      email: 'jane.doe@gmail.com',
    },
    vehicle: {
      make: 'WV',
      type: 'Golf',
      registrationNr: 'KUS934',
      countryOfRegistration: 'LT',
      trailer: false,
    },
    insuranceCompany: {
      country: 'LT',
      name: 'Super Insurance',
      policyNr: '234234234',
      greenCardNr: '543a4',
      validFrom: '2016-01-01',
      validTo: '2023-01-01',
      agencyOrBroker: 'Your Local Insurance Agent',
      address: 'Real str. 82, Vilnius, Lithuania',
      phoneNumber: '+3704234235',
      email: 'agent@gmail.com',
      doesThePolicyCoverMaterialDamageToTheVehicle: true,
    },
    driver: {
      name: 'Doe',
      firstName: 'John',
      dateOfBirth: '1987-01-05',
      personalCode: '234423423',
      address: 'Third str 3-5, Vilnius',
      country: 'LT',
      phoneNumber: '+370983249234',
      email: 'john.doe@gmail.com',
      drivingLicenseNr: '2324234',
      category: [
        'A',
        'B'
      ],
      validFrom: '2010-01-01',
      validTo: '2022-01-01',
    },
    pointOfInitialImpactToVehicleB: 98,
    visibleDamageToVehicleB: [
      'Left front door',
      'Left rear wheel'
    ],
    additionalDescription: 'Etiam sagittis sem elementum tempus tempor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer aliquam libero ac erat mollis, in malesuada urna vestibulum. Nulla fermentum urna ac malesuada tempus. Donec dignissim risus a hendrerit aliquam. Cras ultricies odio a felis maximus, ac sodales ligula lacinia. Cras ullamcorper mi vel arcu vulputate volutpat. Aliquam sagittis interdum enim, id varius libero lobortis in. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Quisque sit amet urna lacinia, ullamcorper urna sit amet, ultrices orci. Aenean eu ex porttitor, tristique tellus nec, tempus purus. Curabitur non urna posuere, tempus turpis nec, ullamcorper nisl. In hendrerit purus et interdum finibus. Praesent feugiat, augue sed fringilla laoreet, quam eros commodo dui, non sodales mi quam ut eros.',
    circumstances: [
      'Entering parking garage',
    ],
    liableForCausingDamage: true,
  },
  sketchOfAccidentWhenImpactOccuredURL: 'https://i.imgur.com/iK0aJJg.jpg'
}

// insert a space in front of any capital letters
function insertSpace(text) {
  return text[0] + text.substr(1).replace(/([A-Z])/g, ' $1')
}

class SignClaim extends Component {

  constructor (props) {
    super(props)
    this.state = {
      responseJWT: null,
      responseJSON: null,
      sub: 'did:uport:2oze6gbJDBVsvvBpzghEhCJsWMazvKmwUCD',
      aud: '',
      unsignedClaim: { name: 'Bob'},
      otherClaimsToSign: []
    }
    this.signClaim = this.signClaim.bind(this)
    this.handleSignedClaim = this.handleSignedClaim.bind(this)

    uportConnect.onResponse(SignReqID)
    .then(this.handleSignedClaim)
    .catch(error => {
      this.setState({responseJWT: error})
    })

  }

  componentDidMount() {
    fetch('http://localhost:3001/api/jwt', {
      headers: {
        "Content-Type": "application/json"
      }})
      .then(response => response.json())
      .then(data => this.setState({ otherClaimsToSign: data }))}

  handleSignedClaim(res) {
    console.log(res)
    verifyJWT(res.payload).then(json => {
      console.log('json', json)
      this.setState({
        responseJWT: res.payload,
        responseJSON: json.payload
      })
    })
    .catch(window.alert)

  }

  signClaim () {
    this.setState({responseJWT: null})
    const unsignedClaim = this.state.unsignedClaim
    const sub = this.state.sub
    uportConnect.requestVerificationSignature(unsignedClaim, sub, SignReqID)
  }

  render () {

    const claimButtons = this.state
          .otherClaimsToSign
          .map(jwt =>
               <ClaimButton key={jwt.id} onClick={() => {
                 this.setState({unsignedClaim: null})
                 this.setState({unsignedClaim: jwt})
               }}>{insertSpace(jwt.claimType)}<br/>{jwt.subject}</ClaimButton>
              )

    return (
      <WelcomeWrap>
        <h4>Sign the following claim: </h4>
        <div style={{display: 'flex', flex: 1, flexDirection: 'row', justifyContent: 'center', textAlign: 'left', marginBottom: '20px'}}>
          <div style={{marginRight: '20px'}}>
          <h3>Subject: </h3>
          <input type='text' style={{width: '500px'}} value={this.state.sub} onChange={(e) => this.setState({sub: e.target.value !== '' ? e.target.value : null})} />
          <h3>Audience: </h3>
          <input type='text' style={{width: '500px'}} value={this.state.aud} onChange={(e) => this.setState({aud: e.target.value !== '' ? e.target.value : null})} />
          <h3>Claim: </h3>
            <JSONWrapper>
            {!this.state.unsignedClaim !== null && <JSONInput
                id='request'
                placeholder={ this.state.unsignedClaim }
                height='300px'
                width='500px'
                onChange={(value) => {
                  if (value.jsObject !== undefined) {
                    this.setState({unsignedClaim: value.jsObject})
                  }
                }}
                style={{body: {'fontSize': '10pt', textAlign: 'left', flex: 1}}}
            />}
            </JSONWrapper>

            <span>{claimButtons}</span><br/>

            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null})
              this.setState({unsignedClaim: simpleClaim})
            }}>Simple</ClaimButton>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null})
              this.setState({unsignedClaim: complexClaim})
            }}>Complex</ClaimButton>
            <ClaimButton onClick={()=>{
              this.setState({unsignedClaim: null})
              this.setState({unsignedClaim: trafficAccidentClaim})
            }}>Too big for QR</ClaimButton>
          </div>
          {this.state.responseJWT && <div >
            <h3>Response JWT: </h3>
            <input type='text' style={{width: '500px'}} value={this.state.responseJWT}/>
            <h3>Parsed JWT: </h3>
            <JSONWrapper>
            <JSONInput
                id='response'
                placeholder={ this.state.responseJSON }
                height='300px'
                width='500px'
                viewOnly
                style={{body: {'fontSize': '10pt', textAlign: 'left'}}}
            />
            </JSONWrapper>
          </div>}
        </div>
        <ConnectUport onClick={this.signClaim}>
          Sign Claim
        </ConnectUport>
        <div>
        <Link to="/transaction">
          <NextButton>
            Next
          </NextButton>
        </Link>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignClaim))
