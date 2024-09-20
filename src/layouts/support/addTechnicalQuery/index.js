import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Grid } from '@mui/material';
import MDTypography from 'components/MDTypography';
import MDButton from 'components/MDButton';
import MDBox from 'components/MDBox';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Card from '@mui/material/Card';
import MDInput from 'components/MDInput';
import { useMaterialUIController } from 'context';
import { toast } from 'react-toastify';
import { useConfig } from "../../../config"
import PropTypes from "prop-types";
import { TextField } from '@mui/material';
const AddTechnicalQuery = ({ componentSetter }) => {
    const { supportApiUrl } = useConfig()
    const userApiKey = localStorage.getItem('user_apiKey')
    const MAX_FILES_LIMIT = 6; // Set your desired limit
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    const [selectedImages, setSelectedImages] = useState([]);
    const technicalQueryInitialValue = {
        subject: '',
        note: ''
    }
    const technicalQuerySchema = Yup.object({
        subject: Yup.string().max(60).required('Subject is required'),
        note: Yup.string(),
    });


    const handleImageChange = (e, setFieldValue) => {
        const files = e.currentTarget.files;
        if (files.length > MAX_FILES_LIMIT) {
            toast.error("Maximum attchement limit is 6")
        }
        // Check if the number of selected files exceeds the limit
        if (files.length <= MAX_FILES_LIMIT) {
            setSelectedImages([...files]);
        }
    };

    const handleTechnicalQuerySubmit = async (values, { setSubmitting }) => {
        try {
            if (selectedImages?.length < 1) {
                toast.error("Upload screenshot of transaction")
                return;
            }
            const formData = new FormData();
            formData.append('subject', values?.subject);
            formData.append('note', values?.note);
            selectedImages.forEach((file, index) => {
                formData.append(`files`, file);
            });
            const response = await fetch(`${supportApiUrl}/api/issue/technical`, {
                method: 'POST',
                headers: {
                    'apiKey': userApiKey,
                },
                body: formData,
            });

            const res = await response.json();
            if (res?.responseCode !== 200) {
                toast.error(res?.responseMessage, {
                    position: "top-right",
                    autoClose: 2000,
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
            componentSetter("TechnicalQueries")
            setSubmitting(false)
        } catch (error) {
            toast.error('An error occurred. Please try again later.', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
            });
            // // Reset submitting state
            setSubmitting(false);
        }
    };

    const clearFormData = () => {

        setSelectedImages([])
    }

    return (
        <MDBox pb={3}>
            <MDBox >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox pt={4} pb={3} px={3} height={"37vh"}>
                                <MDTypography pt={0.5} pb={0.5} variant="h6" gutterBottom>

                                </MDTypography>
                                <Formik
                                    initialValues={technicalQueryInitialValue}
                                    validationSchema={technicalQuerySchema}
                                    onSubmit={handleTechnicalQuerySubmit}
                                >
                                    {({ isSubmitting, setFieldValue, values, resetForm }) => (
                                        <Form>

                                            <MDBox mb={2}>
                                                <Field type="text" label="Subject" as={MDInput} fullWidth name="subject" />
                                                <MDTypography color="error" variant="caption" >
                                                    <ErrorMessage name="subject" component="div" />
                                                </MDTypography>
                                            </MDBox>
                                            <MDBox mb={2}>
                                                <TextField
                                                    label="Note"
                                                    placeholder="Note"
                                                    multiline
                                                    rows={3}
                                                    maxRows={4}
                                                    fullWidth
                                                    onChange={(e) => {
                                                        setFieldValue('note', e.target.value)
                                                    }}
                                                >
                                                </TextField>

                                                <MDTypography color="error" variant="caption">
                                                    <ErrorMessage name="note" component="div" />
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox mb={2}>
                                                <Field
                                                    type="file"
                                                    name='file'
                                                    as={MDInput}
                                                    fullWidth
                                                    required
                                                    inputProps={{
                                                        multiple: true, // Allow multiple file selection
                                                        onChange: (e) => handleImageChange(e, setFieldValue),
                                                    }}
                                                />
                                                <MDTypography color="error" variant="caption">
                                                    <ErrorMessage name="file" component="div" />
                                                </MDTypography>
                                            </MDBox>

                                            <MDBox display={'flex'} flexDirection={'row'} justifyContent={'flex-end'}>
                                                <MDBox>
                                                    <MDButton
                                                        type="submit" color="success" disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Submitting...' : 'Submit'}
                                                    </MDButton>
                                                </MDBox>
                                                <MDBox ml={3}>
                                                    <MDButton
                                                        color="error"
                                                        type="reset"
                                                        onClick={() => {
                                                            clearFormData()
                                                            values.file = ""
                                                        }}
                                                    >
                                                        Clear
                                                    </MDButton>
                                                </MDBox>
                                            </MDBox>
                                        </Form>
                                    )}

                                </Formik>
                            </MDBox>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <MDBox pt={4} pb={3} px={3} height={"37vh"}>
                                <MDTypography pt={0.5} pb={0.5} variant="h6" gutterBottom>
                                    Preview Attachment
                                </MDTypography>
                                {selectedImages && (
                                    <MDBox
                                        display="grid"
                                        gridTemplateColumns="repeat(auto-fill, minmax(30%, 1fr))"
                                        gap={2}
                                        height="80%"
                                    >
                                        {selectedImages.map((image, index) => (
                                            <MDBox
                                                key={index}
                                                border={darkMode ? '3px solid white' : '3px solid black'}
                                                borderRadius="4px"
                                                overflow="hidden"
                                            >
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`Selected-${index}`}
                                                    style={{
                                                        objectFit: 'cover',
                                                        width: '100%',
                                                        height: '100%',
                                                        borderRadius: '4px',
                                                    }}
                                                />
                                            </MDBox>
                                        ))}
                                    </MDBox>
                                )}
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
        </MDBox>
    );
};

AddTechnicalQuery.propTypes = {
    componentSetter: PropTypes.func
};

export default AddTechnicalQuery;
