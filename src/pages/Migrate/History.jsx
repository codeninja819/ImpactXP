/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";

const History = ({ histories }) => {
  return (
    <Box width={"100%"} position={"relative"}>
      <Title>MIGRATION HISTORY</Title>
      <Panel>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Box textAlign={"center"} width={"10%"}>
            Date
          </Box>
          <Box textAlign={"center"} width={"20%"}>
            Direction
          </Box>
          <Box textAlign={"center"} width={"20%"}>
            Sending Tx
          </Box>
          <Box textAlign={"center"} width={"20%"}>
            Receiving Tx
          </Box>
          <Box textAlign={"center"} width={"20%"}>
            Amount
          </Box>
          <Box textAlign={"center"} width={"10%"}>
            Status
          </Box>
        </Box>
        <Box mt={"15px"} display={"flex"} flexDirection={"column"}>
          {histories.length ? (
            histories.map((data) => {
              return (
                <Item>
                  <Box width={"10%"}>19/08/22</Box>
                  <Box width={"20%"}>Out</Box>
                  <Box width={"20%"}>1234567890</Box>
                  <Box textAlign={"center"} width={"20%"}>
                    1234567890
                  </Box>
                  <Box width={"20%"}>1234567890</Box>
                  <Box width={"10%"}>Complete</Box>
                </Item>
              );
            })
          ) : (
            <Box textAlign={"center"} fontSize={"24px"} mt={"30px"} mb={"20px"}>
              No Histories Yet.
            </Box>
          )}
        </Box>
      </Panel>
    </Box>
  );
};

const Item = styled(Box)`
  margin: 5px 0;
  background: #0f0f0f;
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  > div {
    text-align: center;
  }
  box-shadow: 0px 3px 6px #0f0f0f;
`;

const Title = styled(Box)`
  background: #c31b1f;
  font-family: "ChakraPetchSemiBold";
  font-size: 18px;
  padding: 16px 74px 16px 30px;
  max-width: 282px;

  clip-path: polygon(0% 0%, 92% 0%, 100% 100%, 0% 100%);
`;

const Panel = styled(Box)`
  background: linear-gradient(to bottom, #333333, #1d1d1d);
  padding: 20px 30px 25px 30px;
  font-family: "ChakraPetchSemiBold";
  height: fit-content;
`;
export default History;
