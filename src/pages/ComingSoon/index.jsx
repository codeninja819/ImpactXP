import { Box } from "@mui/material";
import styled from "styled-components";

const ComingSoon = () => {
  return <StyledContainer>COMING SOON</StyledContainer>;
};

const StyledContainer = styled(Box)`
  display: flex;
  width: 100%;
  height: calc(100vh - 500px);
  justify-content: center;
  align-items: center;
  font-size: 72px;
  font-family: "ChakraPetchBold";
`;

export default ComingSoon;
