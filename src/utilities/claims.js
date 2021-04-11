
// This is used to check for hidden info.
// See https://github.com/trentlarson/endorser-ch/blob/0cb626f803028e7d9c67f095858a9fc8542e3dbd/server/api/services/util.js#L6
const HIDDEN_DID = 'did:none:HIDDEN'

// insert a space in front of any capital letters (after the first letter)
// returm "" for null or undefined input
export const insertSpacesBeforeCaps = (text) =>{
  return text ? text[0] + text.substr(1).replace(/([A-Z])/g, ' $1') : ""
}

function isDid(value) {
  return value && value.startsWith("did:")
}

// return first 3 chars + "..." + last 3 chars
// or the whole string if it's <= 9 characters long
const firstAndLast3 = (text) => {
  if (!text || text.length <= 9) {
    return text
  }
  return text.slice(0,3) + "..." + text.slice(-3)
}

export const isHiddenDid = (did) => {
  return did === HIDDEN_DID
}

// take DID and extract address and return first and last 3 chars
export const firstAndLast3OfDid = (did) => {
  if (!did) {
    return "(BLANK)"
  }
  if (!isDid(did)) {
    return "(NOT_A_DID)"
  }
  if (isHiddenDid(did)) {
    return "(HIDDEN)"
  }
  const lastChars = did.split(":")[2]
  if (!lastChars) {
    return firstAndLast3(did.substring("did:".length))
  }
  if (lastChars.startsWith("0x")) { // Ethereum DIDs
    return firstAndLast3(lastChars.substring(2))
  }
  return firstAndLast3(lastChars)
}

export const claimDescription = (claim) => {
  let type = claim['@type']
  if (type === "JoinAction") {
    let eventOrganizer = claim.event && claim.event.organizer && claim.event.organizer.name;
    eventOrganizer = eventOrganizer ? eventOrganizer : "";
    let eventName = claim.event && claim.event.name;
    eventName = eventName ? " " + eventName : "";
    let fullEvent = eventOrganizer + eventName;
    fullEvent = fullEvent ? " at " + fullEvent : "";
    let eventDate = claim.event && claim.event.startTime;
    eventDate = eventDate ? " at " + eventDate : "";
    return firstAndLast3OfDid(claim.agent.did) + fullEvent + eventDate;
  } else if (type === "Tenure") {
    var polygon = claim.spatialUnit.geo.polygon
    return firstAndLast3OfDid(claim.party.did) + " holding [" + polygon.substring(0, polygon.indexOf(" ")) + "...]"
  } else {
    return JSON.stringify(claim)
  }
}
