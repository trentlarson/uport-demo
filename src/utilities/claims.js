
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

