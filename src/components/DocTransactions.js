import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content = `

# Transactions

How do we represent resource commitments, and then check delivery on those promises?

Here are a few scenarios:

  1. I donate time (or money or other resources) to someone.

  1. Someone makes a request, possibly in trade.

  1. I offer to give resources at some future date, possibly after conditions are met.

  1. I delivered those resources.

  1. Someone confirms that I delivered. In other words, they agree that I followed through on my commitment.

Here are the verbs used for assertions -- many recorded in the app by default:

  - First, here some are actions one might initiate:

    - "Join" shows attendance or membership in a group. Technically: [schema.org "JoinAction"](https://schema.org/JoinAction)

    - "Loan Or Credit" represents money. Technically: [schema.org "LoanOrCredit"](https://schema.org/LoanOrCredit)

    - "Grant" represents a donation. (Note that this isn't yet fully accepted at schema.org.) Technically: [schema.org "Grant"](https://schema.org/Grant)

    - "Donate" is an act of donation. Technically: [schema.org "DonateAction"](https://schema.org/DonateAction)

    - "Give" shows transfer of ownership or a donation (eg. of time). Technically: [schema.org "GiveAction"](https://schema.org/GiveAction)

    - "Offer" proposes a transfer or service, often with conditions or a price.. Technically: [schema.org "Offer"](https://schema.org/Offer)

    - "Watch" says that something was seen. Technically: [schema.org "WatchAction"](https://schema.org/WatchAction)

  - "Agree" says that the user concurs with some other assertion. Technically: [schema.org "AgreeAction"](https://schema.org/AgreeAction)

  - "Accept" signals that someone accepts some contract or pledge. (This could be used to acknowledge and approve something that's involved in a later transfer. This is different from "Agree" because it signals a commitment, eg. to a policy or proposal. See [schema.org](https://schema.org/) for concrete definitions.) Technically: [schema.org "AcceptAction"](https://schema.org/AcceptAction)

    - There is also a "Take" to show that something has been received or redeemed, which is the opposite of "Give"; however, in these applications, a recipient shows fulfilment of a previous "Give" action with an "AgreeAction" where the 'object' has the originating "Give" action (or 'identifier'). Technically: [schema.org "TakeAction"](https://schema.org/TakeAction).

    - There is also ["Send"](https://schema.org/SendAction) and ["Receive"](https://schema.org/ReceiveAction) to signify that an 'object' has been transported, but they don't indicate any transfer of ownership (and are not used in these applications).

Hopefully it's clear how to apply those assertions to the scenarios above:

  1. ["Give"](https://schema.org/GiveAction) an 'object' to a 'recipient', or ["Offer"](https://schema.org/Offer) an 'itemOffered'... time or money or even a ["Service"](https://schema.org/Service).

    - One could also ["Grant"](https://schema.org/Grant), though that is new to the schema.

  1. ["Ask"](https://schema.org/AskAction) for 'object', or ["Demand"](https://schema.org/Demand) some help or resource 'itemOffered'.

  1. ["Offer"](https://schema.org/Offer) some help or resource, eg. some 'eligibleQuantity' of 'itemOffered' at a 'price' when 'availabilityStarts'.

    - One could also ["LoanOrCredit"](https://schema.org/LoanOrCredit) some 'amount' of 'currency' for 'loanTerm'.

  1. ["Give"](https://schema.org/GiveAction) to say that a transfer is done. Senders use this to claim that they transfer ownership to someone else.

  1. ["Agree"](https://schema.org/AgreeAction) to confirm delivery of a "GiveAction" which is included as the 'object'. This is how recipients signal they've received whatever was given or donated.

In our Endorser app, you can try many of these such as Time or Money Donations, or Credit.

Other Notes

- For future work, we would like to see totals of credits & promise held, or know whether some credit has been redeemed.

- In peer-to-peer commitments that remain in a community, it could be useful to verify a history of transactions, possibly between each pair. That could benefit from a merkle tree to ensure that people have a consistent history, thus creating a pairwise private blockchain.

##### Other References

- Some have tackled these problems with tokens; that's a valid approach as well, with upsides of broader markets but downsides of complicated issuance and less private data.

  - [Ying](https://yingme.co/) is building an app with a currency built in.

  - [Let's B More](https://letsbmore.timebanks.org/) has a search through their offerings.

- There are signing technologies for cash without a central blockchain: ["Untraceable Off-line Cash in Wallets with Observers" by Stefan Brands](courses.csail.mit.edu/6.857/2009/handouts/untraceable.pdf) shows one way... this ["note on blind signature schemes"](https://blog.cryptographyengineering.com/a-note-on-blind-signature-schemes/) has other links but most are broken. I believe there is more recent work as well but it's hard to find.


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

export default class DocTransactions extends Component {
  render() { return <TextBody><Markdown>{ content }</Markdown></TextBody> }
}
