import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import Image from "react-bootstrap/Image";
import React from "react";
import Nav from "react-bootstrap/Nav";
import { XSquare } from "react-bootstrap-icons";
import { useDispatch, connect } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import CustomDropdownToggle from "../Utilities/CustomDropdownToggle";
import DefaultAvatar from "../Components/DefaultAvatar";
import imgPlaceholder from "../Assets/11Ratio.png";
import { logout } from "../Utilities/Store/authReducer/authSlice";

import "./Header.scss";

const Header = ({ restaurantName, logo, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const adminRoutes = {
    "/app/admin/table-analytics": (
      <Nav
        variant="tab"
        onSelect={(key) => navigate(key)}
        defaultActiveKey="/app/admin/table-analytics/spp"
      >
        <Nav.Item>
          <Nav.Link eventKey="/app/admin">
            <XSquare fontSize={24} />
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/spp">
            Sales Per Person
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/sph">
            Sales Per Hour
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/ts">
            Time Spent
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="/app/admin/table-analytics/tp">
            Tip Percentage
          </Nav.Link>
        </Nav.Item>
      </Nav>
    ),
    "/app/admin/menu-management": (
      <Nav
        variant="tab"
        onSelect={(key) => navigate(key)}
        defaultActiveKey="/app/admin/menu-management/category1"
      >
        <Nav.Item>
          <Nav.Link eventKey="/app/admin">
            <XSquare fontSize={24} />
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
      </Nav>
    ),
    "/app/admin/table-management": (
      <Nav
        variant="tab"
        onSelect={(key) => navigate(key)}
        defaultActiveKey="/app/admin/table-management/category1"
      >
        <Nav.Item>
          <Nav.Link eventKey="/app/admin">
            <XSquare fontSize={24} />
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
      </Nav>
    ),
    "/app/admin/sales-report": (
      <Nav
        variant="tab"
        onSelect={(key) => navigate(key)}
        defaultActiveKey="/app/admin/sales-report/sales"
      >
        <Nav.Item>
          <Nav.Link eventKey="/app/admin">
            <XSquare fontSize={24} />
          </Nav.Link>
        </Nav.Item>
      </Nav>
    ),
    "/app/admin/employee-management": (
      <Nav
        variant="tab"
        onSelect={(key) => navigate(key)}
        defaultActiveKey="/app/admin/employee-management/category1"
      >
        <Nav.Item>
          <Nav.Link eventKey="/app/admin">
            <XSquare fontSize={24} />
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
      </Nav>
    ),
  };

  const navigateTo = (eventKey, event) => {
    navigate(eventKey);
  };

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const launchSim = () => {
    dispatch(navigate("/app/game"));
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
                fullName={`${user.first_name} ${user.last_name}`}
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
          <Nav variant="tabs" defaultActiveKey="table" onSelect={navigateTo}>
            <Nav.Item>
              <Nav.Link eventKey="table">Table</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="game">Simulation</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="admin" disabled={user.authority_level < 2}>
                Administrator
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return { user: state.auth.user };
};

export default connect(mapStateToProps)(Header);
