import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useState, useEffect } from 'react'
import DefaultProjectCard from 'examples/Cards/ProjectCards/DefaultProjectCard'
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard'
import { Grid } from '@mui/material'
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MDInput from 'components/MDInput'
import MDButton from 'components/MDButton'
import MDBox from 'components/MDBox'
import { useMaterialUIController } from 'context'
import { useConfig } from 'config'
import { toast } from "react-toastify"
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import BeatLoader from "react-spinners/BeatLoader";
import MDTypography from 'components/MDTypography'
import TopupLogs from "layouts/topups/topupLogs"
import formatTimeAndDate from "util/formatTimeAndDate";
import { PDFDocument, rgb } from 'pdf-lib';
import logo from "assets/images/payhub.png"
import { capitalizeFirstLetter } from 'util/formatTimeAndDate'
import Loader from 'util/Loader'
import { useSandbox } from 'ZustandState/useSandbox'
import * as Yup from 'yup';
function Topup() {
    const { apiUrl } = useConfig()
    const sandbox = useSandbox((state) => state.sandbox)
    const userEmail = localStorage.getItem('user_email')
    const token = localStorage.getItem('user_token')
    const userApiKey = localStorage.getItem('user_apiKey')
    const [controller] = useMaterialUIController()
    const [loading, setLoading] = useState(false)
    const [allDataLoading, setAllDataLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [topupLogs, setTopupLogs] = useState([])
    const [csvCompleteData, setCsvCompleteData] = useState([])
    const [openDialog, setOpenDialog] = useState(false);
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    const {
        darkMode
    } = controller
    const [data, setData] = useState()
    const validationSchema = Yup.object({
        payoutBalance: Yup.number().required('Amount is required'),
    });
    const initialValues = {
        emailId: userEmail || '',
        payoutBalance: '',
    }
    async function getProfile(body) {
        try {
            const response = await fetch(`${apiUrl}/user/getprofile`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(body)
            });
            const res = await response.json();
            if (res.responseCode === 403) {
                toast.error(res?.responseMessage, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                });
                localStorage.removeItem('user_token');
                navigate('/authentication/sign-in');
            }
            if (res.responseCode !== 200) {
                //console.log('unable to get user')
                return;
            }
            if (res?.responseData) {
                setData(res?.responseData)
            }
        } catch (e) {
            console.log(e)
        }
    }
    const getTopupLogs = async () => {
        try {
            let body = {
                emailId: userEmail,
                limit: 10,
                skip: page * 10
            }
            if (!body.emailId) {
                return;
            }
            const response = await fetch(`${apiUrl}/user/getallusertopups`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(body)
            })

            if (!response) return;
            const res = await response.json()
            if (res.responseCode !== 200) return;
            setTopupLogs(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Settlements: ", err)
        }
    }
    const getTopupLogsForCsv = async (body) => {
        try {
            if (!body.emailId) {
                return;
            }
            const response = await fetch(`${apiUrl}/user/getallusertopups`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(body)
            })

            if (!response) return;
            const res = await response.json()
            if (res.responseCode !== 200) return;
            return res?.responseData
        } catch (err) {
            console.log("Error Fetching Settlements: ", err)
        }
    }
    const downloadTopupLogs = async () => {
        setLoading(true)
        setCsvCompleteData([])
        let csvPage = 0
        let responseData = true
        do {
            let body = {
                emailId: userEmail || '',
                limit: 500,
                skip: csvPage * 500,
            }

            await getTopupLogsForCsv(body).then((res) => {
                if (res.length === 0) responseData = false;
                csvCompleteData.push(...res)
            })
            csvPage++
        } while (responseData)

        // Create the CSV content
        const csvContent = [
            ["Time", "Date", "Gross Topup", "Net Fees", "Net Topup", "USDT Rate", "USDT Net", "Ref"],
            ...csvCompleteData.map(({ transaction_date, grossAmount, netFees, payoutBalance, usdtRate, usdtNet, remark }) => [
                formatTimeAndDate(transaction_date).formattedTime || '',
                formatTimeAndDate(transaction_date).formattedDate || '',
                grossAmount,
                netFees?.toFixed(2),
                payoutBalance?.toFixed(2),
                usdtRate,
                usdtNet?.toFixed(2),
                remark || '',
            ]),
        ].map(row => row.join(',')).join('\n');

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'topup.csv';

        // Programmatically click the link to trigger the download
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        setLoading(false)
    }

    const downloadPdfInvoice = async (log) => {
        const pdfDoc = await PDFDocument.create();
        // Set page size to A4
        const page = pdfDoc.addPage([595, 842]); // 595 x 842 are the dimensions for A4 in points
        // Add left border Line
        page.drawLine({ start: { x: 8, y: 830 }, end: { x: 8, y: 12 }, thickness: 1, color: rgb(0, 0, 0) });
        // Add right border Line
        page.drawLine({ start: { x: 587, y: 830 }, end: { x: 587, y: 12 }, thickness: 1, color: rgb(0, 0, 0) });
        // Add upper border Line
        page.drawLine({ start: { x: 8, y: 830 }, end: { x: 587, y: 830 }, thickness: 1, color: rgb(0, 0, 0) });
        // Add bottom border Line
        page.drawLine({ start: { x: 8, y: 12 }, end: { x: 587, y: 12 }, thickness: 1, color: rgb(0, 0, 0) });

        // Add Company Logo
        const logoUrl = logo; // Replace with the actual path or URL to your logo
        const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
        const logoImage = await pdfDoc.embedPng(logoImageBytes);
        page.drawImage(logoImage, { x: 380, y: 770, width: 200, height: 40 });

        // Add Merchant Information
        const merchantInfo = [
            { title: 'Merchant Name', value: capitalizeFirstLetter(data?.business_name) },
            { title: 'Topup Date', value: log.transaction_date.split('T')[0] || '' },
            { title: 'Topup No.', value: (log.txIndex).toString() },
        ];

        merchantInfo.forEach(({ title, value }, index) => {
            page.drawText(`${title}:`, { x: 50, y: 700 - index * 30, size: 18, color: rgb(0, 0, 0) });
            page.drawText(value, { x: 350, y: 700 - index * 30, size: 18, color: rgb(0, 0, 0) });
        });

        // Add Settlement Report
        page.drawRectangle({ x: 50, y: 580, width: 500, height: 30, color: rgb(0, 0, 0) });
        page.drawText('Topup Report', { x: 200, y: 587, fontSize: 11, color: rgb(1, 1, 1) });

        const netFees = log?.netFees;
        const netFeesValue = netFees !== undefined ? netFees?.toFixed(2)?.toString() : '';

        // Add Data Section
        const dataSection = [
            { title: 'Gross Topup', value: (log.grossAmount?.toFixed(0) || '').toString() },
            { title: 'Gateway Fees', value: (log?.FeesPercentage && log?.FeesPercentage + '%' || '').toString() },
            { title: 'Net Gateway Fees', value: netFeesValue.toString() },
        ];

        dataSection.forEach(({ title, value }, index) => {
            page.drawText(title, { x: 50, y: 530 - index * 35, size: 15, color: rgb(0, 0, 0) });
            page.drawText(value, { x: 400, y: 530 - index * 35, size: 15, color: rgb(0, 0, 0) });
        });

        // Add Footer Line
        page.drawLine({ start: { x: 50, y: 180 }, end: { x: 550, y: 180 }, thickness: 1, color: rgb(0, 0, 0) });

        // Add Footer Data
        const footerData = [
            { title: 'Net Topup', value: (log?.payoutBalance?.toFixed(2) || '').toString() },
            { title: 'USDT Rate', value: (log?.usdtRate && log?.usdtRate || '')?.toString() },
            { title: 'USDT Net Topup', value: (log?.usdtNet?.toFixed(2)).toString() },
        ];

        footerData.forEach(({ title, value }, index) => {
            page.drawText(title, { x: 50, y: 150 - index * 30, size: 15, color: rgb(0, 0, 0) });
            page.drawText(value, { x: 400, y: 150 - index * 30, size: 15, color: rgb(0, 0, 0) });
        });
        let filename = `invoice,${capitalizeFirstLetter(data?.business_name)} ${formatTimeAndDate(log.transaction_date).formattedDate}.pdf`
        // Save the PDF
        const pdfBytes = await pdfDoc.save();

        // Trigger download
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
    const handleTopup = async (values, { setSubmitting }) => {
        if (!sandbox) return
        try {
            const response = await fetch(`${apiUrl}/user/payouts/updatePayoutBalance`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(values)
            })
            const res = await response.json();
            if (res.responseCode !== 200) {
                toast.error(res.responseMessage, {
                    position: "top-right",
                    autoClose: 2000, // Auto close the toast after 3 seconds
                    hideProgressBar: false,
                });
                return;
            }

            setSubmitting(false);
            toast.success(res.responseMessage, {
                position: "top-right",
                autoClose: 2000, // Auto close the toast after 3 seconds
                hideProgressBar: false,
            });
            let body = {
                emailId: userEmail
            }

            page > 0 ? (setPage(0), getProfile(body)) : (getTopupLogs(), getProfile(body))
            handleCloseDialog()
        } catch (err) {
            console.log("Error Fetching handleTopup: ", err)
            toast.error('An error occurred. Please try again later.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            });

            // Reset submitting state
            setSubmitting(false);
        }
    }
    useEffect(() => {
        let body = {
            emailId: userEmail
        }
        getProfile(body)
    }, [sandbox])

    useEffect(() => {
        getTopupLogs().then(() => {
            setAllDataLoading(false)
        })
    }, [page, sandbox])
    return (
        <DashboardLayout>
            <DashboardNavbar />
            {
                allDataLoading ? (<Loader />) : (
                    <MDBox py={3}>
                        <MDBox mt={1}>
                            {
                                data && <Grid display={'flex'} flexDirection={'row'} container spacing={3}>
                                    <Grid xl={5}>
                                        <DefaultProjectCard
                                            business={data?.business_name}
                                            email={data?.emailId}
                                            name={`${data?.first_name || ''} ${data?.last_name || ''}`}
                                            sandUrl={sandbox}
                                            btn={setOpenDialog}
                                        />
                                    </Grid>
                                    <Grid xl={7}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} lg={3.5} xl={3.5}>
                                                <MDBox mb={1.5}>
                                                    <ComplexStatisticsCard
                                                        color="7FDF9A"
                                                        title="Today's Payout"
                                                        count={Number(data?.payoutsData?.last24hr).toFixed(0) || ''}
                                                    />
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} lg={3.5} xl={3.5}>
                                                <MDBox mb={1.5}>
                                                    <ComplexStatisticsCard
                                                        color="FFFED2"
                                                        title="Yesterday's Payout"
                                                        count={`${Number(data?.payoutsData?.yesterday).toFixed(0) || ''}`}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} lg={3.5} xl={3.5}>
                                                <MDBox mb={1.5}>
                                                    <ComplexStatisticsCard
                                                        color="C9DEDE"
                                                        title="Payout Wallet"
                                                        count={`${Number(data?.payoutBalance).toFixed(0) || 0}`}
                                                    />
                                                </MDBox>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }

                            {/* settlementLogs */}
                            <MDBox mt={5} mx={0.5} ml={3}>
                                <Grid display={'flex'} flexDirection={'row'} container spacing={3}>
                                    <Grid xl={12}>
                                        <MDBox display={'flex'} flexDirection={'row'}>
                                            <MDTypography variant="h6" color={darkMode ? "white" : "black"}>Topup Logs</MDTypography>
                                            <MDBox pl={3}>
                                                {
                                                    loading ? (<BeatLoader
                                                        color="#36d7b7"
                                                        cssOverride={{}}
                                                        size={10}
                                                    />) : (
                                                        <FileDownloadOutlinedIcon onClick={() => downloadTopupLogs()} sx={{ cursor: "pointer", fontWeight: "bold" }} color={darkMode ? "white" : "black"} fontSize="medium" />
                                                    )
                                                }

                                            </MDBox>
                                        </MDBox>



                                    </Grid>
                                    <TopupLogs pages={page} pageSetter={setPage} logs={topupLogs} downloadInvoice={downloadPdfInvoice} />
                                </Grid>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                )
            }
            <Dialog PaperProps={{
                style: {
                    minHeight: '10vh',
                    minWidth: '45vw',
                    background: darkMode ? "#344767" : "white",
                    boxShadow: '0px 10px 20px 0px rgba(0,0,0,0.2)', // Shadow effect
                    borderRadius: '10px', // Rounded corners
                    position: 'absolute',
                    left: '50%', // Adjust the left value to move the dialog to the right
                },
            }} open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>TOPUP</DialogTitle>
                <DialogContent>
                    {/* <MDBox px={1} py={1} display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                        <MDTypography px={2} color="text" fontWeight="medium" fontSize="large" variant="caption" >
                            Net Volume: {netVolume?.toFixed(2)}
                        </MDTypography>
                        <MDTypography px={2} color="text" fontWeight="medium" fontSize="large" variant="caption" >
                            Net Fees: {netFees?.toFixed(2)}
                        </MDTypography>
                        <MDTypography px={2} color="text" fontSize="large" fontWeight="medium" variant="caption" >
                            Usdt Net: {usdtNet?.toFixed(2)}
                        </MDTypography>
                    </MDBox> */}
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleTopup}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <MDBox mb={2}>
                                    <Field type="number" label="Amount" as={MDInput} fullWidth name="payoutBalance"
                                    />
                                    <MDTypography color="error" variant="caption" >
                                        <ErrorMessage name="payoutBalance" component="div" />
                                    </MDTypography>
                                </MDBox>
                                <MDBox display={'flex'} flexDirection={'row'}>
                                    <MDBox>
                                        <MDButton
                                            type="submit" color="success" disabled={isSubmitting}
                                        >
                                            {isSubmitting ? 'Topping up...' : 'Topup'}
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

        </DashboardLayout>
    )
}

export default Topup