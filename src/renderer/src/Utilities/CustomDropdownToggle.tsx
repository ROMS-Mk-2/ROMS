import React from "react";
import styled from "styled-components";

const StyledToggleA = styled.a`
  text-decoration: none;
  display: inline;
`;

type ToggleProps = {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {};
};

const CustomDropdownToggle = React.forwardRef(
  (props: ToggleProps, ref: React.Ref<HTMLAnchorElement>) => (
    <StyledToggleA
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        if (props.onClick) props.onClick(e);
      }}
    >
      {props.children}
    </StyledToggleA>
  )
);

export default CustomDropdownToggle;
