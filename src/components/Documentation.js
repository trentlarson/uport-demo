import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

// Sad that @mdx-js/react doesn't work, so gotta include all this inside here.
const content = `

# Community Credentials

## Overview

We are building human-sovereign networking where individuals can control their data and their connections, by making it easy to begin and then easy to grow capabilities. We want to support the growth of community networks at whatever level of privacy you prefer; Facebook/Meta has created an engaging user interface around networks but they control it all, so here's one way to create a network where individuals have as much control as possible while still allowing some random discovery.

This is a set of projects to support that goal, with the following features:

 - Easily & verifiably issue credentials about yourself and your community.

 - Privately query those credentials to check someone's reputation with the people you know... with the network you have in the rest of the world.


__Easily & verifiably issue credentials.__

This is done based on standards for Verifiable Credentials that use personal public & private keys, with apps to make the process as simple as possible.  Most other approaches assume mature, centralized credential authorities; there is a place for those, but there are even more uses for an evolving credential system based on existing networks.


__Privately query.__

When credentials are saved to our server, people may then see claims about others -- only if allowed to see them. But there's one further possibility: if someone is two friends away, then your common friend can introduce you. This allows for discovery: although you may not have access to other people's claims, if you are linked by a contact then you can use other means to find that information, depending on the comfort level of your shared contact.





## Implementation

##### Now

The goals of this implementation are as follows:

  - Create and show verifiable credentials about you, which are only revealed at your discretion.

    This is achieved with server-side permissions, only allowing access to verifiable credentials via requests signed in real-time.

  - Discover people with claims or credentials of interest, and potentially contact them.

    This is achieved with visibility flags, where each user manages what other users can see their DID.

  - Store minimal data on an external server.

    This is achieved by storing only user-managed IDs in the credentials; there are also explicit permissions that allow the user to only reveal them to users with selected IDs (ie. holders of the permissioned keys).

Credentials and claims are good primitives for a wide range of functions such as: voting, workflows, membership, and even transactions.

  - [Advertize & discover skills & services.](/doc-discovery)

  - [Record time commitments (or any transactions).](/doc-transactions)

  - [Record pledges & membership.](/doc-pledge)

  - Show appreciation privately. Do this with a "Witness" claim in the app.


Note that these goals do not aim for a system that handles worldwide traffic but rather one that will support close-knit communities.

Also note that the current implementation is not ideal because -- although it keeps personal identifiers private from the public -- it stores them on a central server (which is a target for hackers). Someday you will even store your own network and claims so that you don't have to share with anyone else's server. There is currently work on encryption and selective disclosure such that you can share only what you want other people to discover, and provide various levels of access for them to contact you... all controlled by you, provably. We intend to migrate to that technology when it is more readily available, but for now we offer this service and require the minimal amount of knowledge while still providing value.

One other shortcoming of this codebase: it is not particularly easy to use. We hope it demonstrates the capabilities, enough that we can then start creating domain-specific apps that are powerful and easy to use.



Here is our source code:

  - the <a href="https://github.com/trentlarson/endorser-ch">server that stores and reports on claims</a>

  - the <a href="https://github.com/trentlarson/endorser-mobile">mobile app to create verifiable credentials</a>

  - this <a href="https://github.com/trentlarson/uport-demo">website</a>



##### Other Artifacts

- The [Privacy Policy](/privacy-policy) emphasizes these concepts.

- There is <a href="https://whimsical.com/liberty-certification-KS6ocCfbFWSPhY4uKFWsTx">a diagram for a simple workflow.</a>

- The mobile app is on [Google Play](https://play.google.com/store/apps/details?id=ch.endorser.mobile) and [Apple's App Store](https://apps.apple.com/us/app/endorser-mobile/id1556368693).



##### Future

  - [BBS+ signature schemes](https://mattrglobal.github.io/bbs-signatures-spec/) and [zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof) enable you to send hidden data and later reveal parts of it or even just prove that it fits your purpose without revealing the data. (An example is proving that you're over 21 without revealing your exact age. Magic, right?) We can use these to iterate our way to better server-side privacy. This may be what Evernym calls "safe signatures", but we've got to understand this more.

  - Use [Signal](https://signal.org). It's amazing. For example, they store [minimal information about your contacts on their servers](https://signal.org/blog/private-contact-discovery/), such that they cannot even tell who are your contacts while still letting you find ones that are in your address book. Add to that their work with [anonymous credentials](https://eprint.iacr.org/2019/1416.pdf), groups, and payments (the latter is still in progress) and that seems the best platform on which to build these features. We'll go there as soon as we can figure out how.

  - Let's move more functionality to our own devices. An always-connected service makes things convenient, but we should all have the option of owning our data and managing it on our own phones and computers. We could connect through bluetooth or a local network when in close proximity. A search request might be sent out and results could trickle back in as devices respond. It would be fun!

  - Although this is a labor of love and (we hope) a good foundation to support community work, we'd like to get resources to support this development effort. Great user-interfaces take time and effort to create, so that's worth something. We can also build more infrastructure that cater to organizations who could pay.



##### Outside Work

  - [Self-Sovereign Identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) is a set of emerging standards based on cryptography and specifications like [Decentralized IDs](https://w3c.github.io/did-core/) (DIDs) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) (VCs). [There are many SSI wallets](https://github.com/Gimly-Blockchain/ssi-wallets). (Our mobile app creates both DIDs and VCs.)


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
