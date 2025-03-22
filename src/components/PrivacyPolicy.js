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

      This service stores data sent to its APIs.  The data is not used to profile, track, or otherwise identify users -- except in cases where they are determined to be abusing the service. The data is copied for backup purposes, and sometimes it is queried in order to troubleshoot the service and the associated client applications.

        </p>
        <p>

      This service makes the data available to other users in the following ways:

        </p>
        <p>

        <ul>

        <li>
        Fields with Decentralized Identifiers (DIDs) will be shown to other users if:

        <ol>
        <li>the holder of that DID has made a cleim about the DID of the other user, or</li>
        <li>the holder of that DID has explicitly given permission to the other user or to every user.</li>
        </ol>

        That viewing permission will persist until the original DID holder revokes that permission.

        </li>

        <li>
        Fields with other data will be visible in their entirety to the world.
        </li>

        </ul>

      We have never delivered the non-public back-end data to anyone; only our system administrators have seen the contents, and only for the purposes described above.

        </p>

        <h2>Collaborating Apps</h2>
        <p>
        Other apps are written to coordinate with this service.  They may store data as well, but any interaction with this service will obey the policies in the Service section.
        </p>

        <p>
        <ul>

        <li>
        The Endorser Mobile native app client and the Time Safari web app clients are affiliated with this service, and they offer full visibility of what is sent.
        </li>

        <li>
        It is possible for others to independently create apps to interact with this service.
        </li>

        </ul>

      Data on the affiliated client apps -- such as the user's name and contacts -- are not sent to this service. Other apps are recommended to do the same, but this service does not vet unaffiliated apps.
        </p>

        <h2>Data Removal</h2>

        <p>
As a rule, the data in this service is open for worldwide publication and searching. However, since it is possible to publish sensitive data about oneself, there may be times when someone wants to erase data that they created, and we will support such requests. This is different from offensive or false data, which generally won't be erased; rather than be a curator of data, this service is a minimal platform for owning and selectively sharing data, where other users in your network are your best judges.
        </p>

        <p>
The service operators may choose to erase or hide data for their own reasons. They do not want to support activities they find offensive and damaging; they value free speech, but they expect that they don't have to define all offensive behavior... they're supporting this for people in their network who generally value good society, and they expect that anyone who doesn't like their choices can choose another platform. One prime example is child sexual abuse material. So they reserve the right to remove such data from their servers. They will make reasonable attempts to communicate with offending parties and work out any disputes with them, since this is a service for people who are connected to one another, but they currently don't define all the boundaries that exist in their heads and hearts.
        </p>

        <p>
        Due to these situations, it is always wise to keep a backup of your data as well as important data from others (since they may choose to erase theirs).
        </p>

        <p>
        To request that operators remove all the data you previously submitted, email <a href="mailto:CommunityEndorser@gmail.com">CommunityEndorser@gmail.com</a>. Note that the process will require account validation, the easiest method being via signed approval through the affiliated Endorser Mobile app.
        </p>

        <br />
        <br />
        <br />
        Endorser.ch Privacy Policy v2

        <p>Changes in v2: added disclaimer for service abuse;  updated collaborating apps; reworded removal policy for personal deletion; added email for data removal</p>

      </TextBody>
    )
  }
}
