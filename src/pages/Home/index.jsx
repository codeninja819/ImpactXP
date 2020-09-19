/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { useEffect, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import styled from "styled-components";
import useTokenInfo from "../../hooks/useTokenInfo";
import CountUp from "react-countup";

const Home = () => {
  const {
    price,
    balance,
    marketcap,
    dailyvolume,
    dump,
    treasuryBalance,
    treasuryValue,
    recentBuyBack,
  } = useTokenInfo();

  const [items, setItems] = useState([
    {
      url: "/icons/accountbalance.png",
      text: "Account Balance",
      prevprice: 0,
      price: 0,
      dump: 0,
    },
    {
      url: "/icons/wptprice.png",
      text: "WPT Price",
      prevprice: 0,
      price: 0,
      dump: 0,
    },
    {
      url: "/icons/marketcap.png",
      text: "Market Cap",
      prevprice: 0,
      price: 0,
      dump: 0,
    },
    {
      url: "/icons/treasuryvalue.png",
      text: "Treasury Value",
      prevprice: 0,
      price: 0,
      dump: 0,
    },
    {
      url: "/icons/recentbuyback.png",
      text: "Most Recent Buyback",
      prevprice: 0,
      price: 0,
      dump: 0,
    },
    {
      url: "/icons/treasury.png",
      text: "Total Treasury",
      prevprice: 0,
      price: 0,
      dump: 0,
    },

    {
      url: "/icons/dailyvolume.png",
      text: "Daily Volume",
      prevprice: 0,
      price: 0,
      dump: 0,
    },
  ]);

  const md = useMediaQuery("(max-width : 1220px)");
  const sm = useMediaQuery("(max-width : 1000px)");
  const lg = useMediaQuery("(min-width : 2500px)");
  const xs = useMediaQuery("(max-width : 415px)");

  function numberWithCommas(x) {
    if (!x) return;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  useEffect(() => {
    let temp = [...items];
    temp[0].prevprice = temp[0].price;
    temp[0].price = ((balance * price) / Math.pow(10, 18)).toFixed(2);
    temp[0].dump = dump.toFixed(2);
    temp[1].prevprice = temp[1].price;
    temp[1].price = price.toFixed(2);
    temp[2].prevprice = temp[2].price;
    temp[2].price = marketcap.toFixed(0);
    temp[3].prevprice = temp[3].price;
    temp[3].price = treasuryValue.toFixed(2);
    temp[4].prevprice = temp[4].price;
    temp[4].price = recentBuyBack.toFixed(2);
    temp[5].prevprice = temp[5].price;
    temp[5].price = treasuryBalance.toFixed(2);
    temp[6].prevprice = temp[6].price;
    temp[6].price = dailyvolume.toFixed(2);
    setItems(temp);
  }, [balance, marketcap, treasuryValue]);

  return (
    <StyledContainer>
      <ItemPanel>
        {items.map((data, i) => {
          return (
            <Item>
              {i > 0 ? (
                <Box
                  display={"flex"}
                  mt={
                    md
                      ? sm
                        ? xs
                          ? "-2px"
                          : "5px"
                        : "20px"
                      : lg
                      ? "44px"
                      : "28px"
                  }
                  height={"65px"}
                  alignItems={"flex-end"}
                  style={{
                    transform: md
                      ? sm
                        ? xs
                          ? "scale(0.55)"
                          : "scale(0.6)"
                        : "scale(0.8)"
                      : lg
                      ? "scale(1.4)"
                      : "scale(1)",
                  }}
                >
                  <Box display={"flex"}>
                    <img src={data.url} />
                  </Box>
                </Box>
              ) : (
                <Box
                  display={"flex"}
                  mt={
                    md
                      ? sm
                        ? xs
                          ? "5px"
                          : "10px"
                        : "20px"
                      : lg
                      ? "44px"
                      : "28px"
                  }
                  style={{
                    transform: md
                      ? sm
                        ? xs
                          ? "scale(0.55)"
                          : "scale(0.6)"
                        : "scale(0.8)"
                      : lg
                      ? "scale(1.4)"
                      : "scale(1)",
                  }}
                >
                  <img src={data.url} />
                </Box>
              )}
              <Box
                fontSize={md ? (sm ? "12px" : "14px") : lg ? "20px" : "16px"}
                color={"#43BAD1"}
                fontWeight={"400"}
                mt={md ? (sm ? "-3px" : "10px") : lg ? "30px" : "15px"}
              >
                {data.text}
              </Box>
              {i === 0 ? (
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  mt={md ? (sm ? "0px" : "0px") : "3px"}
                  mb={sm ? "-2px" : "-5px"}
                >
                  <Box
                    fontSize={md ? (sm ? "9px" : "15px") : lg ? "20px" : "17px"}
                    color={dump >= 0 ? "#3DD598" : "tomato"}
                    mr={"13px"}
                    fontWeight={"bold"}
                  >
                    {dump.toFixed(2)}%
                  </Box>
                  <Box
                    fontSize={md ? (sm ? "9px" : "12px") : lg ? "20px" : "13px"}
                  >
                    In 24hrs
                  </Box>
                </Box>
              ) : (
                ""
              )}
              <Box
                fontSize={md ? (sm ? "15px" : "18px") : lg ? "30px" : "24px"}
                mt={md ? (sm ? "3px" : "5px") : "7px"}
              >
                {i !== 5 ? "$" : ""}
                <CountUp
                  start={data.prevprice}
                  end={data.price}
                  decimals={i === 2 || i === 6 ? 0 : 2}
                  formattingFn={(value) => {
                    return value ? numberWithCommas(value) : "0.00";
                  }}
                />
                {i === 5 ? " ETH" : ""}
                <span
                  style={{
                    fontSize: md
                      ? sm
                        ? "11px"
                        : "14px"
                      : lg
                      ? "22px"
                      : "18px",
                  }}
                >
                  {i === 0
                    ? `(${(balance / Math.pow(10, 18)).toFixed(2)})`
                    : ""}
                </span>
              </Box>
            </Item>
          );
        })}
      </ItemPanel>
    </StyledContainer>
  );
};

const Item = styled(Box)`
  width: 292px;
  height: 212px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #000c27;
  border: 1px solid #20486e;
  box-shadow: 5px 5px 15px black;
  margin: 19px;
  @media screen and (max-width: 1220px) {
    width: 220px;
    height: 170px;
    margin: 15px;
  }
  @media screen and (max-width: 1000px) {
    width: 175px;
    height: 127px;
    margin: 11px;
  }
  @media screen and (max-width: 415px) {
    width: 160px;
    height: 120px;
    margin: 8px;
  }
  @media screen and (min-width: 2500px) {
    width: 350px;
    height: 260px;
    margin: 30px;
  }
`;

const ItemPanel = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  overflow-y: scroll;
  max-height: 100%;
  padding-bottom: 24px;
`;

const StyledContainer = styled(Box)`
  color: white;
  font-weight: 500;
  padding: 58px 48px 0 52px;
  height: 100%;
  @media screen and (max-width: 1220px) {
    padding: 58px 20px 0 24px;
  }
  @media screen and (max-width: 1000px) {
    padding: 16px 9px 0 9px;
  }
`;

export default Home;
