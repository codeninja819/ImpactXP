/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import ConnectMenu from "./ConnectMenu.jsx";
import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import Button from "../Button";

function TopBar({ setNotification, curpage, setCurPage }) {
  const [, setDropDownOpen] = useState(false);

  const dialog = useRef();

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (dialog && dialog.current && !dialog.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    });
  }, []);

  return (
    <StyledContainer>
      <Box
        display={"flex"}
        minWidth={"290px"}
        minHeight={"90px"}
        maxWidth={"290px"}
        maxHeight={"90px"}
      >
        <img src={"/logotext.png"} width={"100%"} height={"100%"} alt={""} />
      </Box>
      <Box display={"flex"}>
        <Button type={"buy"} width={"173px"} height={"50px"}>
          BUY IMPACTXP
        </Button>
        <Box mr={"40px"} />
        <ConnectMenu />
      </Box>
    </StyledContainer>
  );
}

const StyledContainer = styled(Box)`
  padding: 58px 123px 144px 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export default TopBar;
