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
import formatDateAndTime from "util/formatTimeAndDate";
import { getDayOfWeek } from "util/formatTimeAndDate";
import { useMaterialUIController } from "context";
export default function data(logs) {
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    return {
        columns: [
            { Header: "date", accessor: "date", align: "left" },
            { Header: "day", accessor: "day", align: "left" },
            { Header: "Gross volume", accessor: "volume", align: "right" },
            { Header: "Tx Count", accessor: "transactionCount", align: "right" },
            { Header: "", accessor: "space", align: "right", width: '40%' },
        ],

        rows: logs && logs.map((row, index) => ({
            date: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {formatDateAndTime(row?.date).formattedDate}
                </MDTypography>
            ),
            day: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {getDayOfWeek(row?.date)}
                </MDTypography>
            ),
            volume: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {Number(row?.volume).toFixed(0)}
                </MDTypography>
            ),
            transactionCount: (
                <MDTypography variant="caption" color={darkMode ? "white" : "black"} fontWeight="medium">
                    {row?.transactionCount}
                </MDTypography>
            ),
        }))
    }
}
