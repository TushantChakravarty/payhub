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
import { useSandbox } from "ZustandState/useSandbox";
import MDButton from "components/MDButton";
export default function data(transactions, isSearch, setOpenDialog, callbackValueSetter) {
  const sandbox = useSandbox((state) => state.sandbox)

  const [controller] = useMaterialUIController()
  const { darkMode } = controller
  return {
    columns: isSearch && !sandbox ? [
      { Header: "time", accessor: "time", align: "left", width: "10%" },
      { Header: "date", accessor: "date", align: "left", width: "10%" },
      { Header: "amount", accessor: "amount", align: "right", width: "10%" },
      { Header: "status", accessor: "status", align: "center", width: "10%" },
      { Header: "username", accessor: "username", align: "left", width: "18%" },
      { Header: "UTR", accessor: "utr", align: "left", width: "15%", },
      { Header: "TXID", accessor: "txid", align: "left", width: "15%", },
      { Header: "Ticket", accessor: "ticket", align: "center", width: "5%", },
    ] : sandbox ? [
      { Header: "time", align: "left", width: "10%", accessor: "time", align: "left" },
      { Header: "date", align: "left", width: "10%", accessor: "date", align: "left" },
      { Header: "amount", accessor: "amount", width: "10%", align: "right" },
      { Header: "status", accessor: "status", align: "center", width: "10%" },
      { Header: "username", accessor: "username", align: "left", width: "18%" },
      { Header: "UTR", accessor: "utr", align: "left", width: "15%", },
      { Header: "TXID", accessor: "txid", align: "left", width: "15%", },
      { Header: "Callback", accessor: "callback", align: "center", width: "10%" }
    ] : [
      { Header: "time", align: "left", width: "10%", accessor: "time", align: "left" },
      { Header: "date", align: "left", width: "10%", accessor: "date", align: "left" },
      { Header: "amount", accessor: "amount", width: "10%", align: "right" },
      { Header: "status", accessor: "status", align: "center", width: "10%" },
      { Header: "username", accessor: "username", align: "left", width: "18%" },
      { Header: "UTR", accessor: "utr", align: "left", width: "15%", },
      { Header: "TXID", accessor: "txid", align: "left", width: "15%", },
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
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={item?.status === "IN-PROCESS" ? "PENDING" : item.status === "fail" ? "FAILED" : item.status} color={item?.status === "Success" || item?.status === "success" || item?.status === "SUCCESS" ? "success" : item?.status === "IN-PROCESS" || item.status === "pending" ? "warning" : item?.status === "PENDING" ? "warning" : item?.status === "expired" ? "info" : "error"} variant="gradient" size="sm" />
        </MDBox>
      ),
      username: (
        <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
          {item?.username || ''}
        </MDTypography>
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
