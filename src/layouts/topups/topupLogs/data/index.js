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
            { Header: "Gross Topup", accessor: "grossTopup", width: '10%', align: "right" },
            { Header: "Net Fees", accessor: "netfees", width: '10%', align: "right" },
            { Header: "Net Topup", accessor: "netTopup", width: '10%', align: "right" },
            { Header: "USDT Rate", accessor: "usdtRate", width: '10%', align: "right" },
            { Header: "USDT Net", accessor: "netUsdt", width: '10%', align: "right" },
            { Header: "Ref", accessor: "ref", width: '10%', align: "left" },
            // { Header: "Notes", accessor: "notes", align: "left" },
            { Header: "Invoice", width: '5%', accessor: "invoice", align: "right" },
        ],

        rows: logs && logs.map((row, index) => ({
            no: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {row?.txIndex}
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
            grossTopup: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.grossAmount).toFixed(0)}
                </MDTypography>
            ),
            netfees: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.netFees).toFixed(2)}
                </MDTypography>
            ),
            netTopup: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.payoutBalance).toFixed(2)}
                </MDTypography>
            ),
            usdtRate: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.usdtRate).toFixed(0)}
                </MDTypography>
            ),
            netUsdt: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.usdtNet).toFixed(2)}
                </MDTypography>
            ),
            ref: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {row?.remark}
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
