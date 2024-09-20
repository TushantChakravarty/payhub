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
// Material Dashboard 2 React components

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from 'components/MDInput';
import Card from "@mui/material/Card";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";
import { Grid } from '@mui/material';
import { useConfig } from '../../../config';
import { useUser } from 'ZustandState/useUser';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
// Data
function addPayment() {
    const user = useUser((state) => state.user)
    const { apiUrl } = useConfig()
    const navigate = useNavigate()
    const token = localStorage.getItem('user_token')
    const validationSchema = Yup.object({
        bank: Yup.string().required('Bank is required'),
        accountNo: Yup.number().required('Account Number is required'),
        accountName: Yup.string().required('Account Name is required'),
        ifscCode: Yup.string().required('IFSC Code is required'),
        amount: Yup.number().required('Amount is required'),
        username: Yup.string().required('Username is required'),
        phone: Yup.number().required('Phone is required'),

    });

    const initialValues = {
        emailId: user ? user.emailId : '',
        bank: '',
        accountNo: '',
        accountName: '',
        ifscCode: '',
        amount: '',
        username: '',
        upiId: '',
        phone: ''
    };
    // const navigate = useNavigate();
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await fetch(`${apiUrl}/user/sendpaymentrequest`, {
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

            // Reset submitting state
            setSubmitting(false);
        }
    };
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Card>
                    <MDBox
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                        mx={2}
                        mt={5}
                        p={2}
                        mb={1}
                        textAlign="center"
                    >
                        <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                            Withdraw
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={4} pb={3} px={3}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        // onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <MDBox mb={2}>
                                        <Field type="text" label="Bank" as={MDInput} fullWidth name="bank" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="bank" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="number" label="Account Number" as={MDInput} fullWidth name="accountNo" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="accountNo" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="text" label="Accout Name" as={MDInput} fullWidth name="accountName" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="accountName" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="text" label="IFSC Code" as={MDInput} fullWidth name="ifscCode" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="ifscCode" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="number" label="Amount" as={MDInput} fullWidth name="amount" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="amount" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="text" label="Username" as={MDInput} fullWidth name="username" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="username" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="number" label="Phone" as={MDInput} fullWidth name="phone" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="phone" component="div" />
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
                                                    {isSubmitting ? 'Please Wait...' : 'Withdraw'}
                                                </MDButton>
                                            </Grid>
                                        </Grid>
                                    </MDBox>
                                </Form>
                            )}
                        </Formik>
                    </MDBox>
                </Card>
            </MDBox>
            {/* <Footer /> */}

        </DashboardLayout>
    );
}

export default addPayment;
