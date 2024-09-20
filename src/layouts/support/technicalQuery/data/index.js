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
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
// Images
import { Link } from "react-router-dom";
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
            { Header: "Ticket No.", accessor: "ticket", align: "left" },
            { Header: "subject", accessor: "subject", width: "30%", align: "left" },
            { Header: "attachments", accessor: "attachments", width: "30%", align: "left" },
            { Header: "query status", accessor: "queryStatus", align: "center" },
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
            subject: <Txid id={item?.subject} />,
            attachments: (
                <MDBox display="flex" py={1}>
                    {attachments(
                        item?.images
                    )}
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
                    <Link to={`/chat`} state={{ item, category: "technical" }}>
                        <MDTypography component="a" href="#" variant="caption" color="info" fontWeight="medium">
                            View
                        </MDTypography>
                    </Link>
                ) : null
            ),
        }))
    };
}