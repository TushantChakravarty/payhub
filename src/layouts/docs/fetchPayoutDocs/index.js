import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Header from 'layouts/docs/header';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { useSandbox } from 'ZustandState/useSandbox';
const containerStyle = {
  padding: '20px',
  marginTop: '90px',
};

function FetchPayoutStatus() {
  const sandbox = useSandbox((state) => state.sandbox)
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header selectedDocs="Fetch Payout Status" />

      <MDBox style={containerStyle}>
        <MDTypography mb={'15px'} variant="h4">Fetch Payout Status</MDTypography>
        {
          sandbox ? (
            <MDTypography>
              API URL: <code>https://sandbox.payhub.link/payouts/getPayoutStatus</code>
            </MDTypography>
          ) : (
            <MDTypography>
              API URL: <code>https://server.payhub.link/payouts/getPayoutStatus</code>
            </MDTypography>
          )
        }

        <MDTypography>Request Type: <code>POST</code></MDTypography>
        <MDTypography>
          Request Headers (JSON):
        </MDTypography>
        <MDTypography as="pre">
          {`
{
  "apiKey": "your api key",
  "token": "your token"
}
`}
        </MDTypography>
        <MDTypography>
          Request Body (JSON):
        </MDTypography>
        <MDTypography as="pre">
          {`
{
  "emailId": "your registration email",
  "transaction_id": "67264",
}
`}
        </MDTypography>

        <MDTypography mt={'10px'} variant="h6">Success Response:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseData": {
      "amount": 101,
      "transaction_id": "65eed955e4888504d8656cc0",
      "status": "success",
      "code": "00",
      "description": "transaction success"
  }
}
`}
        </MDTypography>

        <MDTypography mt={'10px'} variant="h6">Error Response:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 404,
  "responseMessage": "Please provide valid details.",
  "responseData": {
      "status": "transaction not found"
  }
}
`}
        </MDTypography>
        <MDTypography mt={'10px'} variant="h6">Invalid Details:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 400,
  "responseMessage": "Please provide valid details.",
  "responseData": "Please enter transaction id"
}
`}
        </MDTypography>
        <MDTypography mt={'10px'} variant="h6">Invalid ApiKey:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 403,
  "responseMessage": "Invalid apiKey"
}
`}
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}

export default FetchPayoutStatus;
