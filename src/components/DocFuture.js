import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'
import { uportConnect } from '../utilities/uportSetup'

// Sad that @mdx-js/react doesn't work, so gotta include all this inside here.
const content = `

## Future

  - For self ownership of credentials
    - Current: IDs are not revealed outside server, are custodied on server (trusting admins of server)
    - Future Option: move data to personal devices
      - searches can be sent as hashes (to avoid revealing claim to whole network)
      - searches can be allowed selectively & transmitted
      - downsides: intermittent availability
    - Future Option: move to BBS+ signatures (simple encryption checks)
      - previous claims & confirmations could be signed again
      - able to keep proof of time for hash
      - downsides: many previous confirmations would not be signed, migrated claim timestamps wouldn't have global proof of time
    - Future Option: move to homomorphic encryption (richer predicates than BBS+ signatures)
      - to migrate, previous claims & confirmations could be signed again
      - able to keep proof of time for hash
      - downsides: many previous confirmations would not be signed, migrated claim timestamps wouldn't have global proof of time

  - For proof of time:
    - Current: merkle tree backed by other claims
    - Future Option: merkle tree is anchored in a blockchain
      - downsides: items previous to start don't have exact global proof of time

  - For private searches
    - Current: trusting admins of server
    - Future Option: homomorphic encryption
    - Future Option: DID Comm

  - For translation into cryptocurrency wallet
    - able to sign transactions with same key




  - [BBS+ signature schemes](https://mattrglobal.github.io/bbs-signatures-spec/) and [zero-knowledge proofs](https://en.wikipedia.org/wiki/Zero-knowledge_proof) enable you to send hidden data and later reveal parts of it or even just prove that it fits your purpose without revealing the data. (An example is proving that you're over 21 without revealing your exact age. Magic, right?) We can use these to iterate our way to better server-side privacy. This may be what Evernym calls "safe signatures", but we've got to understand this more.

  - Build on another platform for transport:

    - [Element](https://element.io)

    - [Keybase](https://keybase.io)

    - [Signal](https://signal.org). It's amazing. For example, they store [minimal information about your contacts on their servers](https://signal.org/blog/private-contact-discovery/), such that they cannot even tell who are your contacts while still letting you find ones that are in your address book. Add to that their work with [anonymous credentials](https://eprint.iacr.org/2019/1416.pdf), groups, and payments (the latter is still in progress) and that seems the best platform on which to build these features. We'll go there as soon as we can figure out how.

    - [Holochain](https://www.holochain.org/)

    - [Backchannel](https://www.inkandswitch.com/backchannel/)

  - Let's move more functionality to our own devices. An always-connected service makes things convenient, but we should all have the option of owning our data and managing it on our own phones and computers. We could connect through bluetooth or a local network when in close proximity. A search request might be sent out and results could trickle back in as devices respond. It would be fun!

  - Create or leverage a browser extension. A friend told how easy it is to use MetaMask for various platforms, and how inconvenient it is to have to pull out a phone to do work.

  - Although this is a labor of love and (we hope) a good foundation to support community work, we'd like to get resources to support this development effort. Great user-interfaces take time and effort to create, so that's worth something. We can also build more infrastructure that cater to organizations who could pay.


## Outside Work

- [Self-Sovereign Identity](https://en.wikipedia.org/wiki/Self-sovereign_identity) is a set of emerging standards based on cryptography and specifications like [Decentralized IDs](https://w3c.github.io/did-core/) (DIDs) and [Verifiable Credentials](https://www.w3.org/TR/vc-data-model/) (VCs). [There are many SSI wallets](https://github.com/Gimly-Blockchain/ssi-wallets). (Our mobile app creates both DIDs and VCs.)

- https://mobilecoin.com/cryptorenaissance
slide at 4:45, 2-minute description starting at 3:00
https://patternsinthevoid.net/hyphae/hyphae.pdf


- Besides [schema.org](https://schema.org/), there are many other vocabularies to use: [Linked Open Vocabularies (LOV)](https://lov.linkeddata.es/dataset/lov/) is a great place to start looking (though some of the pointers no longer work).

- Other projects that are close but don't cover all our use-cases:

  - [Other wallets](https://github.com/Gimly-Blockchain/ssi-wallets) allow creation of VCs but are typically for organizational use.

  - The paper [Bottom-up Trust Registry in Self Sovereign Identity](https://arxiv.org/pdf/2208.04624.pdf) explains one way to create a registry for issuers, but we care more about managing your personal trust network.

  - Yingme.co has some time-banking, but it's still working on the onboarding and how to share the technology.

  - Keybase aims to be a general-purpose identity wallet. It doesn't have VCs built-in, but it could be a viable approach. Their sigchains could be useful.

  - MetaMask & Trezor also don't have VCs built in; while they could sign transactions, they're oriented toward cryptocurrencies so we don't envision their use for VCs.

  - We must give a shout-out to blockchains because they brought user-managed cryptography to the mainstream (and still pushing the boundaries for self-sovereign asset management). They're public, so they're not good candidates for any private data.

## Selected History

- Always appreciate how far we've come. :-) For example, this used to be [based on uPort](https://github.com/trentlarson/uport-demo/blob/5c3d7fcb751ad34ed10ebb7adab650b2cfebb7d1/src/components/Welcome.js#L96). The [first shared transaction was on Jan 2019](https://endorser.ch/reportClaim?claimId=01D25AVGQG1N8E9JNGK7C7DZRD) (before the Verified Credentials Working Draft was submitted).

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

export default class DocFuture extends Component {

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
