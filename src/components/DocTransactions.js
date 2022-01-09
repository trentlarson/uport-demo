import Markdown from 'markdown-to-jsx';
import React, { Component } from 'react'
import styled from 'styled-components'

const content = `

# Transactions

What is the right way to represent & confirm commitments, and then check delivery on those promises?

Here are a few scenarios:

  1. I donate time or money (ie. resources) to someone.

  1. Someone makes a request, possibly in trade.

  1. I offer to give resources at some future date, possibly after conditions are met.

  1. I delivered those resources.

  1. Someone confirms that I delivered. In other words, I followed through on my commitment.

Here are the verbs used for assertions recorded in the app by default:

  - These are all actions initiated:

    - "Join" shows attendance or membership in a group. Technically: [schema.org "JoinAction"](https://schema.org/JoinAction)

    - "LoanOrCredit" represents money. Technically: [schema.org "LoanOrCredit"](https://schema.org/LoanOrCredit)

    - "Give" shows transfer of ownership or a donation (eg. of time). Technically: [schema.org "GiveAction"](https://schema.org/GiveAction)

    - "Watch" says that something was seen. Technically: [schema.org "WatchAction"](https://schema.org/WatchAction)

  - "Agree" says that the user concurs with some other assertion. Technically: [schema.org "AgreeAction"](https://schema.org/AgreeAction)

  - "Take" signals that something has been received or redeemed. Technically: [schema.org "TakeAction"](https://schema.org/TakeAction)

  - "Accept" signals that someone accepts some contract or pledge. (This could be used to acknowledge and approve something that's involved in a later transfer. "Agree" is different because it is for recognizing a claim. "Take" is different because it is the final acquisition of something. See [schema.org](https://schema.org/) for concrete definitions.) Technically: [schema.org "AcceptAction"](https://schema.org/AcceptAction)

Hopefully it's clear how to apply those assertions to the "few scenarios" above:

  1. ["Give"](https://schema.org/GiveAction) 'object' to 'recipient', or ["Offer"](https://schema.org/Offer) an "itemOffered"... time or money or even a ["Service"](https://schema.org/Service).

  1. ["Ask"](https://schema.org/AskAction) for 'object 'or ["Demand"](https://schema.org/Demand) some help or resource 'itemOffered'.

  1. ["Offer"](https://schema.org/Offer) or some help or resource, eg. some 'eligibleQuantity' of 'itemOffered' at a 'price' when 'availabilityStarts'.

    - Could also ["LoanOrCredit"](https://schema.org/LoanOrCredit) some 'amount' of 'currency' for 'loanTerm'.

  1. ["Give"](https://schema.org/GiveAction) to say that a transfer is done.

  1. ["Take"](https://schema.org/TakeAction) confirms delivery of 'object'.

For future work, we would like to see totals of credits & promise held, or know whether some credit has been redeemed.

Other work:

  - Some have tackled these problems with tokens; that's a valid approach as well, with upsides of broader markets but downsides of complicated issuance, less private data, and slower transactions.

  - In peer-to-peer commitments that remain in a community, it could be useful to verify a history of transactions, possibly between each pair. That could benefit from a merkle tree to ensure that people have a consistent history, thus creating a pairwise private blockchain.

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
