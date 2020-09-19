import { useState } from "react";
import { Box, useMediaQuery, Skeleton } from "@mui/material";
import styled from "styled-components";
import { BiLinkExternal } from 'react-icons/bi'
import Button from "../../components/Button";
import StakingModal from "../../components/StakingModal";
import ROIModal from "../../components/ROIModal";
import { AiOutlineInfoCircle } from 'react-icons/ai'
import useFarmInfo from "../../hooks/useFarmInfo";
import { useAddress, useWeb3Context } from "../../hooks/web3Context";
import { getFarmContract, getPairContract } from "../../utils/contracts";
import useTokenInfo from "../../hooks/useTokenInfo";
import { FARM_ADDR } from "../../abis/address";
import { ethers } from 'ethers'
import { AiOutlineCalculator } from 'react-icons/ai'

const lockcompound = [
  [1046.65 / 244.76, 993.53 / 244.76, 937.51 / 244.76, 830.10 / 244.76],
  [64.84 / 50.01, 64.50 / 50.01, 64.11 / 50.01, 63.25 / 50.01],
  [67.60 / 51.68, 67.24 / 51.68, 66.82 / 51.68, 65.88 / 51.68]
]

const Farming = ({ setNotification }) => {


  const sm = useMediaQuery('(max-width : 1200px)');
  const xs = useMediaQuery('(max-width : 550px)');
  const xxs = useMediaQuery('(max-width : 400px)');

  const [open, setOpen] = useState(false);
  const [type, setType] = useState(1);
  const [pending, setPending] = useState(false);
  const [amount, setAmount] = useState(0);
  const [curindex, setCurIndex] = useState(0);
  const [maxpressed, setMaxPressed] = useState(false);
  const [roiopen, setROIOpen] = useState(false);

  const account = useAddress();

  const {
    allowance,
    farminfo,
    accountfarminfo,
    farmprice,
    liquidity,
    fetchAllowance,
    fetchAccountFarmData,
    fetchFarmData
  } = useFarmInfo();

  const { price, fetchBalance } = useTokenInfo();

  const { connect, provider } = useWeb3Context();

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function onConnect() {
    connect().then(msg => {
      if (msg.type === 'error') {
        setNotification(msg)
      }
    });
  }

  const onApprove = async () => {
    setPending(true);
    try {
      const pairContract = getPairContract(provider.getSigner());
      const estimateGas = await pairContract.estimateGas.approve(FARM_ADDR, "115792089237316195423570985008687907853269984665640564039457584007913129639935");
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({ type: 'error', title: 'Error', detail: 'Insufficient funds' });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString()
      }
      const approveTx = await pairContract.approve(FARM_ADDR, "115792089237316195423570985008687907853269984665640564039457584007913129639935", tx);
      await approveTx.wait();
      fetchAllowance();
    }
    catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }

  const onConfirm = async () => {
    setPending(true);
    try {
      const FarmContract = getFarmContract(provider.getSigner());
      let estimateGas, ttx;
      if (type === 1) {
        estimateGas = await FarmContract.estimateGas.deposit(
          curindex,
          maxpressed ? accountfarminfo[curindex].balance : ethers.utils.parseEther(amount),
          { value: farminfo[curindex].performanceFee }
        );
      }
      if (type === 2) {
        estimateGas = await FarmContract.estimateGas.withdraw(
          curindex,
          maxpressed ? accountfarminfo[curindex].stakedAmount : ethers.utils.parseEther(amount),
          { value: farminfo[curindex].performanceFee }
        );
      }
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({ type: 'error', title: 'Error', detail: 'Insufficient funds' });
        setPending(false);
        return;
      }
      const tx = {
        value: farminfo[curindex].performanceFee,
        gasLimit: estimateGas.toString()
      }
      if (type === 1) {
        ttx = await FarmContract.deposit(
          curindex,
          maxpressed ? accountfarminfo[curindex].balance : ethers.utils.parseEther(amount),
          tx
        );
      }
      if (type === 2) {
        ttx = await FarmContract.withdraw(
          curindex,
          maxpressed ? accountfarminfo[curindex].stakedAmount : ethers.utils.parseEther(amount),
          tx
        );
      }
      await ttx.wait();
      fetchAccountFarmData();
      fetchBalance();
      fetchFarmData();
    }
    catch (error) {
      console.log(error)
      figureError(error);
    }
    setPending(false);
  }

  async function onHarvestReward() {
    setPending(true);
    try {
      const FarmContract = getFarmContract(provider.getSigner());
      const estimateGas = await FarmContract.estimateGas.claimReward(curindex, { value: farminfo[curindex].performanceFee });
      console.log(estimateGas.toString());
      if (estimateGas / 1 === 0) {
        setNotification({ type: 'error', title: 'Error', detail: 'Insufficient funds' });
        setPending(false);
        return;
      }
      const tx = {
        gasLimit: estimateGas.toString(),
        value: farminfo[curindex].performanceFee
      }
      const ttx = await FarmContract.claimReward(curindex, tx);
      await ttx.wait();
      fetchAccountFarmData();
      fetchBalance();
      fetchFarmData();
    }
    catch (error) {
      console.log(error);
      figureError(error);
    }
    setPending(false);
  }

  const figureError = (error) => {
    if (error.code === "UNPREDICTABLE_GAS_LIMIT") {
      const list = error.message.split(',');
      for (let i = 0; i < list.length; i++) {
        if (list[i].includes('message')) {
          if (list[i].includes('insufficient')) {
            setNotification({ type: 'error', title: 'Error', detail: 'Insufficient Funds' });
            break;
          }
          let msg = String(list[i]).replaceAll('"', '');
          msg.replaceAll('"\\"', '');
          msg.replaceAll('message:', '');
          msg.replaceAll('}', '');
          setNotification({ type: 'error', title: msg.split(':')[1].toUpperCase(), detail: msg.split(':')[2] })
          break;
        }
      }
    }
    else
      setNotification({ type: 'error', title: 'Error', detail: error.message })
  }

  return (
    <StyledContainer>
      <StakingModal
        open={open}
        setOpen={setOpen}
        balance={type === 1 ? accountfarminfo[curindex].balance / Math.pow(10, 18) : accountfarminfo[curindex].stakedAmount / Math.pow(10, 18)}
        type={type}
        amount={amount}
        setAmount={setAmount}
        maxpressed={maxpressed}
        setMaxPressed={setMaxPressed}
        onClick={() => onConfirm()}
        pending={pending}
        price={farmprice}
      />
      <ROIModal
        open={roiopen}
        setOpen={setROIOpen}
        price={price}
        balance={accountfarminfo[curindex].balance ? accountfarminfo[curindex].balance / Math.pow(10, 18) : 0}
        rate={farminfo[curindex].rate}
        compound={lockcompound[curindex]}
      />
      <PoolPanel>
        <Alert>
          <Box>
            <Box lineHeight={'0px'} fontSize={xs ? '16px' : '22px'}><AiOutlineInfoCircle /></Box>
            <Box ml={'9px'} fontSize={xs ? '13px' : '16px'}>Farms are exposed to impermanent loss, <br style={{ display: xxs ? 'block' : 'none' }} />be sure to do your own research.</Box>
          </Box>
        </Alert>
        <Box>
          {farminfo.map((data, i) => {
            return <Pool>
              <Box display={'flex'} alignItems={'center'} width={'100%'} bgcolor={'#18243B'} fontSize={'20px'}>
                <Box display={'flex'} minWidth={xs ? '29px' : '46px'} minHeight={xs ? '46px' : '73px'} maxWidth={xs ? '29px' : '46px'} maxHeight={xs ? '46px' : '73px'}>
                  <img src={'/images/vector.png'} width='100%' height='100%' alt={''} />
                </Box>
                <Box width={'100%'} ml={xs ? '6px' : '19px'} mt={xs ? '6px' : '12px'} fontSize={xs ? '14px' : '16px'}>
                  <Box>
                    <span style={{ fontWeight: 'bold' }}>EARN WPT / FARM </span>WPT-ETH
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} width={'100%'} mt={xs ? '3px' : '10px'} alignItems={xs ? 'unset' : 'center'}>
                    <Box color={'#43BAD1'}>
                      Liquidity: ${numberWithCommas(Number(liquidity).toFixed(2))}
                    </Box>
                    <Box display={'flex'} alignItems={'center'} color={'#D8D8D8'} mt={xs ? '20px' : 0}>
                      <a href={'https://earn.brewlabs.info/add/ETH/0x4FD51Cb87ffEFDF1711112b5Bd8aB682E54988eA'} style={{ textDecoration: 'none', color: 'white' }} target={'_blank'} rel="noreferrer">
                        <Box fontSize={xs ? '12px' : '16px'} mr={'10px'}>{'GET WPT-ETH'}</Box>
                      </a>
                      <Box lineHeight={'1px'}>
                        <BiLinkExternal />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box>
                <Box display={'flex'} justifyContent={'space-between'}>
                  <Box fontSize={xs ? '18px' : '28px'} display={'flex'} onClick={() => {
                    if (data.rate) {
                      // if (true) {
                      setROIOpen(true);
                      setCurIndex(i);
                    }
                  }} style={{ cursor: 'pointer' }} alignItems={'center'}>
                    <Box mr={'10px'}>APR:</Box>
                    {
                      data.rate !== undefined ?
                        <>
                          <Box>{Number(data.rate).toFixed(2)}%</Box>
                          <Box ml={'5px'}><AiOutlineCalculator /></Box>
                        </> :
                        <Skeleton variant={'text'} width={xs ? '60px' : '100px'} height={'100%'} style={{ transform: 'unset' }} />
                    }
                  </Box>
                  <Box display={'flex'} color={'#D8D8D8'} width={'fit-content'} height={'fit-content'}>
                    <a href={'https://etherscan.io/address/0x2040726132171f2F9472b1Bd0E5CeAdb3BAE002C'} style={{ textDecoration: 'none' }} target={'_blank'} rel="noreferrer">
                      <Box fontSize={xs ? '12px' : '16px'} mr={xs ? '16px' : '10px'} color={'#76C893'} style={{ cursor: 'pointer' }}>View Contract</Box>
                    </a>
                    <Box lineHeight={'1px'}>
                      <BiLinkExternal />
                    </Box>
                  </Box>
                </Box>
                <Box mt={xs ? '15px' : '10px'} display={'flex'} justifyContent={'space-between'}>
                  <Box fontWeight={'bold'} color={'#76C893'} fontSize={xs ? '12px' : '16px'} mt={sm ? '10px' : 0}>
                    <Box display={'flex'} alignItems={'center'}>
                      <Box mr={'6px'}>
                        DEPOSIT FEE:
                      </Box>
                      {
                        data.depositFee !== undefined ?
                          <Box fontWeight={400}>{Number(data.depositFee).toFixed(1)}%</Box> :
                          <Skeleton variant={'text'} width={xs ? '30px' : '40px'} height={'100%'} style={{ transform: 'unset' }} />
                      }
                    </Box>
                    <Box display={'flex'} alignItems={'center'} >
                      <Box mr={'6px'}>
                        WITHDRAW FEE:
                      </Box>
                      {
                        data.withdrawFee !== undefined ?
                          <Box fontWeight={400}>{Number(data.withdrawFee).toFixed(1)}%</Box> :
                          <Skeleton variant={'text'} width={xs ? '30px' : '40px'} height={'100%'} style={{ transform: 'unset' }} />
                      }
                    </Box>
                  </Box>
                  <Box display={'flex'} color={'#D8D8D8'} width={'fit-content'} height={'fit-content'}>
                    <a href={'https://etherscan.io/address/0x2040726132171f2F9472b1Bd0E5CeAdb3BAE002C'} style={{ textDecoration: 'none' }} target={'_blank'} rel="noreferrer">
                      <Box fontSize={xs ? '12px' : '16px'} mr={xs ? '16px' : '10px'} color={'#76C893'} style={{ cursor: 'pointer' }}>See pair Info</Box>
                    </a>
                    <Box lineHeight={'1px'}>
                      <BiLinkExternal />
                    </Box>
                  </Box>
                </Box>

                <Box mt={xs ? '33px' : '35px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Box>
                    <Box fontSize={xs ? '12px' : '16px'} color={'rgb(67,186,209)'}>WPT-ETH STAKED</Box>
                    <Box fontSize={xs ? '12px' : '20px'} display={'flex'} alignItems={'center'}>
                      {
                        account ? accountfarminfo[i].stakedAmount !== undefined ?
                          <Box>{numberWithCommas((accountfarminfo[i].stakedAmount / Math.pow(10, 18)).toFixed(2))}</Box> :
                          <Skeleton variant={'text'} width={xs ? '50px' : '60px'} height={'100%'} style={{ transform: 'unset' }} />
                          : "0.00"
                      } <Box ml={'10px'}>WPT-ETH</Box>
                    </Box>
                    <Box fontSize={xs ? '12px' : '15px'} display={'flex'} alignItems={'center'} >
                      {
                        account ? accountfarminfo[i].stakedAmount !== undefined ?
                          <Box>~{numberWithCommas((accountfarminfo[i].stakedAmount * farmprice / Math.pow(10, 18)).toFixed(2))}</Box> :
                          <Skeleton variant={'text'} width={xs ? '30px' : '40px'} height={'100%'} style={{ transform: 'unset' }} />
                          : "0.00"
                      } <Box ml={'6px'}>USD</Box>
                    </Box>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} width={sm ? xs ? '128px' : '144px' : '300px'}>
                    {
                      allowance ?
                        <Box display={'flex'} justifyContent={'space-between'} width={'144px'}>
                          <Box>
                            <Button
                              type={'plus'} width={xs ? '47px' : '55px'} height={xs ? '47px' : '55px'} fontSize={'26px'}
                              disabled={pending}
                              onClick={() => { setOpen(true); setType(1); setCurIndex(i); setAmount(0) }}
                            >
                              +
                            </Button>
                          </Box>
                          <Box>
                            <Button
                              type={'minus'} width={xs ? '47px' : '55px'} height={xs ? '47px' : '55px'} fontSize={'26px'}
                              disabled={pending}
                              onClick={() => { setOpen(true); setType(2); setCurIndex(i); setAmount(0) }}
                            >
                              -
                            </Button>
                          </Box>
                        </Box>
                        : account ? <Box>
                          <Button type={'secondary'} width={xs ? '128px' : '144px'} height={xs ? '40px' : '55px'} fontSize={xs ? '14px' : '16px'} disabled={pending} onClick={() => onApprove()}>
                            ENABLE
                          </Button>
                        </Box>
                          :
                          <Box>
                            <Button type={'connect'} width={xs ? '128px' : '144px'} height={xs ? '40px' : '55px'} fontSize={xs ? '14px' : '16px'} onClick={() => onConnect()}>
                              CONNECT
                            </Button>
                          </Box>
                    }
                    <Box width={'144px'} display={sm ? 'none' : 'block'} />
                  </Box>
                </Box>

                <Box mt={'35px'} display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Box>
                    <Box color={'rgb(67,186,209)'} fontSize={xs ? '12px' : '16px'}>WPT EARNED</Box>
                    <Box fontSize={xs ? '12px' : '20px'} display={'flex'} alignItems={'center'}>
                      {
                        account ? accountfarminfo[i].pendingReward !== undefined ?
                          <Box>{numberWithCommas((accountfarminfo[i].pendingReward).toFixed(2))}</Box> :
                          <Skeleton variant={'text'} width={xs ? '50px' : '60px'} height={'100%'} style={{ transform: 'unset' }} />
                          : "0.00"
                      } <Box ml={'10px'}>WPT</Box>
                    </Box>
                    <Box fontSize={xs ? '12px' : '15px'} display={'flex'} alignItems={'center'} >
                      {
                        account ? accountfarminfo[i].pendingReward !== undefined ?
                          <Box>~{numberWithCommas((accountfarminfo[i].pendingReward * price).toFixed(2))}</Box> :
                          <Skeleton variant={'text'} width={xs ? '30px' : '40px'} height={'100%'} style={{ transform: 'unset' }} />
                          : "0.00"
                      } <Box ml={'6px'}>USD</Box>
                    </Box>
                  </Box>
                  <Box display={'flex'} justifyContent={'space-between'} width={sm ? xs ? '128px' : '144px' : '300px'} flexDirection={sm ? 'column' : 'row'}>
                    <Button type={'secondary'} width={xs ? '128px' : '144px'} height={xs ? '40px' : '55px'} fontSize={xs ? '14px' : '16px'} disabled={!accountfarminfo[i].pendingReward || pending}
                      onClick={() => onHarvestReward()}
                      style={{ marginTop: sm ? '10px' : 0 }}
                    >
                      HARVEST
                    </Button>
                    <Box width={'144px'} display={sm ? 'none' : 'block'} />
                  </Box>
                </Box>
                <Box display={'flex'} justifyContent={'flex-end'} mt={'15px'} color={'#76C893'}>
                  Total Staked : {data.totalStaked ? `${Number(data.totalStaked).toFixed(2)} WPT-ETH` : <Skeleton variant={'text'} width={xs ? '60px' : '80px'} height={'100%'} style={{ transform: 'unset' }} />}
                </Box>
              </Box>
            </Pool>
          })}
        </Box>
      </PoolPanel>
    </StyledContainer >
  );
};

