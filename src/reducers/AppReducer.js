let initialState = {
  sharesInput: 0 // Stupid FB warning about controlled inputs
}

export default(state = initialState, payload) => {
  switch (payload.type) {
    case 'CONNECT_UPORT':
      return {
        ...state,
        uport: payload.data,
        signTransaction: true
      }

    case 'OPEN_MODAL':
      return {
        ...state,
        modal: true
      }
    case 'CLOSE_MODAL':
      return {
        ...state,
        modal: false
      }

    case 'GET_CURRENT_SHARES_REQUEST':
      return {
        ...state,
        gettingShares: true
      }
    case 'GET_CURRENT_SHARES_SUCCESS':
      return {
        ...state,
        gettingShares: false,
        sharesTotal: payload.data
      }
    case 'GET_CURRENT_SHARES_ERROR':
      return {
        ...state,
        gettingShares: false,
        error: payload.data
      }
    case 'UPDATE_SHARES_INPUT':
      return {
        ...state,
        sharesInput: payload.data
      }
    case 'BUY_SHARES_REQUEST':
      return {
        ...state,
        buyingInProgress: true,
        confirmingInProgress: true
      }
    case 'BUY_SHARES_SUCCESS':
      return {
        ...state,
        txHash: payload.tx,
        buyingInProgress: false,
        confirmingInProgress: false,
        sharesTotal: payload.data,
        collectCredentials: true
      }
    case 'BUY_SHARES_ERROR':
      return {
        ...state,
        buyingInProgress: false,
        sharesTotal: payload.data
      }
    case 'CREDENTIALS_DEMO_COMPLETE':
      return {
        ...state,
        registerYourApp: true
      }
    case 'LOGOUT':
      return {
        ...state,
        uport: null,
        logOut: true
      }
    default:
      return state
  }
}
