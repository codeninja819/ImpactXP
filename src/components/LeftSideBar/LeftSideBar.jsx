/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/alt-text */
import { Box } from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useState } from "react";

function LeftSideBar({ curpage, setCurPage }) {
  const [active, setActive] = useState(4);
  const socials = [
    {
      url: "/icons/facebook.png",
      link: "",
    },
    {
      url: "/icons/twitter.png",
      link: "",
    },
    {
      url: "/icons/telegram.png",
      link: "",
    },
    {
      url: "/icons/instagram.png",
      link: "",
    },
    {
      url: "/icons/discord.png",
      link: "",
    },
    {
      url: "/icons/youtube.png",
      link: "",
    },
  ];
  return (
    <>
      <StyledContainer>
        <Menus active={active}>
          <Link to={"/home"} onClick={() => setActive(1)}>
            <Box>OVERVIEW</Box>
          </Link>
          <Link to={"/staking"} onClick={() => setActive(2)}>
            <Box>STAKING</Box>
          </Link>
          <Link to={"/farming"} onClick={() => setActive(3)}>
            <Box>FARMING</Box>
          </Link>
          <Link to={"/migrate"} onClick={() => setActive(4)}>
            <Box>MIGRATE</Box>
          </Link>
        </Menus>
        <Socials>
          <Box>
            {socials.map((data) => {
              return (
                <SocialItem>
                  <img src={data.url} />
                </SocialItem>
              );
            })}
          </Box>
        </Socials>
      </StyledContainer>
    </>
  );
}

const SocialItem = styled.a`
  opacity: 0.5;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 32px;
  :hover {
    transform: scale(1.1, 1.1);
    opacity: 1;
  }
`;

const Socials = styled(Box)`
  position: ${({ fixed }) => (fixed ? "fixed" : "absolute")};
  left: 0;
  top: ${({ fixed }) => (fixed ? "unset" : "450px")};
  bottom: ${({ fixed }) => (fixed ? "0" : "unset")};
  filter: drop-shadow(5px 0px 20px rgba(0, 0, 0, 0.45));
  > div {
    padding-top: 290px;
    background: #c31b1f;
    width: 84px;
    height: 755px;
    clip-path: polygon(0% 0%, 100% 4%, 100% 96%, 0% 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const Menus = styled(Box)`
  display: flex;
  flex-direction: column;
  > a {
    font-family: "ChakraPetchBold";
    font-size: 18px;
    margin-bottom: 28px;
    padding: 16px 80px;
    cursor: pointer;
    color: white;
    transform: skew(-20deg);
    margin-left: -12px;
    transition: all 0.3s;
    :hover {
      background: linear-gradient(
        135deg,
        rgba(162, 162, 162, 0.3),
        rgba(95, 95, 95, 0.3)
      );
      box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.16);
    }
  }
  > a > div {
    transform: skew(20deg);
  }
  > a:nth-child(${({ active }) => active}) {
    background: linear-gradient(135deg, #a2a2a2, #5f5f5f);
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.16);
  }
`;

const StyledContainer = styled(Box)`
  height: 100%;
`;

export default LeftSideBar;
