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
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
// import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Transactions from "layouts/dashboard/components/Transactions";
// import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { useUser } from "ZustandState/useUser";
import { useEffect } from "react";
import { useConfig } from "../../config"
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Loader from "util/Loader";
import { useSandbox } from "ZustandState/useSandbox";
function Dashboard() {
  const { apiUrl } = useConfig()
  const sandbox = useSandbox((state) => state.sandbox)
  // const { sales, tasks } = reportsLineChartData;
  const userEmail = localStorage.getItem('user_email')
  const token = localStorage.getItem('user_token');
  const apiKey = localStorage.getItem('user_apiKey');
  const [merchantProfile, setMerchantProfile] = useState({})
  const user = useUser((state) => state.user)
  const setUser = useUser((state) => state.setUser)
  const setBalance = useUser((state) => state.setBalance)
  const setTransactions = useUser((state) => state.setTransactions)
  const balance = useUser((state) => state.balance)
  const transactions = useUser((state) => state.transactions)
  const navigate = useNavigate()
  const [volumes, setVolumes] = useState()
  const [isLoading, setIsLoading] = useState(true);
  const [allDataLoading, setAllDataLoading] = useState(true)
  async function setProfile(body) {
    try {

      const response = await fetch(`${apiUrl}/user/getprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(body)
      });
      const res = await response.json();
      if (res.responseCode === 403) {
        // toast.error(res?.responseMessage, {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: false,
        // });
        localStorage.removeItem('user_token');
        navigate('/authentication/sign-in');
      }
      if (res.responseCode !== 200) {
        //console.log('unable to get user')
        return;
      }
      const userBody = {
        emailId: res.responseData.emailId,
        apiKey: res.responseData.apiKey
      }
      if (res.responseData) {
        setUser(userBody)
        setBalance(res?.responseData?.balance)
        setMerchantProfile(res?.responseData)
        setTransactions(res?.responseData?.transactions.length)
      }
      return res
    } catch (e) {
      console.log(e)
    }
  }
  async function getVolumes(body) {
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
          'apiKey': apiKey || ''
        },
        body: JSON.stringify(body)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      setVolumes(res?.responseData)
    } catch (err) {
      console.log("Error Fetching volumes: ", err)
    }
  }
  useEffect(() => {
    setAllDataLoading(true)
    const userBody = {
      emailId: userEmail,
    }
    setProfile(userBody)
    getVolumes(userBody).then(() => {
      setIsLoading(false)
      setAllDataLoading(false)
    })
  }, [sandbox])
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {
        allDataLoading ? (<Loader />) : (
          <MDBox py={3}>
            {
              !isLoading && (<Grid container spacing={3}>
                <Grid item xs={12} md={2.4} lg={2.4}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="7FDF9A"
                      title="Today Volume"
                      count={Number(volumes?.todayObject?.volume).toFixed(0) || ''}
                    // percentage={{
                    //   color: "success",
                    //   amount: "+55%",
                    //   label: "than lask week",
                    // }}
                    />
                  </MDBox>
                </Grid>


                <Grid item xs={12} md={2.4} lg={2.4}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      // icon="leaderboard"
                      title="Successful Transactions"
                      color="D4BEF0"
                      count={volumes && volumes?.successfulTransactions || ''}
                    // percentage={{
                    //   color: "success",
                    //   amount: "+0%",
                    //   label: "than last month",
                    // }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={2.4} lg={2.4}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="BBF2EA"
                      // icon="store"
                      title="Success Rate"
                      count={volumes && Math.round(volumes?.successRate) + '%'}
                    // percentage={{
                    //   color: "success",
                    //   amount: "+0%",
                    //   label: "than yesterday",
                    // }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={2.4} lg={2.4}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="FFFED2"
                      //icon="equalizer"
                      title="Yesterday's Volume"
                      count={`${Number(volumes?.yesterdayObject?.volume).toFixed(0) || ''}`}
                    // percentage={{
                    //   color: "success",
                    //   amount: "",
                    //   // label: "Just updated",
                    // }}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={2.4} lg={2.4}>
                  <MDBox mb={1.5}>
                    <ComplexStatisticsCard
                      color="C9DEDE"
                      //icon="wallet"
                      title="Wallet Balance"
                      count={`${Number(balance).toFixed(0) || ''}`}
                    // percentage={{
                    //   color: "success",
                    //   amount: "+0%",
                    //   label: "than lask week",
                    // }}
                    />
                  </MDBox>
                </Grid>
              </Grid>)
            }

            {/* <Grid container spacing={3} mt={4.5}>
  
          <Grid item xs={12} md={2.4} lg={2.4}>
              <MDBox mb={1.5}>
                <ComplexStatisticsCard
                  color="primary"
                  icon="equalizer"
                  title="Weekly Volume"
                  count={`₹ ${volumes?.weeklyObject?.volume}`}
                // percentage={{
                //   color: "success",
                //   amount: "+3%",
                //   label: "than last month",
                // }}
                />
              </MDBox>
            </Grid>
          </Grid> */}
            {/* <MDBox mt={4.5}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsBarChart
                    color="info"
                    title="website views"
                    description="Last Campaign Performance"
                    date="campaign sent 2 days ago"
                    chart={reportsBarChartData}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="success"
                    title="daily sales"
                    description={
                      <>
                        (<strong>+15%</strong>) increase in today sales.
                      </>
                    }
                    date="updated 4 min ago"
                    chart={sales}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={4}>
                <MDBox mb={3}>
                  <ReportsLineChart
                    color="dark"
                    title="completed tasks"
                    description="Last Campaign Performance"
                    date="just updated"
                    chart={tasks}
                  />
                </MDBox>
              </Grid>
            </Grid>
          </MDBox> */}
            <MDBox>
              <Grid container spacing={3} mt={4}>
                <Grid item xs={12} md={12} lg={12}>
                  <Transactions />
                </Grid>
                {/* <Grid item xs={12} md={6} lg={4}>
                <OrdersOverview />
              </Grid> */}
              </Grid>
            </MDBox>
          </MDBox>
        )
      }

    </DashboardLayout>
  );
}

export default Dashboard;
