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

import React, { useEffect, useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
// import Icon from "@mui/material/Icon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// import Grid from "@mui/material/Grid";
import MDButton from "components/MDButton";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
// Material Dashboard 2 React examples
import DataTable from "examples/Tables/DataTable";
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
// Data
import { CSVDownload } from "react-csv";
import data from "layouts/dashboard/components/Transactions/data";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useConfig } from "../../../../config"
import { useUser } from "ZustandState/useUser";
import formatDateAndTime from "util/formatTimeAndDate";
// import MDButton from "components/MDButton";
import BeatLoader from "react-spinners/BeatLoader";
import { useMaterialUIController } from "context";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { useSandbox } from "ZustandState/useSandbox";
import { Dialog, DialogContent, DialogTitle, Grid } from '@mui/material';
import { toast } from "react-toastify";
import * as Yup from 'yup';
function Transactions() {
    const [controller] = useMaterialUIController()
    const sandbox = useSandbox((state) => state.sandbox)
    const { darkMode } = controller
    const { apiUrl } = useConfig()
    const token = localStorage.getItem('user_token');
    const userEmail = localStorage.getItem('user_email');
    const userApiKey = localStorage.getItem('user_apiKey');
    const user = useUser((state) => state.user)
    const [transactions, setTransactions] = useState([])
    const [totalTransaction, setTotaltransaction] = useState([])
    const [menu, setMenu] = useState(null);
    const openMenu = ({ currentTarget }) => setMenu(currentTarget);
    const closeMenu = () => setMenu(null);
    const [page, setPage] = useState(0)
    const [check, setCheck] = useState("all")
    const [currentStatus, setCurrentStatus] = useState("")
    const [reload, setReload] = useState(true)
    const [isGeneratebtn, setIsGeneratebtn] = useState(true)
    const [isCsvReady, setIsCsvReady] = useState(false)
    const [csvCompleteData, setCsvCompleteData] = useState([])
    const [downloadReady, setDownloadReady] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [callbackValues, setCallbackValues] = useState()
    let limit = 10;
    const formikRef = React.createRef();
    const handleResetForm = () => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    };
    const validationSchemaCallback = Yup.object({
        status: Yup.string().required('Status is required').oneOf(['success', 'failed'], 'Status must be either success or failed'),
    });
    const initialSearchValues = {
        emailId: userEmail || '',
        utr: '',
    };
    const initialCallbackValues = {
        emailId: userEmail,
        status: ''
    }

    const initialDateValues = {
        emailId: userEmail || '',
        start_date: '',
        end_date: ''
    };
    const [formikValues, setFormikValues] = useState(initialDateValues);
    const renderMenu = (
        <Menu
            id="simple-menu"
            anchorEl={menu}
            anchorOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "right",
            }}
            open={Boolean(menu)}
            onClose={closeMenu}
        >
            <MenuItem onClick={() => {
                setMenu(null);
                setCsvCompleteData([])
                setCheck("all")
                setPage(0)
                setIsCsvReady(false)
                setIsGeneratebtn(true)
                setReload(!reload)
                handleResetForm()
            }}>
                All
            </MenuItem>
            <MenuItem onClick={() => {
                setCurrentStatus("success")
                setPage(0)
                setMenu(null);
                setCsvCompleteData([])
                setCheck("status")
                setIsCsvReady(false)
                setIsGeneratebtn(true)
                formikValues.start_date !== "" && formikValues.end_date !== "" ? handleDateSearchWithStatus(formikValues, "success") : filterSearch("success")
            }}>Success</MenuItem>
            <MenuItem onClick={() => {
                setCurrentStatus("IN-PROCESS")
                setPage(0)
                setMenu(null);
                setCsvCompleteData([])
                setCheck("status")
                setIsCsvReady(false)
                setIsGeneratebtn(true)
                formikValues.start_date !== "" && formikValues.end_date !== "" ? handleDateSearchWithStatus(formikValues, "IN-PROCESS") : filterSearch("IN-PROCESS")
            }}>Pending</MenuItem>
            <MenuItem onClick={() => {
                setCurrentStatus("failed")
                setPage(0)
                setMenu(null);
                setCsvCompleteData([])
                setCheck("status")
                setIsCsvReady(false)
                setIsGeneratebtn(true)
                formikValues.start_date !== "" && formikValues.end_date !== "" ? handleDateSearchWithStatus(formikValues, "failed") : filterSearch("failed")
            }}>Failed</MenuItem>
            <MenuItem onClick={() => {
                setCurrentStatus("expired")
                setPage(0)
                setMenu(null);
                setCsvCompleteData([])
                setCheck("status")
                setIsCsvReady(false)
                setIsGeneratebtn(true)
                formikValues.start_date !== "" && formikValues.end_date !== "" ? handleDateSearchWithStatus(formikValues, "expired") : filterSearch("expired")
            }}>Expired</MenuItem>
        </Menu>
    );
    const handleSearch = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`${apiUrl}/user/getdatabyutr`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': userApiKey || '',
                    "token": token
                },
                body: JSON.stringify(values)
            })

            if (!response) return;
            const res = await response.json()
            if (res.responseCode !== 200) return;
            setTransactions(res.responseData)
            setIsSearch(true)
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }

    const handleDateSearch = async (values) => {
        try {
            if (values.start_date === "" || values.end_date === "") {
                return;
            }
            setCheck("date")
            setIsCsvReady(false)
            setIsGeneratebtn(true)
            setCsvCompleteData([])
            const response = await fetch(`${apiUrl}/user/getTransactionsByDate`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': userApiKey || '',
                    "token": token
                },
                body: JSON.stringify(values)
            })
            const res = await response.json()
            if (res.responseCode !== 200) {
                setTransactions([])
                return;
            }
            setTransactions(res.responseData)
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }
    const handleDateSearchWithStatus = async (values, status) => {
        try {
            if (values.start_date === "" || values.end_date === "" || status === "") {
                return;
            }
            setCheck('dateStatus')
            values.status = status
            values.limit = limit,
                values.skip = limit * page
            const response = await fetch(`${apiUrl}/user/getTransactionsByStatusAndDate`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': userApiKey || '',
                    "token": token
                },
                body: JSON.stringify(values)
            })
            const res = await response.json()
            if (res.responseCode !== 200) {
                setTransactions([])
                return;
            }
            setTransactions(res.responseData)
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }
    const handleDateSearchWithStatusForCsv = async (values) => {
        try {
            if (values.start_date === "" || values.end_date === "") {
                return;
            }
            setCheck('dateStatus')
            const response = await fetch(`${apiUrl}/user/getTransactionsByStatusAndDate`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': userApiKey || '',
                    "token": token
                },
                body: JSON.stringify(values)
            })
            const res = await response.json()
            if (res.responseCode !== 200) {
                return;
            }
            return res.responseData
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }

    const getAllTransactions = async () => {
        let body = {
            emailId: userEmail,
            limit,
            skip: limit * page
        }
        try {
            const response = await fetch(`${apiUrl}/user/getTransactionsUser`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': user ? user.apiKey : '',
                    "token": token
                },
                body: JSON.stringify(body)
            })

            const res = await response.json()
            if (res.responseCode !== 200) return;
            setTotaltransaction(res?.responseData)
            setTransactions(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }
    const getAllTransactionsForCsv = async (body) => {
        try {
            const response = await fetch(`${apiUrl}/user/getTransactionsUser`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': user ? user.apiKey : '',
                    "token": token
                },
                body: JSON.stringify(body)
            })

            const res = await response.json()
            if (res.responseCode !== 200) return;
            return res?.responseData
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }
    const filterSearch = async (status) => {
        let body = {
            emailId: user ? user.emailId : '',
            status,
            limit,
            skip: limit * page
        }
        setCurrentStatus(status)
        setCheck("status")
        try {
            const response = await fetch(`${apiUrl}/user/getTransactionsByStatus`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': user ? user.apiKey : '',
                    "token": token
                },
                body: JSON.stringify(body)
            })

            const res = await response.json()
            if (res.responseCode !== 200) {
                setTransactions([])
                return;
            }
            setTotaltransaction(res?.responseData)
            setTransactions(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }
    const filterSearchForCsv = async (body) => {
        try {
            const response = await fetch(`${apiUrl}/user/getTransactionsByStatus`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': user ? user.apiKey : '',
                    "token": token
                },
                body: JSON.stringify(body)
            })

            const res = await response.json()
            if (res.responseCode !== 200) {
                //setTransactions([])
                return;
            }
            return res.responseData
        } catch (err) {
            console.log("Error Fetching Transactions: ", err)
        }
    }
    const generateCsv = async (type) => {
        setIsGeneratebtn(false)
        let csvPage = 0
        if (type === "all") {
            let responseData = true
            do {
                let body = {
                    emailId: userEmail || '',
                    limit: 500,
                    skip: 500 * csvPage
                }
                await getAllTransactionsForCsv(body).then((res) => {
                    if (res.length === 0) responseData = false;
                    csvCompleteData.push(...res)
                })
                csvPage++
            } while (responseData)
        }
        else if (check === "status") {
            let responseData = true
            do {
                let body = {
                    emailId: userEmail || '',
                    status: type,
                    limit: 500,
                    skip: 500 * csvPage
                }
                await filterSearchForCsv(body).then((res) => {
                    if (res.length === 0) responseData = false;
                    csvCompleteData.push(...res)
                })
                csvPage++
            } while (responseData)
        }
        else if (check === "dateStatus") {
            let responseData = true
            do {
                let body = {
                    emailId: userEmail || '',
                    status: type,
                    limit: 500,
                    skip: 500 * csvPage,
                    start_date: formikValues.start_date,
                    end_date: formikValues.end_date
                }
                await handleDateSearchWithStatusForCsv(body).then((res) => {
                    if (res.length === 0) responseData = false;
                    csvCompleteData.push(...res)
                })
                csvPage++
            } while (responseData)
        }
        else {
            csvCompleteData.push(...transactions)
        }
        // Now that you have all the data in csvCompleteData, remove duplicates based on the _id field.
        const uniqueCsvCompleteData = csvCompleteData.filter((value, index, self) => {
            const firstIndex = self.findIndex((item) => item._id === value._id);
            return index === firstIndex;
        });
        // Set csvCompleteData to the unique data.
        setCsvCompleteData(uniqueCsvCompleteData)
        setDownloadReady([["Time", "Date", "Amount", "status", "Username", "UTR", "TXID"],
        ...csvCompleteData.map(({ transaction_date, amount, username, status, utr, transactionId }) => [
            formatDateAndTime(transaction_date).formattedTime || '',
            formatDateAndTime(transaction_date).formattedDate || '',
            amount || '',
            status ? status === "IN-PROCESS" ? "pending" : status === "fail" ? "failed" : status.toLowerCase() : '',
            username || '',
            utr || '',
            transactionId || ''
        ]),
        ])
        setIsCsvReady(true)
    }

    // // Contains the column headers and table data in the required format for CSV
    // const csvData = [
    //     ["Time", "Date", "Amount", "status", "UTR", "TXID"],
    //     ...csvCompleteData.map(({ transaction_date, amount, status, utr, transactionId }) => [
    //         formatDateAndTime(transaction_date).formattedTime || '',
    //         formatDateAndTime(transaction_date).formattedDate || '',
    //         amount || '',
    //         status || '',
    //         utr || '',
    //         transactionId || ''
    //     ]),
    // ];

    const sendAutoCallback = async (values, { setSubmitting }) => {
        try {
            if (!sandbox) return
            if (values.status === '') return
            values.transaction_id = callbackValues.transaction_id
            values.amount = callbackValues.amount
            const response = await fetch(`${apiUrl}/callback/autoCallback`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'apiKey': userApiKey || '',
                    "token": token
                },
                body: JSON.stringify(values)
            })

            if (!response) return;
            const res = await response.json()
            if (res.responseCode !== 200) {
                toast.error('Something went wrong.', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                })
            }
            if (res?.responseCode === 200) {

                toast.success(res?.responseMessage, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                })
            }
            getAllTransactions()
            handleCloseDialog()
        } catch (err) {
            console.log("Error Fetching sendAutoCallback: ", err)
        }
    }
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const callbackValueSetter = (value) => {
        setCallbackValues({
            transaction_id: value.transaction_id,
            amount: value.amount
        })
    }

    useEffect(() => {
        if (check === "all") {
            getAllTransactions()
        }
        else if (check === "status") {
            filterSearch(currentStatus)
        } else if (check === "dateStatus") {
            handleDateSearchWithStatus(formikValues, currentStatus)
        }
    }, [page, reload, user, sandbox])
    const { columns, rows } = data(transactions, isSearch, setOpenDialog, callbackValueSetter);
    return (
        <>
            <Card>
                <MDBox display={'flex'} flexDirection={'column'}>
                    <MDBox display="flex" justifyContent="space-between" alignItems="center" p={3}>
                        <Grid container alignItems="center" p={1}>
                            <Grid item xl={4}>
                                <MDBox ml={1} alignItems="center">
                                    <MDTypography variant="text" color={darkMode ? "white" : "black"} fontWeight="medium" gutterBottom>
                                        Transactions
                                    </MDTypography>
                                </MDBox>
                            </Grid>
                            <Grid item xl={8}>
                                <Grid container spacing={2} >
                                    <Grid item xl={4} lg={12} md={12} xs={12} sm={12}>
                                        {/* search input */}
                                        <Formik
                                            initialValues={initialSearchValues}
                                            onSubmit={handleSearch}
                                        >
                                            {({ isSubmitting, setFieldValue }) => (
                                                <Form>
                                                    <MDBox mb={0.5}>
                                                        <MDTypography variant="caption" color="text" ml={1}>
                                                            Search by UTR/TXID/Username
                                                        </MDTypography>
                                                        <MDBox>
                                                            <Grid container>
                                                                <Grid item xl={11} lg={11} md={11} sm={11} xs={11}>
                                                                    <Field
                                                                        onChange={(e) => {
                                                                            setFieldValue('utr', e.target.value)
                                                                            if (initialSearchValues.utr === '') {
                                                                                setTransactions(totalTransaction)
                                                                                setIsSearch(false)
                                                                            }
                                                                        }}
                                                                        type="text" as={MDInput} name="utr" fullWidth />
                                                                </Grid>
                                                                <Grid item xl={1} lg={1} md={1} sm={1} xs={1}>
                                                                    <IconButton type="submit">
                                                                        <SearchIcon color={darkMode ? "white" : "black"} />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </MDBox>
                                                        <MDTypography color="error" variant="caption" >
                                                            <ErrorMessage name="utr" component="div" />
                                                        </MDTypography>
                                                    </MDBox>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Grid>
                                    <Grid item xl={4} sm={12} xs={12} >
                                        {/* date input */}
                                        <Formik
                                            initialValues={initialDateValues}
                                            onSubmit={handleDateSearch}
                                            innerRef={formikRef}
                                        >
                                            {({ isSubmitting, setFieldValue, values }) => (
                                                <Form>
                                                    <Grid container spacing={1}>
                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                            <MDBox>
                                                                <MDTypography variant="caption" color="text" ml={1}>
                                                                    Start date
                                                                </MDTypography>
                                                                <Field
                                                                    size="large"
                                                                    onChange={async (e) => {
                                                                        await setFieldValue('start_date', e.target.value)
                                                                        const newFormikValues = { ...formikValues, start_date: e.target.value };
                                                                        setFormikValues(newFormikValues);
                                                                        setPage(0)
                                                                        handleDateSearch({ ...values, start_date: e.target.value });
                                                                    }}
                                                                    type="date" as={MDInput} fullWidth name="start_date" />
                                                                <MDTypography color="error" variant="caption" >
                                                                    <ErrorMessage name="start_date" component="div" />
                                                                </MDTypography>
                                                            </MDBox>
                                                        </Grid>
                                                        <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                            <MDBox>
                                                                <MDTypography variant="caption" color="text" ml={1}>
                                                                    End date
                                                                </MDTypography>
                                                                <Field
                                                                    size="large"
                                                                    onChange={async (e) => {
                                                                        await setFieldValue('end_date', e.target.value)
                                                                        const newFormikValues = { ...formikValues, end_date: e.target.value };
                                                                        setFormikValues(newFormikValues);
                                                                        setPage(0)
                                                                        handleDateSearch({ ...values, end_date: e.target.value });
                                                                    }}
                                                                    type="date" as={MDInput} fullWidth name="end_date" />
                                                                <MDTypography color="error" variant="caption" >
                                                                    <ErrorMessage name="end_date" component="div" />
                                                                </MDTypography>
                                                            </MDBox>
                                                        </Grid>
                                                    </Grid>
                                                </Form>
                                            )}
                                        </Formik>
                                    </Grid>
                                    <Grid mt={4} item xl={4} sm={12} xs={12}>
                                        <Grid container alignItems="center" spacing={1} >
                                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                <MDButton sx={{ minWidth: 120 }} color="success" >
                                                    Filter
                                                    <TuneOutlinedIcon onClick={openMenu} sx={{ cursor: "pointer", fontWeight: "bold", marginLeft: '1vh' }} fontSize="medium" />
                                                    {renderMenu}
                                                </MDButton>
                                                {/* <MDBox mb={2}>
                                                    <MDBox mt={3} ml={1} px={2}>
                                                        <TuneOutlinedIcon sx={{ cursor: "pointer", fontWeight: "bold" }} onClick={openMenu} color={darkMode ? "white" : "black"} fontSize="medium" />
                                                    </MDBox>
                                                    {renderMenu}
                                                </MDBox> */}
                                            </Grid>
                                            <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                                {
                                                    (isGeneratebtn === true) && (
                                                        <MDButton sx={{ minWidth: 120 }} size="medium" color='info' onClick={() => generateCsv(check === "all" ? check : check === "date" ? "date" : currentStatus)}>
                                                            Download
                                                            <FileDownloadOutlinedIcon sx={{ cursor: "pointer", fontWeight: "bold", marginLeft: '1vh' }} fontSize="medium" />
                                                        </MDButton>
                                                        // <MDBox onClick={() => generateCsv(check === "all" ? check : check === "date" ? "date" : currentStatus)} display={'flex'} flexDirection={'column'}>
                                                        //     <FileDownloadOutlinedIcon sx={{ cursor: "pointer", fontWeight: "bold" }} color={darkMode ? "white" : "black"} fontSize="medium" />
                                                        // </MDBox>

                                                    )
                                                }
                                                {isGeneratebtn === false && isCsvReady === false &&
                                                    <MDTypography ml={4} mt={1.5} variant="caption" color="info">
                                                        <BeatLoader
                                                            color="#36d7b7"
                                                            cssOverride={{}}
                                                            size={15}
                                                        />
                                                    </MDTypography>
                                                }
                                                {
                                                    isCsvReady ? (<CSVDownload filename="my-transaction.csv" data={downloadReady} onComplete={() => setIsCsvReady(false)}>
                                                    </CSVDownload>) : (
                                                        null
                                                    )
                                                }
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </MDBox>
                    <MDBox>
                        <DataTable
                            table={{ columns, rows }}
                            showTotalEntries={false}
                            isSorted={false}
                            noEndBorder
                            entriesPerPage={false}
                            pages={page}
                            pageSetter={setPage}
                            checking={check}

                        />
                    </MDBox>
                </MDBox>

            </Card>

            {/* dialog for callback */}

            <Dialog PaperProps={{
                style: {
                    minHeight: '25vh',
                    minWidth: '45vw',
                    background: darkMode ? "#344767" : "white",
                    boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.2)', // Shadow effect
                    borderRadius: '10px', // Rounded corners
                    position: 'absolute',
                    left: '50%', // Adjust the left value to move the dialog to the right
                },
            }} open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Send Callback</DialogTitle>
                <DialogContent>
                    <MDBox px={1} py={1} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                        <MDTypography px={2} color="text" fontWeight="medium" fontSize="large" variant="caption" >
                            Tx Id: {callbackValues?.transaction_id}
                        </MDTypography>
                        <MDTypography px={2} color="text" fontWeight="medium" fontSize="large" variant="caption" >
                            Amount: {callbackValues?.amount}
                        </MDTypography>
                    </MDBox>
                    <Formik
                        initialValues={initialCallbackValues}
                        validationSchema={validationSchemaCallback}
                        onSubmit={sendAutoCallback}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <MDBox mb={2}>
                                    <Field
                                        type="text"
                                        select
                                        label="Select Status"
                                        size="large"
                                        as={MDInput}
                                        fullWidth
                                        name="status"
                                        InputProps={{
                                            classes: { root: darkMode ? "select-input-styles-darkMode" : "select-input-styles" },
                                        }}
                                    >
                                        <MenuItem value={'success'}>SUCCESS</MenuItem>
                                        <MenuItem value={'failed'}>FAILED</MenuItem>
                                    </Field>
                                </MDBox>
                                <MDBox display={'flex'} flexDirection={'row'}>
                                    <MDBox>
                                        <MDButton
                                            type="submit" color="success" disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Sending Callback...' : 'Send Callback'}
                                        </MDButton>
                                    </MDBox>
                                    <MDBox ml={3}>
                                        <MDButton
                                            onClick={handleCloseDialog} color="error"
                                        >
                                            Cancel
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </Form>
                        )}

                    </Formik>
                </DialogContent>

            </Dialog>
        </>
    );
}

export default Transactions;
