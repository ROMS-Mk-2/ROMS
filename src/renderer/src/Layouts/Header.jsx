import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";
import DropdownItem from "react-bootstrap/DropdownItem";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import DefaultAvatar from "../Components/DefaultAvatar";
import CustomDropdownToggle from "../Utilities/CustomDropdownToggle";
import imgPlaceholder from "../Assets/11Ratio.png";
import { logout } from "../Utilities/Store/authReducer/authSlice";

import "./Header.scss";

const Header = ({ restaurantName, logo, user }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateTo = (eventKey, event) => {
    switch (eventKey) {
      case "table":
        navigate("/app/table");
        break;
      case "admin":
        navigate("/app/admin");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };
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
        <Tabs defaultActiveKey="table" onSelect={navigateTo}>
          <Tab eventKey="table" title="Table"></Tab>
          <Tab eventKey="admin" title="Administrator"></Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Header;
