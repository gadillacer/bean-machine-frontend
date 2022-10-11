// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = () => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.nextId()
        .call();

      let isWhitelistOnly = await store
        .getState()
        .blockchain.smartContract.methods.whitelistOnly()
        .call();

      let walletListURI = await store
        .getState()
        .blockchain.smartContract.methods.getWalletMintListURI()
        .call();

      let mintDate = await store
        .getState()
        .blockchain.smartContract.methods.mintDate()
        .call();

      let account = await store.getState().blockchain.account;
      let userBalance = await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(account)
        .call();
      // let cost = await store
      //   .getState()
      //   .blockchain.smartContract.methods.cost()
      //   .call();

      dispatch(
        fetchDataSuccess({
          totalSupply,
          isWhitelistOnly,
          walletListURI,
          mintDate,
          userBalance
          // cost,
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
