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
// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import { useMaterialUIController } from "context";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

function DefaultProjectCard({ business, name, email, sandUrl = false, btn }) {
  const [controller] = useMaterialUIController();
  const {
    darkMode,
  } = controller;
  return (
    <MDBox mt={1} mx={0.5} ml={3}>
      <MDBox mb={1}>
        <MDBox display="flex" flexDirection="column" mb={1}>
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="h6" color={darkMode ? 'white' : 'black'} textTransform="capitalize">
              Business:
            </MDTypography>
            <MDTypography color="text" variant="caption" fontWeight="medium" textTransform="capitalize" ml={3}>
              {business}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="h6" color={darkMode ? 'white' : 'black'} textTransform="capitalize">
              Email:
            </MDTypography>
            <MDTypography color="text" variant="caption" fontWeight="medium" ml={6}>
              {email}
            </MDTypography>
          </MDBox>
          <MDBox display="flex" alignItems="center">
            <MDTypography variant="h6" color={darkMode ? 'white' : 'black'} textTransform="capitalize">
              Name:
            </MDTypography>
            <MDTypography color="text" variant="caption" fontWeight="medium" textTransform="capitalize" ml={6}>
              {name}
            </MDTypography>
          </MDBox>
        </MDBox>
      </MDBox>
      <MDBox mt={3} display="flex" justifyContent="space-between" alignItems="center">
        {
          sandUrl &&
          <MDButton
            rel="noreferrer"
            size="small"
            color="success"
            onClick={() => btn(true)}
          >
            Add Topup
          </MDButton>
        }

      </MDBox>
    </MDBox>

  );
}



// Typechecking props for the DefaultProjectCard
DefaultProjectCard.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  business: PropTypes.string,
  sandUrl: PropTypes.bool,
  btn: PropTypes.func,
};

export default DefaultProjectCard;
