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
        <h1>Community Credentials</h1>

        <h2>Overview</h2>
        <p>
      We are building human-sovereign networking (where individuals can control their data and their connections) by making it easy to begin and easy to grow capabilities.  This is a set of projects which supports that goal, with the following features:
        </p>

        <NonBoldList>

        <li>
        Easily & verifiably credential -- ie. assert & confirm -- facts about yourself and your community.
        </li>

        <li>
        Privately query those credentials to check someone's reputation with people you know in the real world.
        </li>

        </NonBoldList>

<p>
Easily & verifiably assert.<br/>
This is done based on standards for Verifiable Credentials that use personal public & private keys, with apps to make the process as simple as possible.  Most other approaches assume mature, centralized credential authorities; there is a place for those, but there are even more uses for an evolving credential system based on existing networks.
</p>

<p>
Privately query.<br/>
You can choose to store claims on a server with nothing but network links; people are then permissioned to only see facts about others who are allowed to see them.  By default, if you make a claim about someone else, they can then see facts about you (though you can hide yourself at any time). This allows for discovery: although you may not have access to other people's claims, if you are linked by a contact then that contact has the ability to introduce you.
</p>

<p>
        For other references: <a href="https://www.linkedin.com/in/danielhardman/">Daniel Hardman</a> has written <a href="https://docs.google.com/document/d/1M_PmELevT6uIGIENmZebM1oHFkU8OPTrHqORohGEdjA/edit">a paper about the ideal solutions</a>, and has created <a href="https://docs.google.com/presentation/d/1V1kFE_QCrElavfT7mqQFdkMw0eKMn7hbjStrg99vLZ0/edit#slide=id.ga47a6c451a_0_181">an introductory slide deck</a>.
</p>

<h2>Implementation - Now and Future</h2>

      The goals of this implementation are as follows:

        <NonBoldList>

        <li>
        Show a credential about you, one which is only revealed at your discretion.
        <br/>
        This is achieved with server-side permissions, only allowing access to verifiable credentials via requests signed in real-time.
        </li>

        <li>
        Discover people with claims of interest, and potentially contact them.
        <br/>
        This is achieved with visibility flags, where each user manages what other users can see their DID.
        </li>

        </NonBoldList>

        <p>
        This codebase has a server that keeps minimal data on the server: it stores the credentials but only reveals them to holders of the keys or to other key holders who have permissioned them.
        </p>

<p>
The current implementation is not ideal: someday you will even store your own network so that you don't have to share with anyone else's server. There is currently work on encryption and selective disclosure such that you can share only what you want other people to discover, and provide various levels of access for them to contact you... all controlled by you, provably. We intend to migrate to that technology when it is more readily available, but for now we offer this service and require the minimal amount of knowledge while still providing value.
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

  <li>The <Link to="/privacy-policy">Privacy Policy</Link> emphasizes these concepts.</li>

  <li><a href="https://whimsical.com/liberty-certification-KS6ocCfbFWSPhY4uKFWsTx">Here, see a diagram for a simple workflow.</a></li>

</NonBoldList>




      </TextBody>
    )
  }
}
