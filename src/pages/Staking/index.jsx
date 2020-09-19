/* eslint-disable jsx-a11y/alt-text */
import { useState } from "react";
import { Box, useMediaQuery, Skeleton } from "@mui/material";
import styled from "styled-components";
import { BiLinkExternal } from "react-icons/bi";
import Button from "../../components/Button";
import StakingModal from "../../components/StakingModal";
import useLockInfo from "../../hooks/useLockInfo";
import useTokenInfo from "../../hooks/useTokenInfo";
import { useAddress } from "../../hooks/web3Context";
import { useWeb3Context } from "../../hooks/web3Context";
import { getLockContract, getTokenContract } from "../../utils/contracts";
import { LOCK_ADDR, WPT_ADDR } from "../../abis/address";
import { ethers } from "ethers";
import ROIModal from "../../components/ROIModal";
import { AiOutlineCalculator } from "react-icons/ai";

const lockcompound = [
  [
    213.84 / 8.3 / 22.88,
    213.2 / 8.3 / 22.88,
    212.35 / 8.3 / 22.88,
    210.64 / 8.3 / 22.88,
  ],
  [65.87 / 50.65, 65.49 / 50.65, 65.1 / 50.65, 64.33 / 50.65],
  [93.88 / 66.31, 93.3 / 66.31, 92.53 / 66.31, 90.79 / 66.31],
];

