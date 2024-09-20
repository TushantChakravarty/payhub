import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import { useMaterialUIController } from 'context'
import { useLocation } from 'react-router-dom'
import { Grid } from '@mui/material'
import MDTypography from 'components/MDTypography'
import MDBox from 'components/MDBox'
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard'
import { useConfig } from "../../config"
import Logs from "layouts/daily-logs/logs"
import { getDayOfWeek } from 'util/formatTimeAndDate'
import BeatLoader from "react-spinners/BeatLoader";
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Loader from 'util/Loader'
import formatDateAndTime from 'util/formatTimeAndDate'
import { useSandbox } from 'ZustandState/useSandbox'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CallReceived from '@mui/icons-material/CallReceived';
import CallMade from '@mui/icons-material/CallMade';
function dailyLogs() {
    const { apiUrl } = useConfig()
    const sandbox = useSandbox((state) => state.sandbox)
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    const { state } = useLocation()
    const userEmail = localStorage.getItem('user_email');
    const userApiKey = localStorage.getItem('user_apiKey');
    const token = localStorage.getItem('user_token');
    const [cards, setCards] = useState()
    const [page, setPage] = useState(0)
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [csvCompleteData, setCsvCompleteData] = useState([])
    const [allDataLoading, setAllDataLoading] = useState(true)
    const [user, setUser] = useState()
    const [value, setValue] = React.useState(0);
    const limit = 10
    // for upper cards 
    async function getCardsData(body) {
        try {
            if (body.emailId === '') {
                return;
            }

            const response = await fetch(`${apiUrl}/user/getvolumes`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(body)
            })

            if (!response) console.log("Something went wrong")
            const res = await response.json()
            setCards(res?.responseData)
        } catch (err) {
            console.log("Error Fetching volumes: ", err)
        }
    }

    // for all daily logs of this merchant by pagination for table
    const getAllLogs = async () => {
        let body = {
            emailId: userEmail || '',
            limit,
            skip: limit * page
        }
        try {
            const response = await fetch(`${apiUrl}/user/getmerchantlogs`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(body)
            })

            const res = await response.json()
            if (res.responseCode !== 200) return;
            setLogs(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Logs: ", err)
        }
    }
    const getAllLogsPayouts = async () => {
        let body = {
            emailId: userEmail || '',
            limit,
            skip: limit * page
        }
        try {
            const response = await fetch(`${apiUrl}/user/payouts/getPayoutLogs`, {
                method: 'POST',
                headers: {
                    //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(body)
            })

            const res = await response.json()
            if (res.responseCode !== 200) return;
            setLogs(res?.responseData)
        } catch (err) {
            console.log("Error Fetching Logs: ", err)
        }
    }

    const getAllLogsForCsv = async (body) => {
        try {
            if (body.emailId === '') {
                return;
            }
            const response = await fetch(`${apiUrl}/user/getmerchantlogs`, {
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
            console.log("Error Fetching Logs: ", err)
        }
    }
    const getAllLogsPayoutsForCsv = async (body) => {
        try {
            if (body.emailId === '') {
                return;
            }
            const response = await fetch(`${apiUrl}/user/payouts/getPayoutLogs`, {
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
            console.log("Error Fetching Logs: ", err)
        }
    }
    const downloadLogs = async () => {
        setLoading(true)
        setCsvCompleteData([])
        let csvPage = 0
        let responseData = true
        if (value === 0) {
            do {
                let body = {
                    emailId: userEmail || '',
                    limit: 500,
                    skip: csvPage * 500,
                }

                await getAllLogsForCsv(body).then((res) => {
                    if (res.length === 0) responseData = false;
                    csvCompleteData.push(...res)
                })
                csvPage++
            } while (responseData)
        } else {
            do {
                let body = {
                    emailId: userEmail || '',
                    limit: 500,
                    skip: csvPage * 500,
                }

                await getAllLogsPayoutsForCsv(body).then((res) => {
                    if (res.length === 0) responseData = false;
                    csvCompleteData.push(...res)
                })
                csvPage++
            } while (responseData)
        }


        // Create the CSV content
        const csvContent = [
            ["Date", "Day", "Volume", "Transaction Count"],
            ...csvCompleteData.map(({ date, volume, transactionCount }) => [
                formatDateAndTime(date).formattedDate,
                getDayOfWeek(date.split('T')[0]),
                volume,
                transactionCount
            ]),
        ].map(row => row.join(',')).join('\n');

        // Create a Blob containing the CSV data
        const blob = new Blob([csvContent], { type: 'text/csv' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user?.business_name}Logs.csv`

        // Programmatically click the link to trigger the download
        a.click();

        // Clean up
        URL.revokeObjectURL(url);
        setLoading(false)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setPage(0)
    };
    useEffect(() => {
        if (value === 0) {
            getAllLogs()
        } else {
            getAllLogsPayouts()
        }
    }, [page, sandbox])
    useEffect(() => {
        setAllDataLoading(true)
        if (value === 0) {
            getAllLogs().then(() => {
                setAllDataLoading(false)
            })
        } else {
            getAllLogsPayouts().then(() => {
                setAllDataLoading(false)
            })
        }
    }, [value])

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
                localStorage.removeItem('user_token');
                navigate('/authentication/sign-in');
            }
            if (res.responseCode !== 200) {
                return;
            }
            if (res?.responseData) {
                setUser(res?.responseData)
            }
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        setAllDataLoading(true)
        let body = {
            emailId: userEmail
        }
        getCardsData(body).then(() => {
            setAllDataLoading(false)
        })
        getProfile(body)
    }, [sandbox])


    return (
        <DashboardLayout>
            <DashboardNavbar />
            {
                allDataLoading ? (<Loader />) : (
                    <MDBox py={3}>
                        {cards && <Grid container spacing={3}>
                            <Grid item xs={12} md={2.4} lg={2.4}>
                                <MDBox mb={1.5}>
                                    <ComplexStatisticsCard
                                        color="7FDF9A"
                                        title="Today's Volume"
                                        count={Number(cards?.todayObject?.volume).toFixed(0)}

                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={2.4} lg={2.4}>
                                <MDBox mb={1.5}>
                                    <ComplexStatisticsCard
                                        color="D4BEF0"
                                        title="Successful transactions"
                                        count={cards?.successfulTransactions}
                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={2.4} lg={2.4}>
                                <MDBox mb={1.5}>
                                    <ComplexStatisticsCard
                                        color="BBF2EA"
                                        title="Success Rate"
                                        count={`${Math.round(cards?.successRate)}%`}
                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={2.4} lg={2.4}>
                                <MDBox mb={1.5}>
                                    <ComplexStatisticsCard
                                        color="FFFED2"
                                        title="Yesterday's Volume"
                                        count={Number(cards?.yesterdayObject?.volume).toFixed(0)}
                                    />
                                </MDBox>
                            </Grid>
                            <Grid item xs={12} md={2.4} lg={2.4}>
                                <MDBox mb={1.5}>
                                    <ComplexStatisticsCard
                                        color="C9DEDE"
                                        title="Wallet Balance"
                                        count={Number(cards?.balance).toFixed(0)}
                                    />
                                </MDBox>
                            </Grid>
                        </Grid>}

                        <MDBox mt={3}>
                            <MDBox display={'flex'} flexDirection={'row'}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12} md={12} lg={12} xl={12}>
                                        <MDTypography variant="h6" color={darkMode ? "white" : "black"}>Daily Logs</MDTypography>
                                        <MDBox display={'flex'} flexDirection={'row'} alignItems="center">
                                            <MDTypography variant="caption" color={darkMode ? "white" : "black"}>Business: {user?.business_name}</MDTypography>
                                            <MDBox pl={3}>
                                                {
                                                    loading ? (<BeatLoader
                                                        color="#36d7b7"
                                                        cssOverride={{}}
                                                        size={10}
                                                    />) : (
                                                        <FileDownloadOutlinedIcon onClick={() => downloadLogs()} sx={{ cursor: "pointer", fontWeight: "bold" }} color={darkMode ? "white" : "black"} fontSize="medium" />
                                                    )
                                                }
                                            </MDBox>
                                        </MDBox>
                                    </Grid>
                                </Grid>
                            </MDBox>
                        </MDBox>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="icon position tabs example"
                        >
                            <Tab sx={{ fontWeight: "medium" }} icon={<CallReceived />} iconPosition="start" label="Payins" />
                            <Tab sx={{ fontWeight: "medium" }} icon={<CallMade />} iconPosition="end" label="Payouts" />

                        </Tabs>
                        <MDBox
                            mt={0.5}
                        >
                            <Logs pages={page} pageSetter={setPage} data={logs} />
                        </MDBox>
                    </MDBox>
                )
            }

        </DashboardLayout>
    )
}

export default dailyLogs