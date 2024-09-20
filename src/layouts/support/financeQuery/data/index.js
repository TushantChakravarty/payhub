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
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
// Images
import formatDateAndTime from "util/formatTimeAndDate";
import { Link } from "react-router-dom";
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
export default function data(queries) {
    const attachments = (attachment) =>
        attachment.map((image, index) => (
            <MDAvatar
                key={index}
                src={image?.imageUrl}
                alt="name"
                size="xs"
                sx={{
                    border: ({ borders: { borderWidth }, palette: { white } }) =>
                        `${borderWidth[2]} solid ${white.main}`,
                    cursor: "pointer",
                    position: "relative",

                    "&:not(:first-of-type)": {
                        ml: -1.25,
                    },

                    "&:hover, &:focus": {
                        zIndex: "10",
                    },
                }}
                onClick={() => {
                    window.open(image?.imageUrl, '_blank');
                }}
            />

        ));

    const Txid = ({ id }) => (
        <MDBox display="flex" alignItems="center" lineHeight={1}>
            <MDTypography variant="button" fontWeight="medium" lineHeight={1}>
                {id}
            </MDTypography>
        </MDBox>
    );
    return {


        columns: [
            { Header: "", accessor: "notifications", width: "1%", align: "center" }, // New column
            { Header: "Ticket No.", accessor: "ticket", width: "10%", align: "left" },
            { Header: "transaction Id", accessor: "txid", width: "30%", align: "left" },
            { Header: "amount", accessor: "amount", align: "center" },
            { Header: "tx date", accessor: "txdate", width: "10%", align: "center" },
            { Header: "attachments", accessor: "attachments", width: "15%", align: "left" },
            { Header: "tx status", accessor: "txStatus", width: "10%", align: "center" },
            { Header: "query status", accessor: "queryStatus", width: "15%", align: "center" },
            { Header: "action", accessor: "action", align: "center" },
        ],

        rows: queries && queries.map((item, index) => ({
            notifications: (
                item?.pendingMessageCount !== 0 ? (
                    <Badge
                        badgeContent={item?.pendingMessageCount}
                        color="error"

                    >
                        <MailIcon color="secondary" fontSize="medium" />
                    </Badge>
                ) : null
            ),
            ticket: <Txid id={item?.ticketNumber || ''} />,
            txid: <Txid id={item?.transactionId} />,
            attachments: (
                <MDBox display="flex" py={1}>
                    {attachments(
                        item?.images
                    )}
                </MDBox>
            ),
            amount: (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {`₹${item?.amount}`}
                </MDTypography>
            ),
            txdate: (
                <MDTypography variant="caption" color="text" fontWeight="medium">
                    {formatDateAndTime(item?.transactionDate).formattedDate}
                </MDTypography>
            ),
            txStatus: (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={item?.transactionStatus === "charge-back" ? "Charge back" : item?.transactionStatus} color={
                        item?.transactionStatus === "charge-back" ? "dark" :
                            item?.transactionStatus === "success" ? "success" :
                                item?.transactionStatus === "failed" ? "error" :
                                    item?.transactionStatus === "pending" ? "warning" :
                                        "secondary"

                    } variant="gradient" size="sm" />
                </MDBox>
            ),
            queryStatus: (
                <MDBox ml={-1}>
                    <MDBadge badgeContent={item?.status} color={
                        item?.status === "unassigned" ? "light" : item?.status === "resolved" ? "info" : "primary"
                    } variant="gradient" size="sm" />
                </MDBox>
            ),

            action: (
                item?.status !== "unassigned" ? (
                    <Link to={`/chat`} state={{ item, category: "finance" }}>
                        <MDTypography component="a" href="#" variant="caption" color="info" fontWeight="medium">
                            View
                        </MDTypography>
                    </Link>
                ) : null
            ),
        }))
    }

}