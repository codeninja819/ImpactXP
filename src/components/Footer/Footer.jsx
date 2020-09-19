import React from "react";
import styled from "styled-components";
import { Box } from "@mui/material";

const Footer = ({ hamburger }) => {
  const socials = [
    {
      url: "/icons/twitter.png",
      link: "https://mobile.twitter.com/warpigstoken?s=21&t=gkTSIkMZ6pRU0q3KNcb04w",
    },
    {
      url: "/icons/telegram.png",
      link: "https://t.me/wptwarpigstoken",
    },
    {
      url: "/icons/discord.png",
      link: "https://discord.gg/MQu5cR9Z",
    },

    {
      url: "/icons/website.png",
      link: "https://www.warpigs.io/",
    },
  ];
  return (
    <StyledContainer hamburger={hamburger}>
      {socials.map((data, i) => {
        return (
          <a href={data.link} target={"_blank"} rel="noreferrer" key={i}>
            <Social>
              <img src={`${data.url}`} alt={""} />
            </Social>
          </a>
        );
      })}
    </StyledContainer>
  );
};

const Social = styled(Box)`
  display: flex;
  justify-content: center;
  cursor: pointer;
  opacity: 0.45;
  transition: all 0.3s;
  :hover {
    opacity: 1;
  }
`;

const StyledContainer = styled(Box)`
  width: calc(100%);
  padding: 37px;
  background: rgba(0, 0, 0, 0.2);
  justify-content: space-between;
  display: flex;
  @media screen and (min-width: 900px) {
    display: none;
  }
`;

export default Footer;
