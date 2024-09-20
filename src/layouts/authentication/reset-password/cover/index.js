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
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Card from "@mui/material/Card";
import { useUser } from "ZustandState/useUser";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";


// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/signin.jpg";
import { useConfig } from "../../../../config"
function Cover() {
  const user = useUser((state) => state.user)
  const { apiUrl } = useConfig()
  const validationSchema = Yup.object({
    password: Yup.string().required('Old Password is required'),
    newPassword: Yup.string().required('New Password is required'),
    emailId: Yup.string().required('Email is required'),
  });
  const token = localStorage.getItem('user_token')
  const initialValues = {
    password: '',
    emailId: '',
    newPassword: '',
  };
  const navigate = useNavigate();
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${apiUrl}/user/forgotpassword`, {
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
  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Change Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Change your password using old password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <MDBox mb={4}>
                  <Field type="text" label="Email" name="emailId" as={MDInput} variant="standard" fullWidth />
                  <MDTypography color="error" variant="caption" >
                    <ErrorMessage name="emailId" component="div" />
                  </MDTypography>
                </MDBox>
                <MDBox mb={4}>
                  <Field type="password" label="Old Password" name="password" as={MDInput} variant="standard" fullWidth />
                  <MDTypography color="error" variant="caption" >
                    <ErrorMessage name="password" component="div" />
                  </MDTypography>
                </MDBox>
                <MDBox mb={4}>
                  <Field type="password" label="New Password" name="newPassword" as={MDInput} variant="standard" fullWidth />
                  <MDTypography color="error" variant="caption" >
                    <ErrorMessage name="newPassword" component="div" />
                  </MDTypography>
                </MDBox>
                <MDBox mt={6} mb={1}>
                  <MDButton variant="gradient" color="info" fullWidth type="submit"
                    disabled={isSubmitting}>
                    {isSubmitting ? 'Updating...' : 'Update'}
                  </MDButton>
                </MDBox>
              </Form>
            )}
          </Formik>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Cover;
