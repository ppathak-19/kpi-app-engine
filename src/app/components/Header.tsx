import { AppHeader } from "@dynatrace/strato-components-preview";
import React from "react";
import { Link } from "react-router-dom";
import type { AppCompProps } from "types";
import { appRoutes } from "../constants/AppRoutes";

const Header: React.FC<AppCompProps> = () => {
  return (
    <AppHeader>
      <AppHeader.NavItems>
        {appRoutes.map((eachRoute) => (
          <AppHeader.NavItem as={Link} to={eachRoute.path} key={eachRoute.path}>
            {eachRoute.label}
          </AppHeader.NavItem>
        ))}
      </AppHeader.NavItems>
    </AppHeader>
  );
};

export default Header;
