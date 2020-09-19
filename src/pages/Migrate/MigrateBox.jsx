/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";
import Button from "../../components/Button";
import { BiChevronDown } from "react-icons/bi";

const MigrateBox = ({ type }) => {
  return (
    <Box width={"100%"}>
      <Panel>
        <Box fontFamily={"ChakraPetchSemiBold"}>
          MIGRATE {type === "from" ? "FROM" : "TO"}{" "}
          <span style={{ fontSize: "26px", color: "#C31B1F" }}>
            {type === "from" ? "V3" : "V4"}
          </span>
        </Box>
        <Box mt={"24px"} fontSize={"18px"}>
          {type === "from"
            ? "Migrate your V3 IMPACTXP tokens to V4 IMPACTXP tokens."
            : "These are the IMPACTXP V4 tokens you will receive in exchange."}
        </Box>
        <InputPanel mt={"36px"}>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box
              display={"flex"}
              alignItems={"center"}
              style={{ cursor: "pointer" }}
            >
              <Box
                minWidth={"28px"}
                minHeight={"30px"}
                maxWidth={"28px"}
                maxHeight={"30px"}
              >
                <img
                  src={"/logo.png"}
                  width={"100%"}
                  height={"100%"}
                  alt={""}
                />
              </Box>
              <Box ml={"8px"}>ImpactXP</Box>
              <Box>
                <BiChevronDown fontSize={"20px"} />
              </Box>
            </Box>
            <a href={""} target={"_blank"} rel="noreferrer">
              <Box display={"flex"} alignItems={"center"}>
                <Box
                  minWidth={"16px"}
                  minHeight={"16px"}
                  maxWidth={"16px"}
                  maxHeight={"16px"}
                >
                  <img
                    src={"/icons/etherscan.png"}
                    width={"100%"}
                    height={"100%"}
                    alt={""}
                  />
                </Box>
                <a
                  href={
                    "https://etherscan.io/token/0xb12494c8824fc069757f47d177e666c571cd49ae"
                  }
                  target={"_blank"}
                  rel="noreferrer"
                >
                  <Box ml={"5px"} fontSize={"11px"} mt={"3px"}>
                    {type === "from" ? "0xB124...49AE" : "0x0000...0000"}
                  </Box>
                </a>
              </Box>
            </a>
          </Box>
          <Box
            mt={"17px"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <input type={"text"} placeholder={"0.0"} />
            <Button
              type={"primary"}
              width={"82px"}
              height={"33px"}
              fontSize={"20px"}
            >
              MAX
            </Button>
          </Box>
        </InputPanel>
        <Box display={"flex"} justifyContent={"space-between"} mt={"24px"}>
          <Box>Maximum tokens to migrate</Box>
          <Box>123,456, 789</Box>
        </Box>
      </Panel>
      <Button type={"primary"} width={"100%"} height={"56px"} fontSize={"20px"}>
        {type === "from" ? "MIGRATE TOKENS" : "CLAIM TOKENS"}
      </Button>
    </Box>
  );
};
const InputPanel = styled(Box)`
  background: #181a1c;
  border: 1px solid #3e3e3e;
  padding: 13px 27px 11px 24px;
  > div > input {
    font-family: "ChakraPetchMedium";
    font-size: 26px;
    width: 100%;
    background: transparent;
    color: white;
    border: none;
  }
`;

const Panel = styled(Box)`
  background: #0f0f0f;
  box-shadow: 0px 3px 6px black;
  padding: 21px 20px 26px 30px;
  width: 100%;
  box-shadow: 0px 3px 6px black;
  z-index: 5;
  position: relative;
`;
export default MigrateBox;
