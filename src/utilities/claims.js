
// This is used to check for hidden info.
// See https://github.com/trentlarson/endorser-ch/blob/0cb626f803028e7d9c67f095858a9fc8542e3dbd/server/api/services/util.js#L6
const HIDDEN_DID = 'did:none:HIDDEN'

// insert a space in front of any capital letters (after the first letter)
// returm "" for null or undefined input
export const insertSpacesBeforeCaps = (text) =>{
  return text ? text[0] + text.substr(1).replace(/([A-Z])/g, ' $1') : ""
}

// return first 3 chars + "..." + last 3 chars
const firstAndLast3 = (text) => {
  return text.slice(0,3) + "..." + text.slice(-3)
}

export const isHiddenDid = (did) => {
  return did === HIDDEN_DID
}

// take DID and extract address and return first and last 3 chars
export const firstAndLast3OfDid = (did) => {
  if (isHiddenDid(did)) {
    return "(HIDDEN)"
  } else {
    return firstAndLast3(did.split(":")[2].substring(2))
  }
}

export const claimDescription = (claim) => {
  let type = claim['@type']
  if (type === "JoinAction") {
    return firstAndLast3OfDid(claim.agent.did) + " at " + claim.event.organizer.name + " " + claim.event.name + " at " + claim.event.startTime
  } else if (type === "Tenure") {
    var polygon = claim.spatialUnit.geo.polygon
    return firstAndLast3OfDid(claim.party.did) + " holding [" + polygon.substring(0, polygon.indexOf(" ")) + "...]"
  } else {
    return JSON.stringify(claim)
  }
}
