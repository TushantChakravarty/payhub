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

function PayoutDocs() {
  const sandbox = useSandbox((state) => state.sandbox)
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header selectedDocs="PAYOUTS" />

      <MDBox style={containerStyle}>
        <MDTypography mb={'15px'} variant="h4">PAYOUTS</MDTypography>
        {
          sandbox ? (
            <MDTypography>
              API URL: <code>https://sandbox.payhub.link/payouts/sendPayoutRequest</code>
            </MDTypography>
          ) : (
            <MDTypography>
              API URL: <code>https://server.payhub.link/payouts/sendPayoutRequest</code>
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
          Request Body (JSON): For Upi Payout
        </MDTypography>
        <MDTypography as="pre">
          {`
{
  "emailId": "Your registration email",
  "amount": 100,
  "customer_name": "customer's name",
  "customer_email": "customer's email",
  "customer_phone": "customer's phone",
  "customer_upiId":"customer's upi id",
  "account_name": "customer's name",
  "customer_address":"customer's address",
  "method":"upi"
}
`}
        </MDTypography>
        <MDTypography>
          Request Body (JSON): For Bank Payout
        </MDTypography>
        <MDTypography as="pre">
          {`
{
  "emailId": "Your registration email",
  "amount": 100,
  "customer_name": "customer's name",
  "customer_email": "customer's email",
  "customer_phone": "customer's phone",
  "account_number": "customer's account number",
  "bank_ifsc": "customer's bank ifsc code",
  "account_name": "customer's Account Holder name",
  "bank_name": "customer's bank name",
  "method":"bank"
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
      "message": "Payment request submitted",
      "transaction_id": 9811167405953
  }
}
`}
        </MDTypography>

        <MDTypography mt={'10px'} variant="h6">Error Response:</MDTypography>
        <MDTypography as="pre">
          {`
{
  "responseCode": 400,
  "responseMessage": "Failed to process transaction",
  "responseData": "You don't have enough balance to process this transaction"
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

export default PayoutDocs;
