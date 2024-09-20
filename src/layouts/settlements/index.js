import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useState, useEffect } from 'react'
import DefaultProjectCard from 'examples/Cards/ProjectCards/DefaultProjectCard'
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard'
import { Grid } from '@mui/material'
import MDBox from 'components/MDBox'
import { useMaterialUIController } from 'context'
import { useConfig } from "../../config"
import { toast } from "react-toastify"
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import BeatLoader from "react-spinners/BeatLoader";
import MDTypography from 'components/MDTypography'
import SettlementLogs from "layouts/settlements/settlementLogs"
import formatTimeAndDate from "util/formatTimeAndDate";
import { PDFDocument, rgb } from 'pdf-lib';
import logo from "assets/images/payhub.png"
import { capitalizeFirstLetter } from 'util/formatTimeAndDate'
import Loader from 'util/Loader'
import { useSandbox } from 'ZustandState/useSandbox'
function Settlement() {
    const { apiUrl } = useConfig()
    const sandbox = useSandbox((state) => state.sandbox)
    const userEmail = localStorage.getItem('user_email')
    const token = localStorage.getItem('user_token')
    const userApiKey = localStorage.getItem('user_apiKey')
    const [controller] = useMaterialUIController()
    const [loading, setLoading] = useState(false)
    const [allDataLoading, setAllDataLoading] = useState(true)
    const [page, setPage] = useState(0)
    const [settlementLogs, setSettlementLogs] = useState([])
    const [csvCompleteData, setCsvCompleteData] = useState([])
    const {
        darkMode
    } = controller
    const [data, setData] = useState()

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
    const getSettlementLogs = async () => {
        try {
            let body = {
                emailId: userEmail,
                limit: 10,
                skip: page * 10
            }
            if (!body.emailId) {
                return;
            }
            const response = await fetch(`${apiUrl}/user/getallusersettlements`, {
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
            setSettlementLogs(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Settlements: ", err)
        }
    }
    const getSettlementLogsForCsv = async (body) => {
        try {
            if (!body.emailId) {
                return;
            }
            const response = await fetch(`${apiUrl}/user/getallusersettlements`, {
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
    const downloadSettlementLogs = async () => {
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

            await getSettlementLogsForCsv(body).then((res) => {
                if (res.length === 0) responseData = false;
                csvCompleteData.push(...res)
            })
            csvPage++
        } while (responseData)

        // Create the CSV content
        const csvContent = [
            ["Time", "Date", "Gross Volume", "Fees", "Net Volume", "USDT Net", "Ref"],
            ...csvCompleteData.map(({ transaction_date, amount, feeCharged, amountSettled, usdt, ref_no }) => [
                formatTimeAndDate(transaction_date).formattedTime || '',
                formatTimeAndDate(transaction_date).formattedDate || '',
                amount,
                feeCharged?.toFixed(0),
                amountSettled?.toFixed(0),
                usdt?.toFixed(0),
                ref_no || '',
            ]),
        ].map(row => row.join(',')).join('\n');

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settlement.csv';

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
            { title: 'Settlement Date', value: log.transaction_date.split('T')[0] || '' },
            { title: 'Settlement No.', value: (log.txIndex + 1).toString() },
        ];

        merchantInfo.forEach(({ title, value }, index) => {
            page.drawText(`${title}:`, { x: 50, y: 700 - index * 30, size: 18, color: rgb(0, 0, 0) });
            page.drawText(value, { x: 350, y: 700 - index * 30, size: 18, color: rgb(0, 0, 0) });
        });

        // Add Settlement Report
        page.drawRectangle({ x: 50, y: 580, width: 500, height: 30, color: rgb(0, 0, 0) });
        page.drawText('Settlement Report', { x: 200, y: 587, fontSize: 11, color: rgb(1, 1, 1) });

        const feeCharged = log?.feeCharged;
        const feeChargedValue = feeCharged !== undefined ? feeCharged.toFixed(2).toString() : '';

        // Add Data Section
        const dataSection = [
            { title: 'Merchant Volume', value: (log.amount || '').toString() },
            { title: 'Gateway Fees', value: (log?.feePercentage && log?.feePercentage + '%' || '').toString() },
            { title: 'Net Gateway Fees', value: feeChargedValue },
        ];

        dataSection.forEach(({ title, value }, index) => {
            page.drawText(title, { x: 50, y: 530 - index * 35, size: 15, color: rgb(0, 0, 0) });
            page.drawText(value, { x: 400, y: 530 - index * 35, size: 15, color: rgb(0, 0, 0) });
        });

        // Add Footer Line
        page.drawLine({ start: { x: 50, y: 180 }, end: { x: 550, y: 180 }, thickness: 1, color: rgb(0, 0, 0) });

        // Add Footer Data
        const footerData = [
            { title: 'Merchant Net', value: (log.amountSettled || '').toString() },
            { title: 'USDT Rate', value: (log?.usdtRate && log?.usdtRate || '')?.toString() },
            { title: 'USDT Net Settlement', value: (log?.usdt?.toFixed(0)).toString() },
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
    useEffect(() => {
        let body = {
            emailId: userEmail
        }
        getProfile(body)
    }, [sandbox])
    useEffect(() => {
        getSettlementLogs().then(() => {
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
                                        />
                                    </Grid>
                                    <Grid xl={7}>
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} lg={3.5} xl={3.5}>
                                                <MDBox mb={1.5}>
                                                    <ComplexStatisticsCard
                                                        color="7FDF9A"
                                                        title="Today's Volume"
                                                        count={Number(data?.last24hr).toFixed(0) || ''}
                                                    />
                                                </MDBox>
                                            </Grid>

                                            <Grid item xs={12} lg={3.5} xl={3.5}>
                                                <MDBox mb={1.5}>
                                                    <ComplexStatisticsCard
                                                        color="FFFED2"
                                                        title="Yesterday's Volume"
                                                        count={`${Number(data?.yesterday).toFixed(0) || ''}`}
                                                    />
                                                </MDBox>
                                            </Grid>
                                            <Grid item xs={12} lg={3.5} xl={3.5}>
                                                <MDBox mb={1.5}>
                                                    <ComplexStatisticsCard
                                                        color="C9DEDE"
                                                        title="Wallet Balance"
                                                        count={`${Number(data.balance).toFixed(0) || 0}`}
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
                                            <MDTypography variant="h6" color={darkMode ? "white" : "black"}>Settlement Logs</MDTypography>
                                            <MDBox pl={3}>
                                                {
                                                    loading ? (<BeatLoader
                                                        color="#36d7b7"
                                                        cssOverride={{}}
                                                        size={10}
                                                    />) : (
                                                        <FileDownloadOutlinedIcon onClick={() => downloadSettlementLogs()} sx={{ cursor: "pointer", fontWeight: "bold" }} color={darkMode ? "white" : "black"} fontSize="medium" />
                                                    )
                                                }

                                            </MDBox>
                                        </MDBox>



                                    </Grid>
                                    <SettlementLogs pages={page} pageSetter={setPage} logs={settlementLogs} downloadInvoice={downloadPdfInvoice} />
                                </Grid>
                            </MDBox>
                        </MDBox>
                    </MDBox>
                )
            }

        </DashboardLayout>
    )
}

export default Settlement