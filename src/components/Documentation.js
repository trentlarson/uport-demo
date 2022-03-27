import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'

// Sad that @mdx-js/react doesn't work, so gotta include all this inside here.
const content = `

# Community Credentials

## Quick Start

  - See [demos here](/doc-tutorial).

  - The mobile app is on [Google Play](https://play.google.com/store/apps/details?id=ch.endorser.mobile) and [Apple's App Store](https://apps.apple.com/us/app/endorser-mobile/id1556368693).


## Overview

Human-Sovereign Networking & Data Under Your Control

We want to support the growth of community networks at whatever level of privacy you prefer. Meta (AKA Facebook) has created an engaging user interface around networks but they control it all, so let's build networks where individuals have as much control as possible while still allowing discovery.

This is a set of projects to do just that, with the following features:

 - Easily & verifiably issue credentials about yourself and your community.

 - Privately query those credentials to check someone's reputation with the people you know... with the network you have in the rest of the world.


__Easily & verifiably issue credentials.__

This is done based on standards for Verifiable Credentials that use personal public & private keys, with apps to make the process as simple as possible.  Most other approaches assume mature, centralized credential authorities; there is a place for those, but there are even more uses for an evolving credential system based on existing networks.


__Privately query.__

When credentials are saved to our server, people may then see claims about others -- only if allowed to see them. But there's one further possibility: if someone is two friends away, then your common friend can introduce you. This allows for discovery: although you may not have access to other people's claims, if you are linked by a contact then you can use other means to find that information, depending on the comfort level of your shared contact.





## Implementation

##### State-of-the-Art

The goals of this implementation are as follows:

  - Create and show verifiable credentials about you, which are only revealed at your discretion.

    This is achieved with server-side permissions, only allowing access to verifiable credentials via requests signed in real-time.

  - Discover people with claims or credentials of interest, and potentially contact them.

    This is achieved with visibility flags, where each user manages what other users can see their DID.

  - Store minimal data on an external server.

    This is achieved by storing only user-managed IDs in the credentials; there are also explicit permissions that allow the user to only reveal them to users with selected IDs (ie. holders of the permissioned keys).

Credentials and claims are good primitives for a wide range of functions such as: voting, workflows, membership, and even transactions.

  - [Advertise & discover skills & services.](/doc-discovery)

  - [Record time commitments (or any transactions).](/doc-transactions)

  - [Record pledges & membership.](/doc-pledge)

  - [Show appreciation semi-privately.](/doc-witness)

See the [Home Page](/) to install our app.

Here are some other details about the current system, for the technically-minded:

* These goals aim for a system that will support close-knit communities; they do not work well for worldwide traffic.

* One other quirk of this codebase: it is very general-purpose so it does a lot but that means it takes some practice to use. We hope it demonstrates the capabilities, enough that we can then start creating domain-specific apps that are powerful and easy to use.

* Also note that the current implementation is not ideal yet because -- although it keeps personal identifiers private from the public -- it stores your IDs on a central server (which is a target for hackers). Someday you will even store your own network and claims so that you don't have to share with anyone else's server. There is currently work on encryption and selective disclosure such that you can share only what you want other people to discover, and provide various levels of access for them to contact you... all controlled by you, provably. We intend to migrate to that technology when it is more readily available, but for now we offer this service and require the minimal amount of knowledge while still providing value.

Here is our source code:

  - the <a href="https://github.com/trentlarson/endorser-ch">server that stores and reports on claims</a>

  - the <a href="https://github.com/trentlarson/endorser-mobile">mobile app to create verifiable credentials</a>

  - this <a href="https://github.com/trentlarson/uport-demo">website</a>



##### Other Artifacts

- The [Privacy Policy](/privacy-policy) emphasizes these concepts.

- There is <a href="https://whimsical.com/liberty-certification-KS6ocCfbFWSPhY4uKFWsTx">a diagram for a simple workflow.</a>

- There are [Sample Claims](/doc-sample-claims) to scan into the mobile app.


##### Future

  - [BBS+ signature schemes](https://mattrglobal.github.io/bbs-signatures-spec/) and [zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof) enable you to send hidden data and later reveal parts of it or even just prove that it fits your purpose without revealing the data. (An example is proving that you're over 21 without revealing your exact age. Magic, right?) We can use these to iterate our way to better server-side privacy. This may be what Evernym calls "safe signatures", but we've got to understand this more.

  - Build on another platform:

    - [Element](https://element.io)

    - [Keybase](https://keybase.io)

    - [Signal](https://signal.org). It's amazing. For example, they store [minimal information about your contacts on their servers](https://signal.org/blog/private-contact-discovery/), such that they cannot even tell who are your contacts while still letting you find ones that are in your address book. Add to that their work with [anonymous credentials](https://eprint.iacr.org/2019/1416.pdf), groups, and payments (the latter is still in progress) and that seems the best platform on which to build these features. We'll go there as soon as we can figure out how.

    - [Hyphae](https://patternsinthevoid.net/hyphae/hyphae.pdf) by Isis Lovecruft

  - Let's move more functionality to our own devices. An always-connected service makes things convenient, but we should all have the option of owning our data and managing it on our own phones and computers. We could connect through bluetooth or a local network when in close proximity. A search request might be sent out and results could trickle back in as devices respond. It would be fun!

  - Although this is a labor of love and (we hope) a good foundation to support community work, we'd like to get resources to support this development effort. Great user-interfaces take time and effort to create, so that's worth something. We can also build more infrastructure that cater to organizations who could pay.

  - Always appreciate how far we've come. :-) For example, this used to be [based on uPort](https://github.com/trentlarson/uport-demo/blob/5c3d7fcb751ad34ed10ebb7adab650b2cfebb7d1/src/components/Welcome.js#L96). The [first shared transaction was on Jan 2019](https://endorser.ch/claim?claimId=01D25AVGQG1N8E9JNGK7C7DZRD) (before the Verified Credentials Working Draft was submitted).


##### Outside Work

- [Self-Sovereign Identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) is a set of emerging standards based on cryptography and specifications like [Decentralized IDs](https://w3c.github.io/did-core/) (DIDs) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) (VCs). [There are many SSI wallets](https://github.com/Gimly-Blockchain/ssi-wallets). (Our mobile app creates both DIDs and VCs.)

- https://mobilecoin.com/cryptorenaissance
slide at 4:45, 2-minute description starting at 3:00
https://patternsinthevoid.net/hyphae/hyphae.pdf


- Besides [schema.org](https://schema.org/), there are many other vocabularies to use: [Linked Open Vocabularies (LOV)](https://lov.linkeddata.es/dataset/lov/) is a great place to start looking (though some of the pointers no longer work).

- Other projects that are close but don't cover all our use-cases:

  - [Other wallets](https://github.com/Gimly-Blockchain/ssi-wallets) allow creation of VCs but are typically for organizational use.

  - Yingme.co has some time-banking, but it's still working on the onboarding and how to share the technology.

  - Keybase aims to be a general-purpose identity wallet. It doesn't have VCs built-in, but it could be a viable approach. Their sigchains could be useful.

  - MetaMask & Trezor also don't have VCs built in; while they could sign transactions, they're oriented toward cryptocurrencies so we don't envision their use for VCs.

  - We must give a shout-out to blockchains because they brought user-managed cryptography to the mainstream (and still pushing the boundaries for self-sovereign asset management). They're public, so they're not good candidates for any private data.


##### Selected History


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

const ConnectReqID = 'ConnectRequest'

export default class Documentation extends Component {

  constructor (props) {
    super(props)
    this.connectUport = this.connectUport.bind(this)
    uportConnect.onResponse(ConnectReqID).then(res => {
      console.log("res.payload", res.payload)
      this.props.actions.connectUport(uportConnect.state)
      this.props.history.push('/signClaim')
    })
  }
  connectUport () {
    const reqObj = { requested: ['name', 'phone', 'country'],
                     notifications: true }
    uportConnect.requestDisclosure(reqObj, ConnectReqID)
  }

  render() {
    return (
      <TextBody>
        <Markdown>{ content }</Markdown>
        <div>
          <ul>
            <li>
              For the old approach: install uPort via <a href="https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8" target="_blank">App Store</a> or <a href="https://play.google.com/store/apps/details?id=com.uportMobile&amp;hl=en" target="_blank">Google Play</a> and then: <div style={{ textDecoration: 'underline'}} onClick={this.connectUport}>connect with uPort</div>
            </li>
          </ul>
        </div>
      </TextBody>
    )
  }
}
