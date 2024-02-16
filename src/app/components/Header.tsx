import React from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "@dynatrace/strato-components-preview";
import { type AppCompProps } from "types";

const Header: React.FC<AppCompProps> = () => {
  return (
    <AppHeader>
      <AppHeader.NavItems>
        <AppHeader.AppNavLink as={Link} to="/" />
        <AppHeader.NavItem as={Link} to="/data">
          Visualizations
        </AppHeader.NavItem>
      </AppHeader.NavItems>
    </AppHeader>
  );
};

export default Header;
