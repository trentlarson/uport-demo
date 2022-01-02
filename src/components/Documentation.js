import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const TextBody = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  max-width: 80%;
  padding: 20px;
`

// very odd that the default UL is very bold
const NonBoldList = styled.ul`
  font-weight: 100;
`

export default class Documentation extends Component {

  render() {
    return (
        <TextBody>
        <h4>Community Credentials</h4>

        <p>

      We are building human-sovereign networking (where individuals can control their data and their connections) by making it easy to begin and easy to grow capabilities.  This is a set of projects which supports that goal, with the following features:

        </p>

        <NonBoldList>

        <li>
        Easily & verifiably assert & confirm -- ie 'credential' -- facts about yourself and your community.
        </li>

        <li>
        Privately query those credentials to check someone's reputation with people you know in the real world.
        </li>

        </NonBoldList>

<p>
<h3>Easily & verifiably assert.</h3>
This is done based on standards for Verifiable Credentials that use everyone's public & private keys, with apps to make the process as simple as possible.  Most other approaches assume mature, centralized credential authorities; there is a place for those, but there are even more uses for an evolving credential system based on existing networks.
</p>

<p>
<h3>Privately query.</h3>
You can choose to store claims on a server with nothing but network links; people are then permissioned to only see facts about others who are allowed to see them.  By default, if you make a claim about someone else, they can then see facts about you (though you can hide yourself at any time). This allows for discovery: although you may not have access to other people's claims, if you are linked by a contact then that contact has the ability to introduce you.
</p>

<p>
This is not ideal: someday you will even store your own network so that you don't have to share with anyone else's server. There is currently work on encryption and selective disclosure such that you can share only what you want other people to discover, and provide various levels of access for them to contact you... all controlled by you, provably. We intend to migrate to that technology when it is more readily available, but for now we offer this service and require the minimal amount of knowledge while still providing value.
</p>

<p>
<h3>Source Code</h3>

  <NonBoldList>
  <li><a href="https://github.com/trentlarson/endorser-ch">the server that stores and reports on claims</a></li>
  <li><a href="https://github.com/trentlarson/endorser-mobile">the mobile app to create verifiable credentials</a></li>
  <li><a href="https://github.com/trentlarson/uport-demo">this website</a></li>
  </NonBoldList>
</p>

<h3>Other References</h3>

<NonBoldList>

  <li><a href="https://whimsical.com/liberty-certification-KS6ocCfbFWSPhY4uKFWsTx">Here, see a diagram for a simple workflow.</a></li>

<li>Daniel Hardman (an identity & cryptography guru) has written <a href="https://docs.google.com/document/d/1M_PmELevT6uIGIENmZebM1oHFkU8OPTrHqORohGEdjA/edit">a paper about the ideal solutions</a>, and has created <a href="https://docs.google.com/presentation/d/1V1kFE_QCrElavfT7mqQFdkMw0eKMn7hbjStrg99vLZ0/edit#slide=id.ga47a6c451a_0_181">a fantastic summary slide deck</a>.

  <li>The <Link to="/privacy-policy">Privacy Policy</Link> emphasizes these concepts.</li>

</NonBoldList>




      </TextBody>
    )
  }
}
