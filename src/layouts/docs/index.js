// Docs.js
import React, { useEffect } from 'react';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import Header from 'layouts/docs/header';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useSandbox } from 'ZustandState/useSandbox';
const containerStyle = {
  padding: '20px',
  marginTop: "90px"
};

function Docs() {
  const sandbox = useSandbox((state) => state.sandbox)
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header selectedDocs="Select Api Docs" />
      <MDBox style={containerStyle}>
        <MDTypography mb={'30px'} variant="h4">Payhub API Integration Documentation</MDTypography>
        <MDTypography mb={'5px'} >Live API URL:    https://server.payhub.link</MDTypography>
        <MDTypography mb={'5px'} >Sandbox API URL: https://sandbox.payhub.link</MDTypography>

        <MDTypography mb={'10px'} variant="h5">API services currently available:</MDTypography>
        <ul>
          <MDTypography variant="h6"><li>Payin</li></MDTypography>
          <MDTypography variant="h6"><li>Payin Intent</li></MDTypography>
          <MDTypography variant="h6"><li>Payin Page</li></MDTypography>
          {/* <MDTypography variant="h6"><li>Payin Collect</li></MDTypography> */}
          <MDTypography variant="h6"><li>Fetch Payin Status</li></MDTypography>
          <MDTypography variant="h6"><li>Payout</li></MDTypography>
          <MDTypography variant="h6"><li>Fetch Payout Status</li></MDTypography>
          <MDTypography variant="h6"><li>Callback & Verify Transaction</li></MDTypography>
        </ul>

        <MDTypography mt={'30px'} mb={'10px'} variant="h5">1. Generate Token</MDTypography>
        {
          sandbox ? (
            <MDTypography>
              API URL: <code>https://sandbox.payhub.link/user/login</code>
            </MDTypography>
          ) : (
            <MDTypography>
              API URL: <code>https://server.payhub.link/user/login</code>
            </MDTypography>
          )
        }

        <MDTypography>Request Type: <code>POST</code></MDTypography>

        <MDTypography>
          Request Body (JSON):
        </MDTypography>
        <MDTypography as={'pre'}>
          {`
{
  "emailId": "your registration email",
  "password": "your password"
}
`}
        </MDTypography>
        <MDBox>
          <MDTypography mt={'10px'} variant="h6">Success Response:  (Token is valid for 1 year)</MDTypography>
        </MDBox>
        <MDTypography as={'pre'}>
          {`{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseData": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "emailId": "Your email",
    "apiKey": "your apikey"
  }
}
`}
        </MDTypography>

        <MDTypography variant="h6" mt={'10px'}>Error Response (Invalid Password):</MDTypography>
        <MDTypography as={'pre'}>
          {`
{
  "responseCode": 405,
  "responseMessage": "Please provide valid password"
}
`}
        </MDTypography>

        <MDTypography variant="h6" mt={'10px'}>Error Response (Invalid Email):</MDTypography>
        <MDTypography as={'pre'}>
          {`
{
  "responseCode": 404,
  "responseMessage": "Please provide valid user details"
}
`}
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}

export default Docs;