const Alert = styled(Box)`
  font-weight : 400;
  margin-bottom : 25px;
  margin-right : 41px;
  >div{
    max-width : 620px;
    margin : 0 auto;
    background : #FF9300;
    box-shadow : 0px 3px 25px #FF8600;
    padding : 14px 12px 14px 10px;
    width : 100%;
    display : flex;
  }
  @media screen and (max-width : 1500px){
    margin-right : 27px;
  }
  @media screen and (max-width : 1100px){
    margin-right : 0;
  }
  @media screen and (max-width : 880px){
    margin-top : 32px;
  }
`;

const Pool = styled(Box)`
  width : 100%;
  >div:nth-child(1){
    padding : 14px 32px 24px 33px;
    border-bottom : 1px solid #20486E;
  }
  >div:nth-child(2){
    padding : 24px 32px 32px 30px;
  }
  border : 1px solid #20486E;
  max-width : 620px;
  margin : 0 auto;
  margin-bottom : 25px;
  @media screen and (max-width : 1100px){
    >div:nth-child(1){
      padding : 9px 20px 15px 19px;
    }
    >div:nth-child(2){
      padding : 17px 20px 32px 18px;
    }
  }
  @media screen and (max-width : 350px){
    >div:nth-child(1){
      padding : 9px 10px 15px 10px;
    }
    >div:nth-child(2){
      padding : 17px 10px 32px 10px;
    }
  }
`;

const PoolPanel = styled(Box)`
  width : 100%;
  max-height : 100%;
  height : 100%;
  
  >div:nth-child(2){
    overflow-y : scroll;
    max-height : calc(100% - 50px);
    padding-right : 27px;
  }
  @media screen and (max-width : 1100px){
    >div:nth-child(2){
      padding : 0;
    }
  }
`;

const StyledContainer = styled(Box)`
  color : white;
  font-weight : 500;
  padding : 0px 64px 36px 74px;
  height : 100%;
  width : 100%;
  @media screen and (max-width : 1100px){
    padding : 0px 30px 36px 30px;
  }
  @media screen and (max-width : 550px){
    padding : 0px 20px 25px 20px;
  }
  @media screen and (max-width : 350px){
    padding : 0px 10px 25px 10px;
  }
 `;


export default Farming;