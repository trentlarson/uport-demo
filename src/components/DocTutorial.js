import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content =
`

# Claims & Credentials

This shows an interaction of four people:

  * User 5 submits a claim.
  * Users 6 and 7 know User 5 directly, and vice versa. They share info and can see one another's claims.
  * User 8 knows Users 6 and 7, but not User 5.

<table style='border-spacing: 20px'>

  <tr>
    <td>
    Video
    </td>
    <td style='width: 50px' <!-- Without this, user names wrap. -->
    Actor
    </td>
    <td>
    Summary
    </td>
    <td>
    Data Sent to Server?
    </td>
  </tr>

  <tr>
    <td>
  [Create New Identifier
  ](/demo/create-new-id.mp4)
    </td>
    <td>
    User 5
    </td>
    <td>
    I generate my own identifier.
    </td>
    <td>
    No
    </td>
  </tr>

  <tr>
    <td>
    [Create Claim & Search
    ](/demo/create-claim-and-search.mp4)
    </td>
    <td>
    User 5
    </td>
    <td>
    I create a claim or credential, then sign it.
    <br />
    Then I search for it to ensure it shows up.
    </td>
    <td>
    Yes: a claim
    </td>
  </tr>

  <tr>
    <td>
  [Cannot See Claim
  ](/demo/cannot-see-claim-details.mp4)
    </td>
    <td>
    User 6
    </td>
    <td>
    I look but cannot see details about User 5 since I haven't been allowed.
    </td>
    <td>
      Only a search request: "pickleball"
    </td>
  </tr>

  <tr>
    <td>
    [Copy Identifier to Share
    ](/demo/copy-my-id.mp4)
    </td>
    <td>
    User 6
    </td>
    <td>
    Get my identifier info to share with my friend User 5.
    </td>
    <td>
    No
    </td>
  </tr>

  <tr>
    <td>
      [Add Contacts
      ](/demo/import-and-make-me-visible.mp4)
    </td>
    <td>
      User 5
    </td>
    <td>
      I add friends 6 & 7, so they can see my identifier on claims.
    </td>
    <td>
      Yes: the network connection for others to see
    </td>
  </tr>

  <tr>
    <td>
      [Now Visible
      ](/demo/can-now-see-id.mp4)
    </td>
    <td>
      User 6
    </td>
    <td>
      I can now see User 5's identifier.
    </td>
    <td>
      Only a search request: "pickleball"
    </td>
  </tr>

  <tr>
    <td>
      [Add Contacts
      ](/demo/add-contacts.mp4)
    </td>
    <td>
      User 6
    </td>
    <td>
      Enable my friends User 5 & 8 to be able to see me on claims. Then see how their names will show when I looks at claims about them.
    </td>
    <td>
      Yes: the network connection for others to see
    </td>
  </tr>

  <tr>
    <td>
      [Look Up A Claim
      ](/demo/user-sees-directly.mp4)
    </td>
    <td>
      User 6
    </td>
    <td>
      After receiving an identifier from my friend User 8, I look up the claim so I can contact User 5 and potentially connect them together.
    </td>
    <td>
      Only a search request: a claim ID
    </td>
  </tr>

  <tr>
    <td>
    [Someone Can Connect Me
    ](/demo/user-sees-connection.mp4)
    </td>
    <td>
    User 8
    </td>
    <td>
    See that User 6 can connect me, and copy the claim ID to give to them.
    </td>
    <td>
    Only a search request: "pickleball" & a claim ID
    </td>
  </tr>

  <tr>
    <td>
    [Confirm
    ](/demo/confirmed.mp4)
    </td>
    <td>
    User 7
    </td>
    <td>
    I choose a credential and confirm it.
    </td>
    <td>
    Yes: a confirmation
    </td>
  </tr>

  <tr>
    <td>
    [Confirmed by Network
    ](/demo/confirmed-by-my-network.mp4)
    </td>
    <td>
    User 8
    </td>
    <td>
    I can see someone in my network who can confirm someone's claim.
    </td>
    <td>
      Only a search request: "pickleball"
    </td>
  </tr>

</table>




`

const TextBody = styled.div`
  flex: 1 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  max-width: 80%;
  padding: 20px;
`

export default class DocPledge extends Component {
  render() { return <TextBody><Markdown>{ content }</Markdown></TextBody> }
}