const Staking = ({ setNotification }) => {
  const {
    lockinfo,
    allowance,
    accountlockinfo,
    performanceFee,
    fetchLockData,
    fetchAccountLockData,
    fetchAllowance,
  } = useLockInfo();

  const { price, balance, fetchBalance } = useTokenInfo();
  const account = useAddress();

  const { connect, provider } = useWeb3Context();

  const sm = useMediaQuery("(max-width : 1200px)");
  const xs = useMediaQuery("(max-width : 550px)");

  const [open, setOpen] = useState(false);
  const [roiopen, setROIOpen] = useState(false);
  const [type, setType] = useState(1);
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState(0);
  const [curindex, setCurIndex] = useState(0);
  const [maxpressed, setMaxPressed] = useState(false);

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function onConnect() {
    connect().then((msg) => {
      if (msg.type === "error") {
        setNotification(msg);
      }
    });
  }

  const onApprove = async () => {
    setPending(true);
    try {
      const tokenContract = getTokenContract(provider.getSigner());
      const estimateGas = await tokenContract.estimateGas.approve(
        LOCK_ADDR,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString(),
      };
      const approveTx = await tokenContract.approve(
        LOCK_ADDR,
        "115792089237316195423570985008687907853269984665640564039457584007913129639935",
        tx
      );
      await approveTx.wait();
      fetchAllowance();
    } catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  };

  const onConfirm = async () => {
    setPending(true);
    try {
      const LockContract = getLockContract(provider.getSigner());
      let estimateGas, ttx;
      if (type === 1) {
        estimateGas = await LockContract.estimateGas.deposit(
          maxpressed ? balance : ethers.utils.parseEther(amount),
          curindex,
          { value: performanceFee }
        );
      }
      if (type === 2) {
        estimateGas = await LockContract.estimateGas.withdraw(
          maxpressed
            ? accountlockinfo[curindex].stakedAmount
            : ethers.utils.parseEther(amount),
          curindex,
          { value: performanceFee }
        );
      }
      console.log(estimateGas.toString(), amount);
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }
      const tx = {
        value: performanceFee,
        gasLimit: estimateGas.toString(),
      };
      if (type === 1) {
        ttx = await LockContract.deposit(
          maxpressed ? balance : ethers.utils.parseEther(amount),
          curindex,
          tx
        );
      }
      if (type === 2) {
        ttx = await LockContract.withdraw(
          maxpressed
            ? accountlockinfo[curindex].stakedAmount
            : ethers.utils.parseEther(amount),
          curindex,
          tx
        );
      }
      await ttx.wait();
      fetchAccountLockData();
      fetchBalance();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  };

  async function onCompoundReward(curindex) {
    setPending(true);
    try {
      console.log(curindex);
      const lockContract = getLockContract(provider.getSigner());
      const estimateGas = await lockContract.estimateGas.compoundReward(
        curindex,
        { value: performanceFee }
      );
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString(),
        value: performanceFee,
      };
      const ttx = await lockContract.compoundReward(curindex, tx);
      await ttx.wait();
      fetchAccountLockData();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }

  async function onHarvestReward(curindex) {
    setPending(true);
    try {
      const lockContract = getLockContract(provider.getSigner());
      const estimateGas = await lockContract.estimateGas.claimReward(curindex, {
        value: performanceFee,
      });
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({
          type: "error",
          title: "Error",
          detail: "Insufficient funds",
        });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString(),
        value: performanceFee,
      };
      const ttx = await lockContract.claimReward(curindex, tx);
      await ttx.wait();
      fetchAccountLockData();
      fetchBalance();
      fetchLockData();
    } catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }

  async function onAddToken() {
    const tokenAddress = WPT_ADDR;
    const tokenSymbol = "WPT";
    const tokenDecimals = 18;
    const tokenImage = "";

    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      // eslint-disable-next-line no-undef
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
      figureError(error);
    }
  }
  const figureError = (error) => {
    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      const list = error.message.split(",");
      for (let i = 0; i < list.length; i++) {
        if (list[i].includes("message")) {
          if (list[i].includes("insufficient")) {
            setNotification({
              type: "error",
              title: "Error",
              detail: "Insufficient Funds",
            });
            break;
          }
          let msg = String(list[i]).replaceAll('"', "");
          msg.replaceAll('"\\"', "");
          msg.replaceAll("message:", "");
          msg.replaceAll("}", "");
          setNotification({
            type: "error",
            title: msg.split(":")[1].toUpperCase(),
            detail: msg.split(":")[2],
          });
          break;
        }
      }
    } else
      setNotification({ type: "error", title: "Error", detail: error.message });
  };

  return (
    <StyledContainer>
      <StakingModal
        open={open}
        setOpen={setOpen}
        balance={
          type === 1
            ? balance / Math.pow(10, 18)
            : accountlockinfo[curindex].stakedAmount / Math.pow(10, 18)
        }
        type={type}
        amount={amount}
        setAmount={setAmount}
        maxpressed={maxpressed}
        setMaxPressed={setMaxPressed}
        onClick={() => onConfirm()}
        pending={pending}
        price={price}
      />
      <ROIModal
        open={roiopen}
        setOpen={setROIOpen}
        price={price}
        balance={balance / Math.pow(10, 18)}
        rate={lockinfo[curindex].rate}
        compound={lockcompound[curindex]}
      />
      <PoolPanel>
        {lockinfo.map((data, i) => {
          return (
            <Pool key={i}>
              <Box
                display={"flex"}
                alignItems={"center"}
                width={"100%"}
                bgcolor={"#18243B"}
                fontSize={"20px"}
              >
                <Box
                  display={"flex"}
                  minWidth={xs ? "29px" : "46px"}
                  minHeight={xs ? "46px" : "73px"}
                  maxWidth={xs ? "29px" : "46px"}
                  maxHeight={xs ? "46px" : "73px"}
                >
                  <img src={"/images/vector.png"} width="100%" height="100%" />
                </Box>
                <Box
                  width={"100%"}
                  ml={xs ? "6px" : "19px"}
                  mt={xs ? "6px" : "12px"}
                  fontSize={xs ? "14px" : "16px"}
                >
                  <Box>
                    <span style={{ fontWeight: "bold" }}>EARN WPT</span> / STAKE
                    WPT
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={"100%"}
                    mt={xs ? "3px" : "10px"}
                    alignItems={"center"}
                  >
                    <Box color={"#43BAD1"}>{data.duration} DAYS STAKING</Box>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      color={"#D8D8D8"}
                    >
                      <a
                        href={
                          "https://etherscan.io/token/0x4fd51cb87ffefdf1711112b5bd8ab682e54988ea"
                        }
                        style={{ textDecoration: "none", color: "white" }}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        <Box fontSize={xs ? "12px" : "16px"} mr={"10px"}>
                          {sm ? "Token Info" : "See Token Info"}
                        </Box>
                      </a>
                      <Box lineHeight={"1px"}>
                        <BiLinkExternal />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box display={"flex"} justifyContent={"space-between"}>
                  <Box
                    fontSize={xs ? "18px" : "28px"}
                    display={"flex"}
                    onClick={() => {
                      if (data.rate) {
                        // if (true) {
                        setROIOpen(true);
                        setCurIndex(i);
                      }
                    }}
                    style={{ cursor: "pointer" }}
                    alignItems={"center"}
                  >
                    <Box mr={"10px"}>APR:</Box>
                    {data.rate !== undefined ? (
                      <>
                        <Box>{Number(data.rate).toFixed(2)}% </Box>
                        <Box ml={"5px"}>
                          <AiOutlineCalculator />
                        </Box>
                      </>
                    ) : (
                      <Skeleton
                        variant={"text"}
                        width={xs ? "60px" : "100px"}
                        height={"100%"}
                        style={{ transform: "unset" }}
                      />
                    )}
                  </Box>
                  <Box
                    display={"flex"}
                    color={"#D8D8D8"}
                    width={"fit-content"}
                    height={"fit-content"}
                  >
                    <a
                      href={"https://www.warpigs.io/"}
                      style={{ textDecoration: "none" }}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      <Box
                        fontSize={xs ? "12px" : "16px"}
                        mr={xs ? "16px" : "10px"}
                        color={"#76C893"}
                        style={{ cursor: "pointer" }}
                      >
                        View project site
                      </Box>
                    </a>
                    <Box lineHeight={"1px"}>
                      <BiLinkExternal />
                    </Box>
                  </Box>
                </Box>
                <Box
                  mt={xs ? "15px" : "10px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                >
                  <Box
                    fontWeight={"bold"}
                    color={"#76C893"}
                    fontSize={xs ? "12px" : "16px"}
                  >
                    <Box display={"flex"} alignItems={"center"}>
                      <Box mr={"6px"}>DEPOSIT FEE:</Box>
                      {data.depositFee !== undefined ? (
                        <Box fontWeight={400}>
                          {Number(data.depositFee).toFixed(1)}%
                        </Box>
                      ) : (
                        <Skeleton
                          variant={"text"}
                          width={xs ? "30px" : "40px"}
                          height={"100%"}
                          style={{ transform: "unset" }}
                        />
                      )}
                    </Box>
                    <Box display={"flex"} alignItems={"center"}>
                      <Box mr={"6px"}>WITHDRAW FEE:</Box>
                      {data.withdrawFee !== undefined ? (
                        <Box fontWeight={400}>
                          {Number(data.withdrawFee).toFixed(1)}%
                        </Box>
                      ) : (
                        <Skeleton
                          variant={"text"}
                          width={xs ? "30px" : "40px"}
                          height={"100%"}
                          style={{ transform: "unset" }}
                        />
                      )}
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    witdh={"fit-content"}
                    height={"fit-content"}
                    style={{ cursor: "pointer" }}
                    alignItems={"center"}
                    onClick={() => onAddToken()}
                  >
                    <Box
                      mr={"10px"}
                      color={"#76C893"}
                      fontSize={xs ? "12px" : "16px"}
                    >
                      Add to metamask
                    </Box>
                    <Box
                      display={"flex"}
                      minWidth={xs ? "16px" : "unset"}
                      minHeight={xs ? "16px" : "unset"}
                      maxWidth={xs ? "16px" : "unset"}
                      maxHeight={xs ? "16px" : "unset"}
                    >
                      <img
                        src={"/icons/metamask.png"}
                        width={"100%"}
                        height={"100%"}
                      />
                    </Box>
                  </Box>
                </Box>

                <Box
                  mt={xs ? "33px" : "35px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Box>
                    <Box
                      fontSize={xs ? "12px" : "16px"}
                      color={"rgb(67,186,209)"}
                    >
                      WPT STAKED
                    </Box>
                    <Box
                      fontSize={xs ? "12px" : "20px"}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      {account ? (
                        accountlockinfo[i].stakedAmount !== undefined ? (
                          <Box>
                            {numberWithCommas(
                              (
                                accountlockinfo[i].stakedAmount /
                                Math.pow(10, 18)
                              ).toFixed(2)
                            )}
                          </Box>
                        ) : (
                          <Skeleton
                            variant={"text"}
                            width={xs ? "50px" : "60px"}
                            height={"100%"}
                            style={{ transform: "unset" }}
                          />
                        )
                      ) : (
                        "0.00"
                      )}{" "}
                      <Box ml={"10px"}>WPT</Box>
                    </Box>
                    <Box
                      fontSize={xs ? "12px" : "15px"}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      {account ? (
                        accountlockinfo[i].stakedAmount !== undefined ? (
                          <Box>
                            ~
                            {numberWithCommas(
                              (
                                (accountlockinfo[i].stakedAmount * price) /
                                Math.pow(10, 18)
                              ).toFixed(2)
                            )}
                          </Box>
                        ) : (
                          <Skeleton
                            variant={"text"}
                            width={xs ? "30px" : "40px"}
                            height={"100%"}
                            style={{ transform: "unset" }}
                          />
                        )
                      ) : (
                        "0.00"
                      )}{" "}
                      <Box ml={"6px"}>USD</Box>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={sm ? (xs ? "128px" : "144px") : "300px"}
                  >
                    {allowance ? (
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        width={"144px"}
                      >
                        <Box>
                          <Button
                            type={"plus"}
                            width={xs ? "47px" : "55px"}
                            height={xs ? "47px" : "55px"}
                            fontSize={"26px"}
                            disabled={pending}
                            onClick={() => {
                              setOpen(true);
                              setType(1);
                              setCurIndex(i);
                              setAmount(0);
                            }}
                          >
                            +
                          </Button>
                        </Box>
                        <Box>
                          <Button
                            type={"minus"}
                            width={xs ? "47px" : "55px"}
                            height={xs ? "47px" : "55px"}
                            fontSize={"26px"}
                            disabled={pending}
                            onClick={() => {
                              setOpen(true);
                              setType(2);
                              setCurIndex(i);
                              setAmount(0);
                            }}
                          >
                            -
                          </Button>
                        </Box>
                      </Box>
                    ) : account ? (
                      <Box>
                        <Button
                          type={"secondary"}
                          width={xs ? "128px" : "144px"}
                          height={xs ? "40px" : "55px"}
                          fontSize={xs ? "14px" : "16px"}
                          disabled={pending}
                          onClick={() => onApprove()}
                        >
                          ENABLE
                        </Button>
                      </Box>
                    ) : (
                      <Box>
                        <Button
                          type={"connect"}
                          width={xs ? "128px" : "144px"}
                          height={xs ? "40px" : "55px"}
                          fontSize={xs ? "14px" : "16px"}
                          onClick={() => onConnect()}
                        >
                          CONNECT
                        </Button>
                      </Box>
                    )}
                    <Box width={"144px"} display={sm ? "none" : "block"} />
                  </Box>
                </Box>

                <Box
                  mt={"35px"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Box>
                    <Box
                      color={"rgb(67,186,209)"}
                      fontSize={xs ? "12px" : "16px"}
                    >
                      WPT EARNED
                    </Box>
                    <Box
                      fontSize={xs ? "12px" : "20px"}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      {account ? (
                        accountlockinfo[i].pendingReward !== undefined ? (
                          <Box>
                            {numberWithCommas(
                              accountlockinfo[i].pendingReward.toFixed(2)
                            )}
                          </Box>
                        ) : (
                          <Skeleton
                            variant={"text"}
                            width={xs ? "50px" : "60px"}
                            height={"100%"}
                            style={{ transform: "unset" }}
                          />
                        )
                      ) : (
                        "0.00"
                      )}{" "}
                      <Box ml={"10px"}>WPT</Box>
                    </Box>
                    <Box
                      fontSize={xs ? "12px" : "15px"}
                      display={"flex"}
                      alignItems={"center"}
                    >
                      {account ? (
                        accountlockinfo[i].pendingReward !== undefined ? (
                          <Box>
                            ~
                            {numberWithCommas(
                              (
                                accountlockinfo[i].pendingReward * price
                              ).toFixed(2)
                            )}
                          </Box>
                        ) : (
                          <Skeleton
                            variant={"text"}
                            width={xs ? "30px" : "40px"}
                            height={"100%"}
                            style={{ transform: "unset" }}
                          />
                        )
                      ) : (
                        "0.00"
                      )}{" "}
                      <Box ml={"6px"}>USD</Box>
                    </Box>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    width={sm ? (xs ? "128px" : "144px") : "300px"}
                    flexDirection={sm ? "column" : "row"}
                  >
                    <Button
                      type={"primary"}
                      width={xs ? "128px" : "144px"}
                      height={xs ? "40px" : "55px"}
                      fontSize={xs ? "14px" : "16px"}
                      disabled={!accountlockinfo[i].pendingReward || pending}
                      onClick={() => {
                        onCompoundReward(i);
                      }}
                    >
                      COMPOUND
                    </Button>
                    {accountlockinfo[i].available / 1 ? (
                      <Button
                        type={"secondary"}
                        width={xs ? "128px" : "144px"}
                        height={xs ? "40px" : "55px"}
                        fontSize={xs ? "14px" : "16px"}
                        disabled={!accountlockinfo[i].pendingReward || pending}
                        onClick={() => {
                          onHarvestReward(i);
                        }}
                        style={{ marginTop: sm ? "10px" : 0 }}
                      >
                        HARVEST
                      </Button>
                    ) : (
                      ""
                    )}
                  </Box>
                </Box>
                <Box
                  display={"flex"}
                  justifyContent={"flex-end"}
                  mt={"15px"}
                  color={"#76C893"}
                >
                  Total Staked :{" "}
                  {data.totalStaked ? (
                    `${Number(data.totalStaked).toFixed(2)} WPT`
                  ) : (
                    <Skeleton
                      variant={"text"}
                      width={xs ? "60px" : "80px"}
                      height={"100%"}
                      style={{ transform: "unset" }}
                    />
                  )}
                </Box>
              </Box>
            </Pool>
          );
        })}
      </PoolPanel>
    </StyledContainer>
  );
};

const Pool = styled(Box)`
  width: 100%;
  > div:nth-child(1) {
    padding: 14px 32px 24px 33px;
    border-bottom: 1px solid #20486e;
  }
  > div:nth-child(2) {
    padding: 24px 32px 32px 30px;
  }
  border: 1px solid #20486e;
  max-width: 620px;
  margin: 0 auto;
  margin-bottom: 35px;
  @media screen and (max-width: 1100px) {
    > div:nth-child(1) {
      padding: 9px 20px 15px 19px;
    }
    > div:nth-child(2) {
      padding: 17px 20px 32px 18px;
    }
  }
  @media screen and (max-width: 350px) {
    > div:nth-child(1) {
      padding: 9px 10px 15px 10px;
    }
    > div:nth-child(2) {
      padding: 17px 10px 32px 10px;
    }
  }
`;

const PoolPanel = styled(Box)`
  padding-right: 27px;
  width: 100%;
  overflow-y: scroll;
  max-height: 100%;
  @media screen and (max-width: 1100px) {
    padding: 0;
  }
`;

const StyledContainer = styled(Box)`
  color: white;
  font-weight: 500;
  padding: 77px 64px 11px 74px;
  height: 100%;
  width: 100%;
  @media screen and (max-width: 1100px) {
    padding: 77px 30px 11px 30px;
  }
  @media screen and (max-width: 550px) {
    padding: 66px 20px 6px 20px;
  }
  @media screen and (max-width: 350px) {
    padding: 66px 10px 6px 10px;
  }
`;

export default Staking;
