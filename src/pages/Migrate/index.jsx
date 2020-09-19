/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import MigrateBox from "./MigrateBox";
import PricePanel from "./PricePanel";
import History from "./History";
import useTokenInfo from "../../hooks/useTokenInfo";
import { priceFormat } from "../../utils/functions";

const Migrate = () => {
  const histories = [];
  const { price } = useTokenInfo();
  return (
    <StyledContainer>
      <Box
        display={"flex"}
        width={"100%"}
        justifyContent={"space-between"}
        maxWidth={"1425px"}
      >
        <Box width={"100%"}>
          <Box fontFamily={"ChakraPetchSemiBold"} fontSize={"30px"}>
            MIGRATE YOUR TOKENS
          </Box>
          <Box width={"100%"} maxWidth={"647px"} mt={"36px"}>
            <MigrateBox type={"from"} />
            <Box display={"flex"} justifyContent={"center"} my={"30px"}>
              <img src={"/icons/arrowdown.png"} />
            </Box>
            <MigrateBox type={"to"} />
          </Box>
        </Box>
        <Box width={"100%"} maxWidth={"647px"}>
          <Box fontFamily={"ChakraPetchSemiBold"} fontSize={"30px"}>
            IMPACT XP VALUE
          </Box>
          <Box mt={"36px"}>
            <PricePanel
              price={priceFormat(price).value}
              zcount={priceFormat(price).count}
              version={3}
            />
            <Box display={"flex"} justifyContent={"center"} my={"30px"}>
              <img src={"/icons/arrowdown.png"} />
            </Box>
            <PricePanel price={"00"} zcount={0} version={4} />
          </Box>
          <Box mt={"93px"}>
            <Box
              fontFamily={"ChakraPetchSemiBold"}
              fontSize={"30px"}
              color={"#C31B1F"}
            >
              NEED MORE HELP?
            </Box>
            <Box
              fontFamily={"ChakraPetch"}
              fontSize={"20px"}
              lineHeight={"130%"}
              mt={"26px"}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. <br />{" "}
              <br />
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </Box>
          </Box>
        </Box>
      </Box>
      <Box mt={"100px"} width={"100%"} maxWidth={"1425px"}>
        <History histories={histories} />
      </Box>
    </StyledContainer>
  );
};

const StyledContainer = styled(Box)`
  padding: 16px 40px 86px 118px;
  width: 100%;
`;

export default Migrate;
