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
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
// import ProfilesList from "examples/Lists/ProfilesList";
// import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import MDButton from "components/MDButton";
// Overview page components
import Header from "layouts/profile/components/Header";
import { useEffect, useState } from "react";
import { useConfig } from "../../config"
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import { Card } from "@mui/material";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
function Overview() {
  const { apiUrl } = useConfig()
  const [encryptionKey, setEncryptionKey] = useState('')
  const token = localStorage.getItem('user_token')
  const apiKey = localStorage.getItem('user_apiKey');
  const userEmail = localStorage.getItem('user_email')
  const navigate = useNavigate()
  const [user, setUser] = useState({
    emailId: '',
    apiKey: '',
    first_name: '',
    last_name: '',
    business_name: ''
  })
  const [loading, setLoading] = useState(true)
  const [profileCallbackUrl, setProfileCallbackUrl] = useState('')
  const validationSchema = Yup.object({
    callbackUrl: Yup.string().required('Callback Url is required'),
  });


  const initialValues = {
    emailId: user ? user.emailId : '',
    callbackUrl: profileCallbackUrl
  };
  async function setProfile(body) {
    try {

      const response = await fetch(`${apiUrl}/user/getprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': apiKey || ''
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
        console.log('unable to get user')
        return;
      }
      if (res.responseData) {
        setUser(res.responseData)
        setProfileCallbackUrl(res.responseData.callbackUrl)
      }

    } catch (e) {
      console.log(e)
    }
  }

  async function getEncryptionKey(body) {
    try {
      if (body.emailId === '') {
        return;
      }
      const response = await fetch(`${apiUrl}/user/getencryptionkey`, {
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
      setEncryptionKey(res?.responseData)
    } catch (err) {
      console.log("Error Fetching Encryption key: ", err)
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    console.log(values)
    try {
      if (values.emailId === '') {
        toast.error("Invalid credential! Please Sign in again..", {
          position: "top-right",
          autoClose: 2000, // Auto close the toast after 3 seconds
          hideProgressBar: false,
        });
        localStorage.removeItem('user_token');

        // Navigate to the sign-in page
        navigate('/authentication/sign-in');
        return;
      }
      const response = await fetch(`${apiUrl}/user/updatecallbackurl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(values)
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
    } catch (error) {
      // Display an error toast
      toast.error('An error occurred. Please try again later.', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
      });

      // // Reset submitting state
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const userBody = {
      emailId: userEmail
    }
    setProfile(userBody).then(() => {
      setLoading(false)
    })
    getEncryptionKey(userBody)
  }, [])
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={1} />
      <Header>
        <MDBox >
          <Grid container spacing={1}>
            {/* <Grid item xs={12} md={6} xl={4}>
              <PlatformSettings />
            </Grid> */}
            <Grid item xs={12} md={12} xl={12} sx={{ display: "flex" }}>
              <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
              <ProfileInfoCard
                title="Basic information"
                info={{
                  Business: user ? user.business_name : '',
                  Name: user ? user.first_name || '' + " " + user.last_name || '' : '',
                  email: user ? user.emailId : "",
                  // Apikey: user ? user.apiKey : "",
                  // encryptionKey: encryptionKey || '',

                }}
                action={{ route: "", tooltip: "Edit Profile" }}
                shadow={false}
              />
              {/* <Divider orientation="vertical" sx={{ mx: 0 }} /> */}
            </Grid>

            {/* <Grid item xs={12} xl={4}>
              <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
            </Grid> */}
          </Grid>

        </MDBox>

        {/* <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Projects
          </MDTypography>
          <MDBox mb={1}>
            <MDTypography variant="button" color="text">
              Architects design houses
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor1}
                label="project #2"
                title="modern"
                description="As Uber works through a huge amount of internal management turmoil."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor2}
                label="project #1"
                title="scandinavian"
                description="Music is something that everyone has their own specific opinion about."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team3, name: "Nick Daniel" },
                  { image: team4, name: "Peterson" },
                  { image: team1, name: "Elena Morison" },
                  { image: team2, name: "Ryan Milly" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor3}
                label="project #3"
                title="minimalist"
                description="Different people have different taste, and various types of music."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={3}>
              <DefaultProjectCard
                image={homeDecor4}
                label="project #4"
                title="gothic"
                description="Why would anyone pick blue over pink? Pink is obviously a better color."
                action={{
                  type: "internal",
                  route: "/pages/profile/profile-overview",
                  color: "info",
                  label: "view project",
                }}
                authors={[
                  { image: team4, name: "Peterson" },
                  { image: team3, name: "Nick Daniel" },
                  { image: team2, name: "Ryan Milly" },
                  { image: team1, name: "Elena Morison" },
                ]}
              />
            </Grid>
          </Grid>
        </MDBox> */}
      </Header>
      <MDBox mb={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} xl={6} sx={{ display: "flex" }}>
            <ProfileInfoCard
              title="Developer"
              info={{
                Apikey: user ? user.apiKey : "",
                encryptionKey: encryptionKey || '',

              }}
              showBtnTest={true}
              action={{ route: "https://documenter.getpostman.com/view/18471050/2s9YysBg6b", tooltip: "Test Api Docs" }}
              shadow={false}
            />
          </Grid>
          <Grid item xs={12} md={12} xl={6} sx={{ display: "flex" }}>
            <ProfileInfoCard
              title="API URL"
              info={{
                // Business: user ? user.business_name : '',
                // Name: user ? user.first_name || '' + " " + user.last_name || '' : '',
                // email: user ? user.emailId : "",
                Live: "https://server.payhub.link",
                Sandbox: "https://sandbox.payhub.link",

              }}
              action={{ route: "", tooltip: "Edit Profile" }}
              shadow={false}
            />
          </Grid>
        </Grid>
      </MDBox>
      {/* <MDBox mb={1}>
        <Grid container spacing={1}>
          <Grid item xs={12} md={12} xl={6} sx={{ display: "flex" }}>
            <MDBox width="100%">
              <Card>
                <MDBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="md"
                  coloredShadow="info"
                  mx={2}
                  mt={3}
                  p={1}
                  mb={1}
                  textAlign="center"
                >
                  <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Callback URL
                  </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  {!loading && <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <MDBox mb={2}>
                          <Field type="text" label="Callback URL" as={MDInput} fullWidth name="callbackUrl" />
                          <MDTypography color="error" variant="caption" >
                            <ErrorMessage name="callbackUrl" component="div" />
                          </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                          <Grid container justifyContent="center">
                            <Grid item>
                              <MDButton
                                variant="gradient"
                                color="info"
                                type="submit"
                                disabled={isSubmitting}

                              >
                                {isSubmitting ? 'Updating...' : 'Update'}
                              </MDButton>
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Form>
                    )}
                  </Formik>}
                </MDBox>
              </Card>
            </MDBox>

          </Grid>
          <Grid item xs={12} md={12} xl={6} sx={{ display: "flex" }}>
            <MDBox width="100%">
              <Card>
                <MDBox
                  variant="gradient"
                  bgColor="info"
                  borderRadius="md"
                  coloredShadow="info"
                  mx={2}
                  mt={3}
                  p={1}
                  mb={1}
                  textAlign="center"
                >
                  <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                    Callback URL
                  </MDTypography>
                </MDBox>
                <MDBox pt={4} pb={3} px={3}>
                  {!loading && <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <MDBox mb={2}>
                          <Field type="text" label="Callback URL" as={MDInput} fullWidth name="callbackUrl" />
                          <MDTypography color="error" variant="caption" >
                            <ErrorMessage name="callbackUrl" component="div" />
                          </MDTypography>
                        </MDBox>
                        <MDBox mt={4} mb={1}>
                          <Grid container justifyContent="center">
                            <Grid item>
                              <MDButton
                                variant="gradient"
                                color="info"
                                type="submit"
                                disabled={isSubmitting}

                              >
                                {isSubmitting ? 'Updating...' : 'Update'}
                              </MDButton>
                            </Grid>
                          </Grid>
                        </MDBox>
                      </Form>
                    )}
                  </Formik>}
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox> */}




      {/* <Footer /> */}
    </DashboardLayout>
  );
}

export default Overview;
