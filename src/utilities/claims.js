
// insert a space in front of any capital letters
export const insertSpacesBeforeCaps = (text) =>{
  return text[0] + text.substr(1).replace(/([A-Z])/g, ' $1')
}

// return first 3 chars + "..." + last 3 chars
export const firstAndLast3 = (text) => {
  return text.slice(0,3) + "..." + text.slice(-3)
}

// take DID and extract address and return first and last 3 chars
export const firstAndLast3OfDid = (did) => {
  return firstAndLast3(did.split(":")[2].substring(2))
}

export const claimDescription = (type, claim) => {
  if (type === "JoinAction") {
    return claim.event.name + " at " + claim.event.startTime
  } else if (type === "Tenure") {
    var polygon = claim.spatialUnit.geo.polygon
    return firstAndLast3OfDid(claim.party.did) + " holding [" + polygon.substring(0, polygon.indexOf(" ")) + "...]"
  } else {
    return JSON.stringify(claim)
  }
}
