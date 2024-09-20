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
// Material Dashboard 2 React components

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from 'components/MDInput';
import Card from "@mui/material/Card";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { Grid } from '@mui/material';

import { useUser } from "ZustandState/useUser";
import Qrcode from './qrcode';
import { useState } from 'react';
import { useConfig } from "../../../config"

// Data
function addMoney() {
    const { apiUrl } = useConfig()
    const token = localStorage.getItem('user_token')
    const user = useUser((state) => state.user)
    const [open, setOpen] = useState(false)
    const [data, setData] = useState('')
    const validationSchema = Yup.object({
        upiId: Yup.string().required('UPI Id is required'),
        amount: Yup.number().required('Amount is required'),
        username: Yup.string().required('Username is required'),
        phone: Yup.number().required('phone is required'),

    });

    const initialValues = {
        emailId: user ? user.emailId : '',
        upiId: '',
        amount: '',
        username: '',
        phone: ''
    };
    const navigate = useNavigate();
    const handleSubmit = async (values, { setSubmitting }) => {
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
            const response = await fetch(`${apiUrl}/user/sendpayinrequest`, {
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
            console.log(res.responseData)
            setData(res.responseData)
            setOpen(true)
            toast.success(res.responseMessage, {
                position: "top-right",
                autoClose: 2000, // Auto close the toast after 3 seconds
                hideProgressBar: false,
            });
            // navigate('/add-payment');
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
                            Add Money
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={4} pb={3} px={3}>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            // onSubmit={()=>setOpen(true)}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <MDBox mb={2}>
                                        <Field type="text" label="UPI ID" as={MDInput} fullWidth name="upiId" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="upiId" component="div" />
                                        </MDTypography>
                                    </MDBox>

                                    <MDBox mb={2}>
                                        <Field type="text" label="Username" as={MDInput} fullWidth name="username" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="username" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="number" label="Amount" as={MDInput} fullWidth name="amount" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="amount" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="number" label="phone" as={MDInput} fullWidth name="phone" />
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
                                                    {isSubmitting ? 'Adding Money...' : 'Add Money'}
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
            <Qrcode open={open} setOpen={setOpen} data={data} />
            {/* <Footer /> */}

        </DashboardLayout>
    );
}

export default addMoney;
