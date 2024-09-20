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

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Menu from "@mui/material/Menu";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import { VerifiedOutlined } from "@mui/icons-material";
// Material Dashboard 2 React example components
import DefaultNavbarLink from "examples/Navbars/DefaultNavbar/DefaultNavbarLink";
// import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
// import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
// import RefreshIcon from '@mui/icons-material/Refresh';
import DragHandleIcon from '@mui/icons-material/DragHandle';
function DefaultNavbarMobile({ open, close }) {
    const { width } = open && open.getBoundingClientRect();

    return (
        <Menu
            getContentAnchorEl={null}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "center",
            }}
            anchorEl={open}
            open={Boolean(open)}
            onClose={close}
            MenuListProps={{ style: { width: `calc(${width}px - 4rem)` } }}
        >
            <MDBox px={0.5}>

                <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin" route="/docs/payin" />
                <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin Intent" route="/docs/payin-intent" />
                <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin Page Request" route="/docs/payin-page-request" />
                {/* <DefaultNavbarLink icon={<DragHandleIcon />} name="Payin Collect" route="/docs/payin-collect" /> */}
                <DefaultNavbarLink icon={<DragHandleIcon />} name="Fetch Payin Status" route="/docs/payin-status" />
                <DefaultNavbarLink icon={<DragHandleIcon />} name="Payout" route="/docs/payout" />
                <DefaultNavbarLink icon={<DragHandleIcon />} name="Fetch Payout Status" route="/docs/payout-status" />
                <DefaultNavbarLink icon={<DragHandleIcon />} name="Callback & Verify Transaction" route="/docs/callback-verify" />

            </MDBox>
        </Menu>
    );
}

// Typechecking props for the DefaultNavbarMenu
DefaultNavbarMobile.propTypes = {
    open: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).isRequired,
    close: PropTypes.oneOfType([PropTypes.func, PropTypes.bool, PropTypes.object]).isRequired,
};

export default DefaultNavbarMobile;
