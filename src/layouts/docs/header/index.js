import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
import DefaultNavbarMobile from "layouts/docs/header/DefaultNavbarMobile";
import breakpoints from "assets/theme/base/breakpoints";
import { useMaterialUIController } from "context";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import RefreshIcon from '@mui/icons-material/Refresh';
// import { VerifiedOutlined } from "@mui/icons-material";
import DragHandleIcon from '@mui/icons-material/DragHandle';
function DefaultNavbar({ transparent, light, action, selectedDocs }) {
    const [controller] = useMaterialUIController();
    const { darkMode } = controller;

    const [mobileNavbar, setMobileNavbar] = useState(false);
    const [mobileView, setMobileView] = useState(false);

    const openMobileNavbar = ({ currentTarget }) => setMobileNavbar(currentTarget.parentNode);
    const closeMobileNavbar = () => setMobileNavbar(false);

    useEffect(() => {
        function displayMobileNavbar() {
            if (window.innerWidth < breakpoints.values.lg) {
                setMobileView(true);
                setMobileNavbar(false);
            } else {
                setMobileView(false);
                setMobileNavbar(false);
            }
        }

        window.addEventListener("resize", displayMobileNavbar);
        displayMobileNavbar();

        return () => window.removeEventListener("resize", displayMobileNavbar);
    }, []);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {

        setAnchorEl(null);
    };

    return (
        <Container>
            <MDBox
                py={1}
                px={{ xs: 4, sm: transparent ? 2 : 3, lg: transparent ? 0 : 2 }}
                my={3}
                mx={3}
                width="calc(100% - 48px)"
                borderRadius="lg"
                shadow={transparent ? "none" : "md"}
                color={light ? "white" : "dark"}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                position="absolute"
                left={0}
                zIndex={3}
                sx={({ palette: { transparent: transparentColor, white, background }, functions: { rgba } }) => ({
                    backgroundColor: transparent
                        ? transparentColor.main
                        : rgba(darkMode ? background.sidenav : white.main, 0.8),
                    backdropFilter: transparent ? "none" : `saturate(200%) blur(30px)`,
                })}
            >
                <MDBox color="inherit" display={{ xs: "none", lg: "flex" }} m={0} p={0}>
                    <div style={{ cursor: "pointer", display: 'flex', alignItems: 'center' }} onClick={handleMenuOpen}>
                        <DefaultNavbarLink name={selectedDocs} light={light} /> <ArrowDropDownIcon />
                    </div>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin" route="/docs/payin" light={light} />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin Intent" route="/docs/payin-intent" light={light} />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin Page Request" route="/docs/payin-page-request" light={light} />
                        </MenuItem>
                        {/* <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin Collect" route="/docs/payin-collect" light={light} />
                        </MenuItem> */}
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Fetch Payin Status" route="/docs/payin-status" light={light} />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Payout" route="/docs/payout" light={light} />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Fetch Payout Status" route="/docs/payout-status" light={light} />
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose}>
                            <DefaultNavbarLink icon={<DragHandleIcon />} name="Callback & Verify Transaction" route="/docs/callback-verify" light={light} />
                        </MenuItem>

                    </Menu>
                </MDBox>
                <MDBox
                    component={Link}
                    to="/docs"
                    py={transparent ? 1.5 : 0.75}
                    lineHeight={1}
                    pr={{ xs: 0, lg: 1 }}
                >
                    <MDTypography variant="button" fontWeight="bold" color={light ? "white" : "dark"}>
                        Docs
                    </MDTypography>
                </MDBox>

                <MDBox
                    display={{ xs: "inline-block", lg: "none" }}
                    lineHeight={0}
                    py={1.5}
                    pl={1.5}
                    color="inherit"
                    sx={{ cursor: "pointer" }}
                    onClick={openMobileNavbar}
                >
                    <Icon fontSize="default">{mobileNavbar ? "close" : "menu"}</Icon>
                </MDBox>
            </MDBox>
            {mobileView && <DefaultNavbarMobile open={mobileNavbar} close={closeMobileNavbar} />}
        </Container>
    );
}

DefaultNavbar.defaultProps = {
    transparent: false,
    light: false,
    action: false,
};

DefaultNavbar.propTypes = {
    transparent: PropTypes.bool,
    light: PropTypes.bool,
    action: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.shape({
            type: PropTypes.oneOf(["external", "internal"]).isRequired,
            route: PropTypes.string.isRequired,
            color: PropTypes.oneOf(["primary", "secondary", "info", "success", "warning", "error", "dark", "light"]),
            label: PropTypes.string.isRequired,
        }),
    ]),
    selectedDocs: PropTypes.string.isRequired
};

export default DefaultNavbar;
