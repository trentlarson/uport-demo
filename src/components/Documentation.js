import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

// Sad that @mdx-js/react doesn't work, so gotta include all this inside here.
const content = `

# Community Credentials

## Overview

We are building human-sovereign networking (where individuals can control their data and their connections) by making it easy to begin and easy to grow capabilities.  This is a set of projects to support that goal, with the following features:

 - Easily & verifiably issue credentials about yourself and your community.

 - Privately query those credentials to check someone's reputation with people you know in the real world.


__Easily & verifiably issue credentials.__

This is done based on standards for Verifiable Credentials that use personal public & private keys, with apps to make the process as simple as possible.  Most other approaches assume mature, centralized credential authorities; there is a place for those, but there are even more uses for an evolving credential system based on existing networks.


__Privately query.__

You can choose to store claims on a server with no other info but permission links; people may then see claims about others only if allowed to see them.  By default, if you make a claim about someone else, they can then see facts about you (though you can hide yourself at any time). This allows for discovery: although you may not have access to other people's claims, if you are linked by a contact then that contact has the ability to introduce you.






## Implementation

##### Now

The goals of this implementation are as follows:

  - Show a credential about you, one which is only revealed at your discretion.

    This is achieved with server-side permissions, only allowing access to verifiable credentials via requests signed in real-time.

  - Discover people with claims of interest, and potentially contact them.

    This is achieved with visibility flags, where each user manages what other users can see their DID.

  - Accomplish these goals with minimal data on an external server.

    This is achieved by storing only user-managed IDs in the credentials; there are also explicit permissions that allow the user to only reveal them to users with selected IDs (ie. holders of the permissioned keys).

[For more details on sharing transactional commitments, see this page.](/doc-transactions)

The current implementation is not ideal: someday you will even store your own network so that you don't have to share with anyone else's server. There is currently work on encryption and selective disclosure such that you can share only what you want other people to discover, and provide various levels of access for them to contact you... all controlled by you, provably. We intend to migrate to that technology when it is more readily available, but for now we offer this service and require the minimal amount of knowledge while still providing value.

Here is our source code:

  - the <a href="https://github.com/trentlarson/endorser-ch">server that stores and reports on claims</a>

  - the <a href="https://github.com/trentlarson/endorser-mobile">mobile app to create verifiable credentials</a>

  - this <a href="https://github.com/trentlarson/uport-demo">website</a>


##### Future

  - Notifications, where the mobile app would notify us when there are new statements or transactions that include us.

  - [BBS+ signature schemes](https://mattrglobal.github.io/bbs-signatures-spec/) and [zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof) enable you to send hidden data and later reveal parts of it or even just prove that it fits your purpose without revealing the data. (An example is proving that you're over 21 without revealing your exact age. Magic, right?) We can use these to iterate our way to better server-side privacy.

  - Use [Signal](https://signal.org). They're amazing. For example, they store [minimal information about your contacts on their servers](https://signal.org/blog/private-contact-discovery/), such that they cannot even tell who are your contacts while still letting you find ones that are in your address book. Add to that their work with [anonymous credentials](https://eprint.iacr.org/2019/1416.pdf), groups, and payments (the latter is still in progress) and that seems the best platform on which to build these features. We'll go there as soon as we can figure out how.

  - Let's move more functionality to our own devices. An always-connected service makes things convenient, but we should all have the option of owning our data and managing it on our own phones and computers. We could connect through bluetooth or a local network when in close proximity. A search request might be sent out and results could trickle back in as devices respond. It would be fun!



##### Other Artifacts

  - The [Privacy Policy](/privacy-policy) emphasizes these concepts.

  - There is <a href="https://whimsical.com/liberty-certification-KS6ocCfbFWSPhY4uKFWsTx">a diagram for a simple workflow.</a>


##### Outside Work

  - Identity guru <a href="https://www.linkedin.com/in/danielhardman/">Daniel Hardman</a> has written <a href="https://docs.google.com/document/d/1M_PmELevT6uIGIENmZebM1oHFkU8OPTrHqORohGEdjA/edit">a paper about the ideal solutions</a> (with <a href="https://docs.google.com/presentation/d/1V1kFE_QCrElavfT7mqQFdkMw0eKMn7hbjStrg99vLZ0/edit#slide=id.ga47a6c451a_0_181">an introductory slide deck</a>).

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

export default class Documentation extends Component {
  render() { return <TextBody><Markdown>{ content }</Markdown></TextBody> }
}
