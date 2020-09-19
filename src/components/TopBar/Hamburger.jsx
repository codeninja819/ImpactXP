/* eslint-disable jsx-a11y/alt-text */
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./menu.css";
import { Box } from "@mui/material";
import styled from "styled-components";

const Hamburger = ({ curpage, setCurPage }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    document.addEventListener("mouseup", function (event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        let form = document.getElementById("check");
        if (form) form.checked = false;
      }
    });
  }, []);

  const icons = ["/icons/home.png", "/icons/staking.png", "/icons/farming.png"];

  const texts = ["Home", "Staking", "Farming"];

  const links = ["/", "/staking", "/farming"];

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
    <nav role="navigation">
      <div id="menuToggle" ref={menuRef}>
        {/* A fake / hidden checkbox is used as click reciever,
    so you can use the :checked selector on it. */}

        <input type="checkbox" id="check" />

        {/* Some spans to act as a hamburger.
    
    They are acting like a real hamburger,
    not that McDonalds stuff. */}

        <span></span>
        <span></span>
        <span></span>

        {/* Too bad the menu has to be inside of the button
    but hey, it's pure CSS magic. */}

        <Menu id="menu">
          <LineVector />
          <Vector />
          <Box display={"flex"} padding={"93px 0 47px 29px"}>
            <Box
              display={"flex"}
              minWidth={"202px"}
              minHeight={"110px"}
              maxWidth={"202px"}
              maxHeight={"110px"}
            >
              <img src={"/logotext.png"} width={"100%"} height={"100%"} />
            </Box>
          </Box>
          <MenuPanel>
            <IconPanel>
              {icons.map((data, i) => {
                return (
                  <Icon
                    to={links[i]}
                    onClick={() => {
                      setCurPage(i);
                      let form = document.getElementById("check");
                      if (form) form.checked = false;
                    }}
                    active={(curpage === i).toString()}
                    key={i}
                  >
                    <Box />
                    <img src={data} style={{ transform: "scale(0.8)" }} />
                  </Icon>
                );
              })}
            </IconPanel>
            <Panel>
              <TextPanel>
                {texts.map((data, i) => {
                  return (
                    <TextItem
                      to={links[i]}
                      onClick={() => {
                        setCurPage(i);
                        let form = document.getElementById("check");
                        if (form) form.checked = false;
                      }}
                      active={(curpage === i).toString()}
                      key={i}
                    >
                      {data}
                    </TextItem>
                  );
                })}
              </TextPanel>
            </Panel>
          </MenuPanel>
          <SocialPanel>
            {socials.map((data, i) => {
              return (
                <Social href={data.link} target={"_blank"} key={i}>
                  <img src={data.url} />
                </Social>
              );
            })}
          </SocialPanel>
        </Menu>
      </div>
    </nav>
  );
};

const Social = styled.a`
  opacity: 0.65;
  transition: all 0.3s;
  :hover {
    opacity: 1;
  }
`;

const SocialPanel = styled(Box)`
  position: absolute;
  bottom: 50px;
  left: 80px;
  width: calc(100vw - 80px);
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  z-index: 10;
`;

const Menu = styled.ul`
  font-family: "Inter";
`;

const LineVector = styled(Box)`
  background: linear-gradient(to left, #d9ed92, #168aad);
  position: absolute;
  height: 5px;
  top: 249px;
  width: 100%;
`;

const TextItem = styled(Link)`
  padding: 15px 0px 14px 28px;
  margin-top: 10px;
  transition: all 0.3s;

  color: white;
  text-decoration: none;
  height: 48px;
  background: ${({ active }) =>
    active === "true"
      ? "linear-gradient(to right, rgba(72,202,228,0.4), rgba(0,0,0,0))!important"
      : "transparent"};
  :hover {
    background: linear-gradient(
      to right,
      rgba(72, 202, 228, 0.1),
      rgba(0, 0, 0, 0)
    );
  }
`;

const TextPanel = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Panel = styled(Box)`
  padding-top: 34px;
  min-height: 100vh;
  height: 100%;
  width: 100%;
  background: transparent;
  z-index: 10;
`;

const Icon = styled(Link)`
  margin-top: 10px;
  cursor: pointer;
  position: relative;
  width: 100%;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  > div {
    position: absolute;
    left: 0;
    height: 100%;
    width: 10px;
    background: #168aad;
    display: ${({ active }) => (active === "true" ? "block" : "none")};
  }
`;

const IconPanel = styled(Box)`
  width: 80px;
  height: 100vh;
  background: #1d283c;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.36) inset;
  padding-top: 34px;
  display: flex;
  flex-direction: column;
`;

const MenuPanel = styled(Box)`
  display: flex;
  height: 100vh;
  overflow-y: hidden;
`;

const Vector = styled(Box)`
  position: absolute;
  background: url("/images/vector.png");
  background-size: 100% 100%;
  width: 305px;
  height: 484px;
  right: 14px;
  bottom: -49px;
  opacity: 0.07;
`;
export default Hamburger;
