import React, { useEffect, useState } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import { MdChat } from "react-icons/md"
import { useMaterialUIController } from 'context';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import DataTable from "layouts/support/DataTable";
import data from "layouts/support/financeQuery/data";
import { useConfig } from "../../../config"
import { capitalizeFirstLetter } from 'util/formatTimeAndDate';
import MDPagination from 'components/MDPagination';
import MDInput from 'components/MDInput';
function Queries() {
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    const userApiKey = localStorage.getItem("user_apiKey")
    const userEmail = localStorage.getItem("user_email")
    const { supportApiUrl } = useConfig()
    const [queries, setQueries] = useState([])
    const [menu, setMenu] = useState(null);
    const openMenu = ({ currentTarget }) => setMenu(currentTarget);
    const closeMenu = () => setMenu(null);
    const { columns, rows } = data(queries);
    const limit = 10
    const [page, setPage] = useState(0)
    // const renderMenu = (
    //     <Menu
    //         id="simple-menu"
    //         anchorEl={menu}
    //         anchorOrigin={{
    //             vertical: "top",
    //             horizontal: "left",
    //         }}
    //         transformOrigin={{
    //             vertical: "top",
    //             horizontal: "right",
    //         }}
    //         open={Boolean(menu)}
    //         onClose={closeMenu}
    //     >
    //         <MenuItem onClick={() => {
    //             setCategory("transaction")
    //             setPage(0)
    //             closeMenu
    //         }}>Transaction Queries</MenuItem>
    //         <MenuItem onClick={() => {
    //             setCategory("technical")
    //             setPage(0)
    //             closeMenu
    //         }}>Technical Queries</MenuItem>
    //     </Menu>
    // );

    async function getQueries() {
        try {
            const response = await fetch(`${supportApiUrl}/api/issue/merchant?category=transaction&limit=${limit}&skip=${limit * page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'apiKey': userApiKey || '',
                    'emailId': userEmail || ''
                }
            })
            if (!response) console.log("Something went wrong")
            const res = await response.json()
            setQueries(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Queries: ", err)
        }
    }
    useEffect(() => {
        getQueries()
    }, [page])
    return (
        <MDBox >
            <Card >
                <MDBox display="flex" justifyContent="space-between" alignItems="center" px={3} py={2}>
                    <MDBox>
                        <MDTypography variant="h6" gutterBottom>
                            Finance
                        </MDTypography>
                    </MDBox>
                    {/* <MDBox color="text">
                        <Icon sx={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" onClick={openMenu}>
                            more_vert
                        </Icon>
                    </MDBox>
                    {renderMenu} */}
                </MDBox>

                {/* <MDBox
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="70vh"
                            width="100%"
                            className="animate__animated animate__fadeIn"
                        >

                            <MDBox
                                mt={-10}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="space-between"
                                className="space-y-4"
                            >
                                <MDBox display="flex" alignItems="center" justifyContent="center">
                                    <MdChat
                                        style={{
                                            fontSize: '3rem', // Adjust the size as needed
                                            color: darkMode ? 'white' : 'grey-300', // Use the desired colors
                                        }}
                                    />
                                </MDBox>
                                <MDBox px={1} display="flex" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" >
                                    <MDTypography variant="body2" color={darkMode ? "white" : "textSecondary"}>
                                        {`No ${capitalizeFirstLetter(category)} Queries Yet`}
                                    </MDTypography>
                                    <MDTypography variant="body2" color={darkMode ? "white" : "textSecondary"}>
                                        If you have transaction or technical queries, please click &apos;Add Query&apos;
                                    </MDTypography>
                                </MDBox>
                            </MDBox>
                        </MDBox> */}

                <MDBox>
                    <DataTable
                        table={{ columns, rows }}
                        showTotalEntries={false}
                        isSorted={false}
                        noEndBorder
                        entriesPerPage={false}
                        canSearch={false}
                    />
                    {
                        page === 0 && queries?.length < 10 ? null : (
                            <MDBox
                                display="flex"
                                flexDirection={{ xs: "column", sm: "row" }}
                                justifyContent="space-between"
                                alignItems={{ xs: "flex-start", sm: "center" }}
                                mb={3}
                                ml={1}
                                mt={1}
                            >
                                <MDPagination
                                    variant={"gradient"}
                                    color={"info"}
                                >
                                    <MDPagination item onClick={() => { page > 0 && setPage(page - 1) }}>
                                        <Icon sx={{ fontWeight: "bold" }}>chevron_left</Icon>
                                    </MDPagination>
                                    <MDBox width="5rem" mx={1}>
                                        <MDInput
                                            inputProps={{ type: "number", min: 1 }}
                                            value={page}

                                        />
                                    </MDBox>
                                    {
                                        queries.length === 10 &&
                                        < MDPagination item onClick={() => { setPage(page + 1) }}>
                                            <Icon sx={{ fontWeight: "bold" }}>chevron_right</Icon>
                                        </MDPagination>
                                    }
                                </MDPagination>
                            </MDBox>
                        )
                    }
                </MDBox>
            </Card >

        </MDBox >
    );
}

export default Queries;