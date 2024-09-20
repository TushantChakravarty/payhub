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

function FetchPayinStatus() {
  const sandbox = useSandbox((state) => state.sandbox)
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header selectedDocs="Fetch Payin Status" />

      <MDBox style={containerStyle}>
        <MDTypography mb={'15px'} variant="h4">Fetch Payin Status</MDTypography>
        {
          sandbox ? (
            <MDTypography>
              API URL: <code>https://sandbox.payhub.link/user/getpayinstatus</code>
            </MDTypography>
          ) : (
            <MDTypography>
              API URL: <code>https://server.payhub.link/user/getpayinstatus</code>
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
  "date": "2023-09-20",
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
      "amount": 10,
      "transaction_id": "286178304",
      "status": "success",
      "code": "00",
      "description": "transaction success"
  }
}
`}
        </MDTypography>

        <MDTypography mt={'10px'} variant="h6">Pending Response:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseData": {
      "amount": 10,
      "transaction_id": "284111275",
      "status": "pending",
      "code": "01",
      "description": "transaction pending"
  }
}
`}
        </MDTypography>
        <MDTypography mt={'10px'} variant="h6">Failed Response:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseData": {
      "amount": 10,
      "transaction_id": "286623381",
      "status": "failed",
      "code": "02",
      "description": "Customer failed to complete transaction"
  }
}
`}
        </MDTypography>
        <MDTypography mt={'10px'} variant="h6">Expired Response:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseData": {
      "amount": 10,
      "transaction_id": "o_dd4jmJQErxxgEb41-240228174258",
      "status": "expired",
      "code": "U69",
      "description": "Collect request expired"
  }
}
`}
        </MDTypography>
        <MDTypography mt={'10px'} variant="h6">Invalid Tx Id:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 400,
  "responseMessage": "Please provide valid details.",
  "responseData": "Please enter transaction id"
}
`}
        </MDTypography>
        <MDTypography mt={'10px'} variant="h6">Invalid Tx Date:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 400,
  "responseMessage": "Please provide valid details.",
  "responseData": "Please enter transaction date"
}
`}
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}

export default FetchPayinStatus;
