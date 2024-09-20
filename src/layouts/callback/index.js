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
// import Footer from "examples/Footer";
import { Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useConfig } from "../../config"

// Data
function callbackUrl() {
    const { apiUrl } = useConfig()
    const token = localStorage.getItem('user_token')
    const userEmail = localStorage.getItem('user_email')
    const userApiKey = localStorage.getItem('user_apiKey')
    const [profileCallbackUrl, setProfileCallbackUrl] = useState('')
    const [payoutCallbackUrl, setPayoutCallbackUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const validationSchema = Yup.object({
        callbackUrl: Yup.string(),
        payoutCallbackUrl: Yup.string(),
    });


    const initialValues = {
        emailId: userEmail || '',
        callbackUrl: profileCallbackUrl || '',
        payoutCallbackUrl: payoutCallbackUrl || ''
    };
    const navigate = useNavigate();

    async function getprofile(body) {
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
                console.log('unable to get user')
                return;
            }

            if (res.responseData) {
                setProfileCallbackUrl(res.responseData.callbackUrl)
                setPayoutCallbackUrl(res.responseData.payoutCallbackUrl)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const handleSubmitPayin = async (values, { setSubmitting }) => {
        try {
            const newValues = {
                emailId: values.emailId,
                callbackUrl: values.callbackUrl
            }
            const response = await fetch(`${apiUrl}/user/updatecallbackurl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(newValues)
            });
            const res = await response.json();
            return res
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
    const handleSubmitPayout = async (values, { setSubmitting }) => {
        try {

            const newValues = {
                emailId: values.emailId,
                payoutCallbackUrl: values.payoutCallbackUrl
            }
            const response = await fetch(`${apiUrl}/user/updatePayoutCallbackUrl`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token,
                    'apiKey': userApiKey || ''
                },
                body: JSON.stringify(newValues)
            });
            const res = await response.json();
            return res
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
            const res1 = await handleSubmitPayin(values, { setSubmitting })
            const res2 = await handleSubmitPayout(values, { setSubmitting })
            if (res1.responseCode === 403 || res2.responseCode === 403) {
                toast.error(res1?.responseMessage, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                });
                localStorage.removeItem('user_token');
                navigate('/authentication/sign-in');
            }
            if (res1.responseCode !== 200 || res2.responseCode !== 200) {
                toast.error(res1.responseMessage, {
                    position: "top-right",
                    autoClose: 2000, // Auto close the toast after 3 seconds
                    hideProgressBar: false,
                });
                return;
            }
            toast.success(res1.responseMessage, {
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
    }

    useEffect(() => {

        const userBody = {
            emailId: userEmail || '',
        }

        getprofile(userBody).then(() => {
            setLoading(false)
        })
    }, [])
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
                            Callback URL
                        </MDTypography>
                    </MDBox>
                    <MDBox pt={4} pb={3} px={3}>
                        {loading === false && <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form>
                                    <MDBox mb={2}>
                                        <Field type="text" label="Payin Callback URL" as={MDInput} fullWidth name="callbackUrl" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="callbackUrl" component="div" />
                                        </MDTypography>
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <Field type="text" label="Payout Callback URL" as={MDInput} fullWidth name="payoutCallbackUrl" />
                                        <MDTypography color="error" variant="caption" >
                                            <ErrorMessage name="payoutCallbackUrl" component="div" />
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
            {/* <Footer /> */}

        </DashboardLayout>
    );
}

export default callbackUrl;
