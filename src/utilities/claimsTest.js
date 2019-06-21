
// To emulate a test user, set to a numeric offset into the TEST_CREDS array.
// undefined or -1 will result in the logged-in user setting.
const TEST_USER_NUM = -1

const { Credentials } = require('uport-credentials')

export const TEST_CREDS = [
  { creds: { did: 'did:ethr:0x00c9c2326c73f73380e8402b01de9defcff2b064', privateKey: '8de6e2bd938a29a8348316cbae3811475f22f2ae87a42ad0ece727ff25c613b5' }},
  { creds: { did: 'did:ethr:0x11bb3621f8ea471a750870ae8dd5f4b8203e9557', privateKey: 'e4a3d47ed1058e5c07ed825b5cf0516aab757b1d141a4dc24392271537e10aa0' }},
  { creds: { did: 'did:ethr:0x22c51a43844e44b59c112cf74f3f5797a057837a', privateKey: '590e1a75d89e453d9b33f982badc4fdcd67046c8dbf4323f367b847776126d1b' }},
  { creds: { did: 'did:ethr:0x332661e9e6af65eea6df253296a26257ff304647', privateKey: 'ae945c106dc5538b5dc6acffef7901ef5e30b22c80d7af0a5d466432a49eeb9c' }, name: "Cheerful Charlie"},
  { creds: { did: 'did:ethr:0x44afb67bb333f2f61aa160532de0490f6dc9f441', privateKey: 'c729c12f5b95db8ab048b95319329f35e9165585a3e9f69f36e7309f2f1c77bc' }},
  { creds: { did: 'did:ethr:0x5592ea1a9a3c9bb12abe5fc91bfa40622b24a932', privateKey: '3561bed03fb41bf3dec3926273b302f20bb25a25c723a93e1e6c9212edff6d1d' }},
  { creds: { did: 'did:ethr:0x66b50b886a7df641c96f787002de3ace753bb1b1', privateKey: '7bd14ba3709d0d31f8ba56f211856bdb021655c5d99aa5ef055e875159e695a6' }},
  { creds: { did: 'did:ethr:0x777d6361330d047e99bee0a275a8adb908fe5514', privateKey: 'e078084054c30a94f648cfde5bc1bbcbc341ee71431f1b37abf1dc7c8f2f5d35' }, name: "Giddy Gladys"},
  { creds: { did: 'did:ethr:0x888acf84fa5793a5e0dd64ac25bcfc55e7f25d8f', privateKey: '9c18f36cdf8ff55e9b0ceef77ed5fe69e5d93009a881d5c552afe8aad66175a7' }},
  { creds: { did: 'did:ethr:0x999676de3eaa1bcf5ebae2467ac36682069215e1', privateKey: '83239f76f6eb46f75b977b43c60184f57410a4039ce19a674aa815f0203ae773' }},
  { creds: { did: 'did:ethr:0xaaa29f09c29fb0666b8302b64871d7029032b479', privateKey: 'b4507c7473031d213a1e0a6c3eaf68517519ef0f852928d6d7dffdc851d5ccda' }, name: "Annabelle"},
  { creds: { did: 'did:ethr:0xbbbee8d9c34746aac37116be7384a8228d73e6aa', privateKey: 'feb8d652df079b3c6d85f78be40804f6993b107482787cf9a9ec761f452432b9' }, name: "Annabelle's Boyfriend"},
  { creds: { did: 'did:ethr:0xccc4645181a6158aa253a5765e1edde893fb164b', privateKey: 'b4d3efaf5475ebbbd665fe31cba81e398248971b5708093e3a89fcecb0824d3f' }},
  { creds: { did: 'did:ethr:0xddd6c03f186c9e27bc150d3629d14d5dbea0effd', privateKey: 'aa7a540eb94f9a24682cb4ff9ee6918be7397b1f3349e4eda4493ab7e95c32c0' }},
  { creds: { did: 'did:ethr:0xeeed589b09a449ae6ccf89ad0e9effe74072f829', privateKey: 'bad6e7ab26eb2cc98ec39ccc6bb7b814b8bf08dcde184e7d0514a914d032b963' }},
  { creds: { did: 'did:ethr:0xfff9f93c0c7adb7213022c22b9eb99fcb409e734', privateKey: 'f2c27382d8ab785be1df575323d110181d2ea46207ffda52d76fb5f98db088fa' }},
]

var testUserPushToken = null
var testUserDid = null
var testUserName = null
if (TEST_USER_NUM > -1) {
  testUserDid = TEST_CREDS[TEST_USER_NUM].creds.did
  testUserName = TEST_CREDS[TEST_USER_NUM].name || "[undefined]"

  let fakePushToken = {
    "iat": 1558468854,
    "exp": 1590004854,
    "aud": "did:ethr:0x62e2a07c9ee3925766553dc8b7081061ea46919f",
    "type": "notifications",
    "value": "arn:aws:sns:us-west-2:113196216558:endpoint/GCM/uPort/b782d4a3-f0c3-3b59-a297-68e9fbebad29",
    "iss": TEST_CREDS[TEST_USER_NUM].creds.did
  }
  let Cred = new Credentials(TEST_CREDS[TEST_USER_NUM].creds)
  Cred.createVerification(fakePushToken).then((token) => {
    testUserPushToken = token
    console.log("Set test user PushToken", testUserPushToken)
  })
}

export const getUserDid = () => testUserDid

export const getUserName = (props) => testUserName || props.uport.name

export const getUserToken = (props) => testUserPushToken || props.uport.pushToken
