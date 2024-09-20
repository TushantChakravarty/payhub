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
import Card from "@mui/material/Card";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useConfig } from "../../config"

// Data
import paymentData from "layouts/tables/data/paymentData";
import { useUser } from "ZustandState/useUser";
import { useLocation } from "react-router-dom";
import React from "react";
//import projectsTableData from "layouts/tables/data/projectsTableData";

function Tables() {
  const { apiUrl } = useConfig()

  //const { columns: pColumns, rows: pRows } = projectsTableData();
  const user = useUser((state) => state.user)
  const { state } = useLocation();
  const [transactions, setTransactions] = React.useState([])
  const token = localStorage.getItem('user_token');

  const initialValues = {
    emailId: user ? user.emailId : '',
    apiKey: user ? user.apiKey : '',
    utr: '',
  };
  const handleSearch = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${apiUrl}/user/getdatabyutr`, {
        method: 'POST',
        headers: {
          //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'apiKey': user ? user.apiKey : '',
          "token": token
        },
        body: JSON.stringify(values)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      console.log(res)
      setTransactions(res.responseData)
      //if (res) setIsLoading(false)
    } catch (err) {
      console.log("Error Fetching Transactions: ", err)
    }
  }
  const { columns, rows } = paymentData(transactions.reverse());
  return (
    <DashboardLayout>

      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Payments
                </MDTypography>
                <MDBox ml={'900px'} pr={1} >
                  <Formik
                    initialValues={initialValues}
                    onSubmit={handleSearch}
                  >
                    {({ isSubmitting, setFieldValue }) => (
                      <Form>
                        <MDBox
                          display={'flex'}
                          flexDirection={'row'}
                        >
                          <MDBox mb={2}>
                            <Field
                              onChange={(e) => {
                                setFieldValue('utr', e.target.value)
                                // if (initialValues.utr === '') {
                                //   setTransactions(totalTransaction)
                                // }
                              }}
                              type="text" label="Search UTR" as={MDInput} fullWidth name="utr" />
                            <MDTypography color="error" variant="caption" >
                              <ErrorMessage name="utr" component="div" />
                            </MDTypography>
                          </MDBox>
                          <MDBox ml={1} mb={1}>
                            <Grid container justifyContent="center">
                              <Grid item>
                                <MDButton
                                  variant="gradient"
                                  color="info"
                                  type="submit"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? 'Searching...' : 'Utr'}
                                </MDButton>
                              </Grid>
                            </Grid>
                          </MDBox>
                        </MDBox>
                      </Form>
                    )}
                  </Formik>
                </MDBox>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
          {/* <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Projects Table
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  table={{ columns: pColumns, rows: pRows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid> */}
        </Grid>
      </MDBox>
      {/* <Footer /> */}

    </DashboardLayout>
  );
}

export default Tables;
