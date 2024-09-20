/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
// import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import MDTypography from "components/MDTypography";
import { toast } from 'react-toastify'
import { useConfig } from "../../../config"
import { Switch } from "@mui/material";
import { useSandbox } from "ZustandState/useSandbox";
function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const sandbox = useSandbox((state) => state.sandbox)
  const setSandbox = useSandbox((state) => state.setSandbox)
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const token = localStorage.getItem('user_token')
  const apiKey = localStorage.getItem('user_apiKey');
  const userEmail = localStorage.getItem('user_email')
  const { apiUrl } = useConfig()
  const [user, setUser] = useState()
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
      sx={{ mt: 2 }}
    >
      <Link to={'/docs'}>
        <NotificationItem icon={<Icon>book</Icon>} title="Api Docs" />
      </Link>
      <Link to={'/add-callback'}>
        <NotificationItem icon={<Icon>link</Icon>} title="Callback Url" />
      </Link>
      <Link to={'/add-redirect'}>
        <NotificationItem icon={<Icon>link</Icon>} title="Redirect Url" />
      </Link>
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  async function getProfile(body) {
    try {
      const response = await fetch(`${apiUrl}/user/getprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': apiKey || ''
        },
        body: JSON.stringify(body)
      });
      const res = await response.json();
      if (res.responseCode === 403) {
        toast.error(res?.responseMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
        localStorage.removeItem('user_token');
        navigate('/authentication/sign-in');
      }
      if (res.responseCode !== 200) {
        return;
      }
      if (res?.responseData) {
        setUser(res?.responseData)
      }
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    let body = {
      emailId: userEmail
    }
    getProfile(body)
  }, [])
  const handleSandboxSwitch = async () => {
    await setSandbox(!sandbox)
  }

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
            <Icon sx={iconsStyle}>account_circle</Icon>
            <MDTypography
              variant="button"
              fontWeight="light"
              color="dark"
              ml={1}
              fontSize="large"
            >
              {user && user.business_name || ''}
            </MDTypography>
          </Link>

          {/* <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} /> */}
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            {/* <MDBox pr={1}>
              <MDInput label="Search here" />
            </MDBox> */}
            <MDBox color={light ? "white" : "inherit"}>
              <MDBox
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={3}
                lineHeight={1}
              >
                <MDTypography variant="h6">Sandbox</MDTypography>

                <Switch checked={sandbox} onChange={handleSandboxSwitch} />
              </MDBox>
              {/* <Link to="/profile">
                <IconButton sx={navbarIconButton} size="small" disableRipple>
                  <Icon sx={iconsStyle}>account_circle</Icon>
                </IconButton>
              </Link> */}
              <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                <Icon sx={iconsStyle} fontSize="medium">
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <Icon sx={iconsStyle}>settings</Icon>
              </IconButton> */}
              {/* <IconButton
                size="small"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-controls="notification-menu"
                aria-haspopup="true"
                variant="contained"
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>integration_instructions</Icon>
              </IconButton>
              {renderMenu()} */}
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool
};

export default DashboardNavbar;
