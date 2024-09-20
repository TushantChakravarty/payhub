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

function PayinDocs() {
  const sandbox = useSandbox((state) => state.sandbox)
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header selectedDocs="PAYIN" />
      <MDBox style={containerStyle}>
        <MDTypography mb={'15px'} variant="h4"> PAYIN</MDTypography>
        {
          sandbox ? (
            <MDTypography>
              API URL: <code>https://sandbox.payhub.link/user/sendpayinrequest</code>
            </MDTypography>
          ) : (
            <MDTypography>
              API URL: <code>https://server.payhub.link/user/sendpayinrequest</code>
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
  "upiId": "customer upi id",
  "amount": "100",
  "username": "customer name",
  "phone": "customer phone number",
  "customer_email: "customer email"
}
`}
        </MDTypography>

        <MDTypography mt={'15px'} variant="h6">Success Response:</MDTypography>
        {/* <MDTypography>
          Open the link in mobile to do the payment.
        </MDTypography> */}
        <MDTypography as="pre">
          {`
{
  "responseCode": 200,
  "responseMessage": "Success",
  "responseData": {
      "url": "upi://pay?pa=merchant1457308.augp@aubank&pn=Payhub&tn=652bbe30852dd908c009d988&tr=652bbe30852dd908c009d988&am=10.0&cu=INR",
      "transaction_id:"123xyz"
  }
}
`}
        </MDTypography>

        <MDTypography mt={'15px'} variant="h6">Error Response (Invalid API Key):</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 403,
  "responseMessage": "Invalid apiKey"
}
`}
        </MDTypography>

        <MDTypography mt={'15px'} variant="h6">Error Response (Invalid User):</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 400,
  "responseMessage": "User does not exist"
}
`}
        </MDTypography>

        <MDTypography mt={'15px'} variant="h6">Error Response (Invalid Details):</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 400,
  "responseMessage": "Invalid details"
}
`}
        </MDTypography>

        <MDTypography mt={'15px'} mb={'15px'}>
          After successful payin using the link, please go to the dashboard to check status. If the transaction was successful, it will reflect in your balance.
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}

export default PayinDocs;
