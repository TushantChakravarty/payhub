/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// @mui material components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDBadge from "components/MDBadge";
import formatDateAndTime from "util/formatTimeAndDate";
import { Link } from "react-router-dom";
import { useMaterialUIController } from "context";
import { hideDigits } from "util/formatTimeAndDate";
import { Icon } from "@mui/material";
import { useState } from "react";
import { useSandbox } from "ZustandState/useSandbox";
import MDButton from "components/MDButton";
export default function data(transactions, isSearch, setOpenDialog, callbackValueSetter) {
    const [showAccountNumber, setShowAccountNumber] = useState(Array(transactions.length).fill(false));
    const sandbox = useSandbox((state) => state.sandbox)
    // Function to toggle the visibility of the account number for a specific row
    const toggleAccountNumberVisibility = (index) => {
        setShowAccountNumber(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });

    };
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    return {
        columns: isSearch && !sandbox ? [
            { Header: "time", accessor: "time", align: "left" },
            { Header: "date", accessor: "date", align: "left" },
            { Header: "amount", accessor: "amount", align: "right" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "Ac.No.", accessor: "accountNumber", align: 'left', },
            { Header: "Ac.Name", accessor: "accountName", align: 'left', },
            { Header: "IFSC", accessor: "ifsc", align: 'left', },
            { Header: "bank", accessor: "bank", align: 'left', },
            { Header: "UTR", accessor: "utr", width: "15%", },
            { Header: "TXID", accessor: "txid", width: "15%", },
            { Header: "Ticket", accessor: "ticket", width: "10%", },
        ] : sandbox ? [
            { Header: "time", accessor: "time", align: "left" },
            { Header: "date", accessor: "date", align: "left" },
            { Header: "amount", accessor: "amount", align: "right" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "Ac.No.", accessor: "accountNumber", align: 'left', },
            { Header: "Ac.Name", accessor: "accountName", align: 'left', },
            { Header: "IFSC", accessor: "ifsc", align: 'left', },
            { Header: "bank", accessor: "bank", align: 'left', },
            { Header: "UTR", accessor: "utr", width: "15%", },
            { Header: "TXID", accessor: "txid", width: "15%", },
            { Header: "Callback", accessor: "callback", align: "center", width: "10%" }
        ] : [
            { Header: "time", accessor: "time", align: "left" },
            { Header: "date", accessor: "date", align: "left" },
            { Header: "amount", accessor: "amount", align: "right" },
            { Header: "status", accessor: "status", align: "center" },
            { Header: "Ac.No.", accessor: "accountNumber", align: 'left', },
            { Header: "Ac.Name", accessor: "accountName", align: 'left', },
            { Header: "IFSC", accessor: "ifsc", align: 'left', },
            { Header: "bank", accessor: "bank", align: 'left', },
            { Header: "UTR", accessor: "utr", width: "15%", },
            { Header: "TXID", accessor: "txid", width: "15%", },
        ],


        rows: transactions && transactions.map((item, index) => ({
            time: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {formatDateAndTime(item?.transaction_date).formattedTime || ''}
                </MDTypography>
            ),
            date: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {formatDateAndTime(item.transaction_date).formattedDate || ''}
                </MDTypography>
            ),
            amount: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {item?.amount || ''}
                </MDTypography>
            ),
            bank: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {item?.bank_name || ''}
                </MDTypography>
            ),
            accountNumber: item?.account_number ? (
                <MDBox alignItems="center" display="flex" flexDirection="row">
                    <MDTypography pr={1} variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                        {showAccountNumber[index] ? item?.account_number : hideDigits(item?.account_number)}
                    </MDTypography>
                    {
                        showAccountNumber[index] ? (
                            <Icon fontSize="small" onClick={() => toggleAccountNumberVisibility(index)}>visibility_off</Icon>
                        ) : (
                            <Icon fontSize="small" onClick={() => toggleAccountNumberVisibility(index)}>visibility</Icon>
                        )
                    }
                </MDBox>
            ) : (
                null
            ),
            ifsc: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {item?.ifsc_code || ''}
                </MDTypography>
            ),
            accountName: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {item?.account_name || ''}
                </MDTypography>
            ),
            status: (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={item?.status === "IN-PROCESS" ? "PENDING" : item.status === "fail" ? "FAILED" : item.status} color={item?.status === "Success" || item?.status === "success" || item?.status === "SUCCESS" ? "success" : item?.status === "IN-PROCESS" || item.status === "pending" ? "warning" : item?.status === "PENDING" ? "warning" : "error"} variant="gradient" size="sm" />
                </MDBox>
            ),
            utr: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {item?.utr || ''}
                </MDTypography>
            ),
            txid: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {item?.transactionId || ''}
                </MDTypography>
            ),
            callback: sandbox ? (
                <MDButton onClick={() => {
                    let values = {
                        transaction_id: item?.transactionId,
                        amount: item?.amount
                    }
                    callbackValueSetter(values)
                    setOpenDialog(true)
                }} size="small" color="info">
                    Send Callback
                </MDButton>
            ) : null,
            ticket: isSearch ? (
                <Link to="/support" state={{ data: item, type: "dashboard" }}>
                    <MDTypography
                        component="a"
                        variant="caption"
                        color="info"
                        fontWeight="medium"
                        style={{
                            borderBottom: '1px solid', // Adding a border instead of underline
                            paddingBottom: '2px', // Adjusting padding to mimic underline position
                            cursor: 'pointer',
                        }}
                    >
                        Raise Ticket
                    </MDTypography>
                </Link>
            ) : null,
        }))
    }
}
