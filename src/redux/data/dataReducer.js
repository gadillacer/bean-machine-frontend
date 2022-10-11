const initialState = {
  loading: false,
  totalSupply: 0,
  isWhitelistOnly: false,
  walletListURI: "",
  mintDate: 0,
  cost: 0,
  userBalance: 0,
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        totalSupply: action.payload.totalSupply,
        isWhitelistOnly: action.payload.isWhitelistOnly,
        walletListURI: action.payload.walletListURI,
        mintDate: action.payload.mintDate,
        userBalance: action.payload.userBalance,
        // cost: action.payload.cost,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
