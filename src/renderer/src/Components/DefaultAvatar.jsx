import React from "react";
import styled from "styled-components";

const StyledAvatarContainer = styled.div.attrs((props) => ({
  width: props.width || 50,
  height: props.height || 50,
}))`
  background-color: #e67e22;
  width: ${(props) => props.width}px;
  height: ${(props) => props.height}px;
  font: ${(props) => props.width / 3}px Helvetica;
  color: #fff;
  text-align: center;
  line-height: ${(props) => props.height}px;
  border-radius: 50%;
  user-select: none;
  &:hover {
    cursor: pointer;
  }
`;

const DefaultAvatar = ({ className, fullName, width, height, onClick }) => {
  const initial =
    fullName.split(" ")[0].charAt(0).toUpperCase() +
    fullName.split(" ")[1].charAt(0).toUpperCase();
  return (
    <StyledAvatarContainer
      className={className}
      onClick={onClick}
      width={width}
      height={height}
    >
      {initial}
    </StyledAvatarContainer>
  );
};

export default DefaultAvatar;
