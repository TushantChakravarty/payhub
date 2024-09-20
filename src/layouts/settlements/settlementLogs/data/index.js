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
import formatTimeAndDate from "util/formatTimeAndDate";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useMaterialUIController } from "context";
export default function data(logs, downloadInvoice) {
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    return {
        columns: [
            { Header: "No.", accessor: "no", width: '4%', align: "left" },
            { Header: "Time", accessor: "time", width: '10%', align: "left" },
            { Header: "Date", accessor: "date", width: '10%', align: "left" },
            { Header: "Gross Volume", accessor: "grossVolume", width: '10%', align: "right" },
            { Header: "Fees", accessor: "fees", width: '10%', align: "right" },
            { Header: "Net Volume", accessor: "netVolume", width: '10%', align: "right" },
            { Header: "USDT Net", accessor: "usdt", width: '10%', align: "right" },
            { Header: "Ref", accessor: "ref", width: '10%', align: "left" },
            // { Header: "Notes", accessor: "notes", align: "left" },
            { Header: "Invoice", width: '5%', accessor: "invoice", align: "right" },
        ],

        rows: logs && logs.map((row, index) => ({
            no: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {row?.txIndex + 1}
                </MDTypography>
            ),
            time: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {formatTimeAndDate(row?.transaction_date).formattedTime || ''}
                </MDTypography>
            ),
            date: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {formatTimeAndDate(row?.transaction_date).formattedDate || ''}
                </MDTypography>
            ),
            grossVolume: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.amount).toFixed(0)}
                </MDTypography>
            ),
            fees: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.feeCharged).toFixed(0)}
                </MDTypography>
            ),
            netVolume: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.amountSettled).toFixed(0)}
                </MDTypography>
            ),
            usdt: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.usdt).toFixed(0)}
                </MDTypography>
            ),
            ref: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {row?.ref_no}
                </MDTypography>
            ),
            // notes: (
            //     <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
            //         {row?.notes}
            //     </MDTypography>
            // ),
            invoice: (
                <FileDownloadOutlinedIcon onClick={() => downloadInvoice(row)} sx={{ cursor: "pointer", fontWeight: "bold" }} color={darkMode ? "white" : "black"} fontSize="medium" />
            ),
        }))
    }
}
