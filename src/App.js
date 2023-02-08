import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { getMerkleProof } from "./utils/getMerkleProof";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Container, Snackbar } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Alert from "@material-ui/lab/Alert";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;


const MintContainer = styled.div``; // add your owns styles here

// interface AlertState {
//   open: boolean;
//   message: string;
//   severity: "success" | "info" | "warning" | "error" | undefined;
//   hideDuration?: number | null;
// }

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [alertState, setAlertState] = useState({
    open: false,
    message: "",
    severity: undefined,
    hideDuration: null
  });
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false,
  });



  const claimNFTs = async () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log(data)
    let merkleProof = await getMerkleProof(blockchain.account, data.walletListURI);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);

    if (!merkleProof && !data.isWhitelistOnly) {
      blockchain.smartContract.methods
      .mint()
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went errored please try again later.");
        setAlertState({
          open: true,
          message: "Sorry, something went errored please try again later.",
          severity: "error",
          hideDuration: null,
        });
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setAlertState({
          open: true,
          message: "Congratulations! Mint succeeded!",
          severity: "success",
          hideDuration: 7000,
        });
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });    
    } else if (!merkleProof) { 
      return 
    } else {
    blockchain.smartContract.methods
      .whitelistMint(merkleProof)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went errored please try again later.");
        setAlertState({
          open: true,
          message: "Sorry, something went errored please try again later.",
          severity: "error",
          hideDuration: null,
        });
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setAlertState({
          open: true,
          message: "Congratulations! Mint succeeded!",
          severity: "success",
          hideDuration: 7000,
        });
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
    }
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };
  
  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
      <Container style={{ marginTop: 100 }}>
      <Container maxWidth="xs" style={{ position: "relative" }}>
        <Paper
          style={{
            padding: 24,
            paddingBottom: 10,
            backgroundColor: "#151A1F",
            borderRadius: 6,
          }}
        >
          {!blockchain.account ? (
            <s.CTAButton
              onClick={(e) => {
                e.preventDefault();
                dispatch(connect());
                getData();
              }}
            >
              Connect Goerli
            </s.CTAButton>
          ) : (
            <>
              {blockchain.smartContract && data.mintDate && (
                <Grid
                  container
                  direction="row"
                  justifyContent="center"
                  wrap="nowrap"
                >
                  <Grid item xs={3}>
                    <Typography variant="body2" color="#9c27b0" 
                      style={{
                        color: "#ba68c8",
                      }}
                    >
                      Remaining
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#1976d2"
                      style={{
                        fontWeight: "bold",
                        color: "#42a5f5"
                      }}
                    >
                      99
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2" 
                      style={{
                        color: "#ba68c8",
                      }}
                    >
                      Price
                    </Typography>
                    <Typography
                      variant="h6"
                      color="#1976d2"
                      style={{ fontWeight: "bold", color: "#42a5f5" }}
                    >
                      0.05
                    </Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <>
                      <Typography
                          variant="body2"
                          align="center"
                          display="block"
                          style={{ color: 'white' }}
                      >
                        {
                          data.mintDate &&
                          parseInt(data.mintDate) > Math.floor(Date.now() / 1000)
                          ? new Date(data.mintDate * 1000).toLocaleString() +  " 🔴"
                          : "🟢 LIVE "
                        }
                        {
                          data.isWhitelistOnly 
                          ? " (WHITELIST)"
                          : " (PUBLIC)"
                        }
                      </Typography>
                      { data.startTime &&
                        data.startTime >
                          new Date().getTime() / 1000 && (
                          <Typography
                            variant="caption"
                            align="center"
                            display="block"
                            style={{ fontWeight: "bold" }}
                          >
                            MINT TIME
                          </Typography>
                        )}
                    </>
                  </Grid>
                </Grid>
              )}
              <Typography
                variant="caption"
                align="center"
                display="block"
                style={{ margin: 10, color: "orange", fontWeight: "bold"}}
              >
                {"Your Balance: " + (data.userBalance ? data.userBalance : "...loading")}
              </Typography>
              <MintContainer>
                <s.CTAButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT"}
                </s.CTAButton>
              </MintContainer>
            </>
          )}
          <Typography
            variant="caption"
            align="center"
            display="block"
            style={{ marginTop: 7, color: "grey" }}
          >
            Powered by LAVISHLAIR
          </Typography>
        </Paper>
      </Container>

      <Snackbar
        open={alertState.open}
        autoHideDuration={
          alertState.hideDuration === undefined ? 6000 : alertState.hideDuration
        }
        onClose={() => setAlertState({ ...alertState, open: false })}
      >
        <Alert
          onClose={() => setAlertState({ ...alertState, open: false })}
          severity={alertState.severity}
        >
          {alertState.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default App;
