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
import { capitalizeFirstLetter } from "util/formatTimeAndDate";

function DefaultInfoCard({ amount, txStatus, txId, txDate, category, subject, }) {
    const [controller] = useMaterialUIController();
    const {
        darkMode,
    } = controller;
    return (

        <MDBox mt={1} mx={0.5} ml={3}>
            <MDBox mb={1}>
                <MDBox display="flex" flexDirection="column" mb={1}>
                    <MDBox display="flex" alignItems="center">
                        <MDTypography variant="caption" fontWeight="medium" color="text" textTransform="capitalize" mb={0.5}>
                            Query Type:
                        </MDTypography>
                        <MDTypography color={darkMode ? 'white' : 'black'} variant="caption" fontWeight="medium" textTransform="capitalize" ml={1} mb={0.5}>
                            {capitalizeFirstLetter(category)}
                        </MDTypography>
                    </MDBox>
                    {
                        category === "finance" &&
                        <MDBox display="flex" alignItems="center">
                            <MDTypography variant="caption" fontWeight="medium" color="text" textTransform="capitalize" mb={0.5}>
                                TxID:
                            </MDTypography>
                            <MDTypography color={darkMode ? 'white' : 'black'} variant="caption" fontWeight="medium" textTransform="capitalize" ml={5.8} mb={0.5}>
                                {txId}
                            </MDTypography>
                        </MDBox>
                    }
                    {
                        category === "finance" &&
                        <MDBox display="flex" alignItems="center">
                            <MDTypography variant="caption" fontWeight="medium" color="text" textTransform="capitalize" mb={0.5}>
                                Amount:
                            </MDTypography>
                            <MDTypography color={darkMode ? 'white' : 'black'} variant="caption" fontWeight="medium" textTransform="capitalize" ml={3.5} mb={0.5}>
                                {amount}
                            </MDTypography>
                        </MDBox>
                    }
                    {
                        category === "finance" &&
                        <MDBox display="flex" alignItems="center">
                            <MDTypography variant="caption" fontWeight="medium" color="text" textTransform="capitalize" mb={0.5}>
                                Date:
                            </MDTypography>
                            <MDTypography color={darkMode ? 'white' : 'black'} variant="caption" fontWeight="medium" textTransform="capitalize" ml={5.8} mb={0.5}>
                                {txDate}
                            </MDTypography>
                        </MDBox>
                    }
                    {
                        category === "finance" &&
                        <MDBox display="flex" alignItems="center">
                            <MDTypography variant="caption" fontWeight="medium" color="text" textTransform="capitalize" mb={0.5}>
                                TxStatus:
                            </MDTypography>
                            <MDTypography color={darkMode ? 'white' : 'black'} variant="caption" fontWeight="medium" textTransform="capitalize" ml={2.5} mb={0.5}>
                                {txStatus}
                            </MDTypography>
                        </MDBox>
                    }
                    {
                        category === "technical" &&
                        <MDBox display="flex" alignItems="center">
                            <MDTypography variant="caption" fontWeight="medium" color="text" textTransform="capitalize" mb={0.5}>
                                Subject:
                            </MDTypography>
                            <MDTypography color={darkMode ? 'white' : 'black'} variant="caption" fontWeight="medium" textTransform="capitalize" ml={4} mb={0.5}>
                                {subject}
                            </MDTypography>
                        </MDBox>
                    }
                </MDBox>
            </MDBox>
        </MDBox>

    );
}



// Typechecking props for the DefaultProjectCard
DefaultInfoCard.propTypes = {
    amount: PropTypes.string,
    txStatus: PropTypes.string,
    txId: PropTypes.string,
    txDate: PropTypes.string,
    category: PropTypes.string,
    subject: PropTypes.string
};

export default DefaultInfoCard;
