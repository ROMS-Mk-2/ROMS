import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Nav from "react-bootstrap/Nav";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import DefaultAvatar from "../Components/DefaultAvatar";
import CustomDropdownToggle from "../Utilities/CustomDropdownToggle";
import imgPlaceholder from "../Assets/11Ratio.png";
import { logout } from "../Utilities/Store/authReducer/authSlice";

import "./Header.scss";

const Header = ({ restaurantName, logo, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const adminRoutes = {
    "/app/admin/table-analytics": (
      <>
        <Nav.Item>
          <Nav.Link onClick={() => navigate("/app/admin/")}>
            Table Analytics
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/category1">
            Category 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/category2">
            Category 2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/category3">
            Category 3
          </Nav.Link>
        </Nav.Item>
      </>
    ),
    "/app/admin/menu-management": (
      <>
        <Nav.Item>
          <Nav.Link onClick={() => navigate("/app/admin/")}>
            Menu Management
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/menu-management/category1">
            Category 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/menu-management/category2">
            Category 2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/menu-management/category3">
            Category 3
          </Nav.Link>
        </Nav.Item>
      </>
    ),
    "/app/admin/table-management": (
      <>
        <Nav.Item>
          <Nav.Link onClick={() => navigate("/app/admin/")}>
            Table Management
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-management/category1">
            Category 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-management/category2">
            Category 2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-management/category3">
            Category 3
          </Nav.Link>
        </Nav.Item>
      </>
    ),
    "/app/admin/sales-report": (
      <>
        <Nav.Item>
          <Nav.Link onClick={() => navigate("/app/admin/")}>
            Sales Report
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/sales-report/category1">
            Category 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/sales-report/category2">
            Category 2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/sales-report/category3">
            Category 3
          </Nav.Link>
        </Nav.Item>
      </>
    ),
    "/app/admin/employee-management": (
      <>
        <Nav.Item>
          <Nav.Link onClick={() => navigate("/app/admin/")}>
            Employee Management
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/employee-management/category1">
            Category 1
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/employee-management/category2">
            Category 2
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/employee-management/category3">
            Category 3
          </Nav.Link>
        </Nav.Item>
      </>
    ),
  };

  const navigateTo = (eventKey, event) => {
    navigate(eventKey);
  };

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const isAdminRoute = Object.keys(adminRoutes).some((route) =>
    location.pathname.startsWith(route)
  );

  return (
    <>
      <div className="app-header-container">
        <div className="app-header">
          <div className="restaurant-info">
            <Image className="restaurant-logo" src={logo || imgPlaceholder} />
            <p className="restaurant-name">
              {restaurantName || "[Restaurant Name]"}
            </p>
          </div>
          <Dropdown>
            <DropdownToggle as={CustomDropdownToggle}>
              <DefaultAvatar
                className="avatar-icon"
                fullName={"Corentin Favier"}
                width={50}
                height={50}
              />
            </DropdownToggle>

            <DropdownMenu>
              <DropdownItem>View Profile</DropdownItem>
              <DropdownItem>Clock Out</DropdownItem>
              <DropdownItem onClick={() => onLogout()}>Logout</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {isAdminRoute ? (
          <Nav variant="tabs" onSelect={(key) => navigate(key)}>
            {Object.entries(adminRoutes).map(
              ([route, navItems]) =>
                location.pathname.startsWith(route) && (
                  <React.Fragment key={route}>{navItems}</React.Fragment>
                )
            )}
          </Nav>
        ) : (
          <Tabs defaultActiveKey="table" onSelect={navigateTo}>
            <Tab eventKey="table" title="Table"></Tab>
            <Tab eventKey="admin" title="Administrator"></Tab>
          </Tabs>
        )}
      </div>
    </>
  );
};

export default Header;
