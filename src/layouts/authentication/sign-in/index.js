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

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
// @mui material components
import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";
// import MuiLink from "@mui/material/Link";

// @mui icons
// import FacebookIcon from "@mui/icons-material/Facebook";
// import GitHubIcon from "@mui/icons-material/GitHub";
// import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/signin.jpg";
import { useUser } from 'ZustandState/useUser';
import { useConfig } from "../../../config"
function Basic() {
  const { apiUrl } = useConfig()
  const setUser = useUser((state) => state.setUser)
  const validationSchema = Yup.object({
    password: Yup.string().required('Password is required'),
    emailId: Yup.string().required('Email is required'),
  });

  const initialValues = {
    password: '',
    emailId: '',
  };

  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });
      const res = await response.json();
      if (res.responseCode !== 200) {
        toast.error(res.responseMessage, {
          position: "top-right",
          autoClose: 2000, // Auto close the toast after 3 seconds
          hideProgressBar: false,
        });
        return;
      }
      console.log(res)
      const userBody = {
        emailId: res.responseData.emailId,
        apiKey: res.responseData.apiKey
      }
      localStorage.setItem('user_email', userBody.emailId)
      localStorage.setItem('user_apiKey', userBody.apiKey)
      setUser(userBody)
      const token = res?.responseData?.token;
      // Save the token to localStorage
      localStorage.setItem('user_token', token);
      // Reset submitting state
      setSubmitting(false);
      // Navigate to /dashboard
      navigate('/dashboard');
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

      // Reset submitting state
      setSubmitting(false);
    }
  };


  //const [rememberMe, setRememberMe] = useState(false);

  // const handleSetRememberMe = () => setRememberMe(!rememberMe);

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Hello
          </MDTypography>
          {/* <Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <FacebookIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GitHubIcon color="inherit" />
              </MDTypography>
            </Grid>
            <Grid item xs={2}>
              <MDTypography component={MuiLink} href="#" variant="body1" color="white">
                <GoogleIcon color="inherit" />
              </MDTypography>
            </Grid>
          </Grid> */}
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <MDBox mb={2}>
                  <Field type="text" label="Email" as={MDInput} fullWidth name="emailId" />
                  <MDTypography color="error" variant="caption" >
                    <ErrorMessage name="emailId" component="div" />
                  </MDTypography>
                </MDBox>

                <MDBox mb={2}>
                  <Field type="password" as={MDInput} label="Password" fullWidth name="password" />
                  <MDTypography color="error" variant="caption" >
                    <ErrorMessage name="password" component="div" />
                  </MDTypography>
                </MDBox>

                {/* <MDBox display="flex" alignItems="center" ml={-1}>
                  <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    onClick={handleSetRememberMe}
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;Remember me
                  </MDTypography>
                </MDBox> */}

                <MDBox mt={4} mb={1}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </MDButton>
                </MDBox>
              </Form>
            )}
          </Formik>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Basic;
