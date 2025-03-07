
# Endorser-ch UI

A UI for recording claims and reporting on them

However, instead of uPort and this web app, we now recommend using just our mobile app for [Android](https://play.google.com/store/apps/details?id=ch.endorser.mobile) or [iPhone](https://apps.apple.com/us/app/endorser-mobile/id1556368693).

This project is for use with https://github.com/trentlarson/endorser-ch



###### Get started
```
# install dependencies
npm ci

# set up the environment
cp .env.local .env
```


###### Develop
```
npm start
```

If you have problems with the build, try changing the node version.

To run as a particular test user, edit src/utilities/claimsTest.js and set TEST_USER_NUM to a valid number from the test data.


Cloned from [uPort Demo](https://github.com/uport-project/demo)

Note that new deployments can remove the "legacy Confirmation" code.




###### Release

- `REACT_APP_GOOGLE_MAPS_API_KEY=... REACT_APP_ENDORSER_CH_HOST_PORT=https://api.endorser.ch npm run build`

- `rsync -azvu -e "ssh -i ~/.ssh/..." build ubuntu@endorser.ch:uport-demo/`

- Check the map and the entity redirect:

  - ... on local:

    - [entity](http://localhost:8081/entity/01HWWXKYTK0P086D8B1C3TNB7S)

    - [best attend](http://127.0.0.1:8081/reportBestAttendance)

    - [map](http://localhost:8081/reportResidences)

  - ... on prod:

    - [entity](https://endorser.ch/entity/01HWWXKYTK0P086D8B1C3TNB7S)

    - [best attend](https://endorser.ch/reportBestAttendance)

    - [map](https://endorser.ch/reportResidences)

- Note that there are videos and html doc files that need to be copied.

- Note that `npm run build` creates static pages with internal links that work when using a "Link" but not an "href".

- It seems like a .env.production file (based on .env.local) worked once.

The following was the approach when we ran `npm run start` on the server:

- Create a release in GitHub, `git pull`, then do one of the following:

  - Manually follow the steps in `./scripts/deploy.sh` (because doing them automatically has borked the server in the past, hanging with 99% CPU usage by kswapd0).

  - ... or, if you're feeling lucky, run `./scripts/deploy.sh ubuntutest release-endorser.ch.XXX ~/.ssh/key` ... and change "ubuntutest" to "ubuntu" when deploying to production.



###### Pointers

Some external systems point to URLs managed here. See them in the `src/App.js` file.

- Google links to the `/privacy-policy` page. Maybe Apple, too.

- The API service creates "handle" IDs with `/entity/...` in them, and contact details are in a URL with `/contact?jwt=...` in them.






# uPort Demo

### About
This uPort demo is designed to showcase some of the basic features and approaches you will take to integrate uPort features into your project. Using [uport-connect](https://github.com/uport-project/uport-connect) itself is quite simple but requires a little bit of understanding the flow for a typical implementation.

**You are  encouraged to run through the demo at [demo.uport.me](https://demo.uport.me) before picking apart the code.**

----------

#### Getting Setup
Before making use of these features for yourself, we need to instantiate the uPort object with an identity.

[Click here to see the setup code](https://github.com/uport-project/demo/blob/master/src/utilities/uportSetup.js)

The `clientID` is the public address of your app and the `signer` (wrapped with the `SimpleSigner` function) is the signing key of your app that you will help create [JWT](http://jwt.io/) tokens. These bits of information are given to you after creating an application with the [uPort App Manager](appmanager.uport.me).

## Features

#### Requesting Credentials
<img src="./screens/login.png" alt="Requesting Credentials" style="width: 400px; display: block; margin-bottom: 20px"/>

[Click here to see the login (request credentials) code with a custom QR image](https://github.com/uport-project/demo/blob/master/src/components/ConnectYourUport.js#L16)

**By default** the [uport-connect](https://github.com/uport-project/uport-connect) library will fire a QR image inside of an injected global modal to help you get up an running quickly.

**This can be disabled** by intercepting the URI so you may use another library to customize the look and feel of the QR image.

Once the user has scanned the displayed QR image, and has submitted their credentials, the promise should resolve with a [Schema.org](http://schema.org/Person) `person` JSON data payload. You can then handle this data however you desire in the `then` function.

[uport.requestCredentials documentation can be found here](https://github.com/uport-project/uport-connect/blob/develop/DOCS.md#connectrequestcredentialsrequest-urihandler--promiseobject-error)

#### Signing Transactions
<img src="./screens/tx.png" alt="Signing a Transaction" style="width: 400px; display: block; margin-bottom: 20px"/>

In a typical application, upon load, there is data usually being requested by a server to get the current state of the user's data. We must do the same here, but rather than reading a SQL database, we are instead reading the blockchain. At ConsenSys we use our Web 3.0 infrastructure stack called [Infura](infura.io) to make the amount of possible calls scalable.
You could otherwise have an Ethereum node local on your machine with a downloaded copy of the blockchain you could query. Calls can be simulated without having a copy of the blockchain though using a local [TestRPC](https://github.com/ethereumjs/testrpc) node, but thats out of scope for this explainer.

uPort comes pre-baked with a web3 instance that calls to [Infura](infura.io) to make your life easy. All you need to do is grab our web3 object and instantiate a smart contract javascript object with a **provided ABI**.

An ABI (Application BINARY Interface) can be generated by compiling your smart contract with the [Remix](https://ethereum.github.io/browser-solidity/) Web IDE. Its on the "Contracts" tab down where it says `interface`. You can deploy this contract to the chain with the `Web3 deploy` code just below that in your local Ethereum node console or with our build & deploy tool called [Truffle](http://truffleframework.com/).

With the uPort library, when a transaction is going to be signed, if the `notifications` flag is set to `true` when requesting credentials initially, **it will allow any future transaction signing to fire a prompt in the uPort mobile app.**

When a transaction is signed and submitted to a smart contract, the Ethereum network takes time to mine (confirm) the transaction (typically 15 seconds). During this time we will need to poll the Web3 node (aka provider and in our case, its Infura), to see if its been mined. We will keep checking it with a function called `waitForMined` and have a pending callback and a success callback to manage state.

[Click here to see the contract instantiation code](https://github.com/uport-project/demo/blob/master/src/utilities/SharesContract.js)

[Click here to see the getShares code](https://github.com/uport-project/demo/blob/master/src/utilities/getShares.js#L5)

[Click here to see the updateShares (transaction signing) code](https://github.com/uport-project/demo/blob/master/src/components/SignTransaction.js#L58)

[Click here to see the waitForMined code](https://github.com/uport-project/demo/blob/master/src/utilities/waitForMined.js#L18)

#### Attesting Credentials
<img src="./screens/creds.png" alt="Attesting Credentials" style="width: 400px; display: block; margin-bottom: 20px"/>

One of the core needs of Web 3.0 is to build trust in a self-soverign world. We establish facts which are not mathmatically derived by social consensus. To create social consensus, actors must attest to things being true. We can do this with uPort using the `attestCredentials` function.

[Click here to see the attestation code](https://github.com/uport-project/demo/blob/master/src/components/CollectCredentials.js#L70)

#### Congratulations

You have now have good grasp about how to use uPort and how to manage the user experience of Web 3.0 applications. Welcome!

-------------------------

#### Contributing

###### Getting started
```
$ git clone git@github.com:uport-project/demo.git
$ yarn install
```

###### Development
```
npm run start
```

###### Deployment
*You will need Amazon S3 permissions to deploy - Contact [andres](https://www.google.com)*

To deploy to **demo.uport.me**
```
npm run deploy
```
To deploy to **demo.uport.space**
```
npm run deploy-test
```
