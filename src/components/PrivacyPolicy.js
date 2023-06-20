import React, { Component } from 'react'
import styled from 'styled-components'

const TextBody = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  max-width: 80%;
  padding: 20px;
`

export default class PrivacyPolicy extends Component {

  render() {
    return (
      <TextBody>
        <h4>Privacy Policy</h4>

        <h2>Endorser Search Service</h2>
<p>

      This service stores data sent to its APIs.  The data is not used to profile, track, or otherwise identify users.  The data is copied for backup purposes, and sometimes it is queried in order to troubleshoot the service and the associated client applications.

</p>
<p>

This service makes the data available to other users in the following ways:

</p>
<p>

        <ul>

        <li>
        Fields that contain Decentralized Identifiers (DIDs) and nothing else will be shown to other users if:

        <ol>
        <li>the holder of that DID has made a cleim about the DID of the other user, or</li>
        <li>the holder of that DID has explicitly given permission to the other user or to every user.</li>
        </ol>

        That viewing permission will persist until the original DID holder revokes that permission.

        </li>

        <li>
        Fields that contain other data will be visible in their entirety to the world.
        </li>

        </ul>

We have never delivered the non-public back-end data to anyone; only our system administrators have seen the contents and only for the purposes described above.

</p>

      <h2>Collaborating Apps</h2>
        <p>
        Other apps are written to coordinate with this service.  They may store data as well, but any interaction with this service will obey the policies in the Service section.
        </p>

        <p>
        <ul>

        <li>
        This service integrates with the uPort client app, and will send and receive data to and from that app.
        </li>

        <li>
        The Endorser Mobile client app will send data to and receive data from this service.
        </li>

        </ul>

In all client apps, the user can see and review all data before it is sent.
Other data on the client apps -- such as the user's name and contacts -- are not sent to this service.
        </p>

<h2>Data Removal</h2>
<p>
As a rule, the data in this service is open for publication and searching. However, since it is possible to publish sensitive data about people who don't want it to be public, there may be times when data is selectively erased from the server. In addition, the original submitter of data may afterward want their claims erased. These will be addressed on a case-by-case basis (and we expect that rules will evolve over time). This is different from offensive or false data, which generally won't be erased; rather than be a curator of data, this service aims to be a minimal platform for owning and selectively sharing data that is vetted by users.
</p>

Endorser.ch Privacy Policy v1

      </TextBody>
    )
  }
}
