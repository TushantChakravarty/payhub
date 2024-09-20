import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Header from 'layouts/docs/header';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';

const containerStyle = {
    padding: '20px',
    marginTop: '90px',
};

function PayinCollect() {
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Header selectedDocs="PAYIN COLLECT" />

            <MDBox style={containerStyle}>
                <MDTypography mb={'15px'} variant="h4">PAYIN COLLECT</MDTypography>

                <MDTypography>
                    API URL: <code>https://server.payhub.link/user/sendpayinrequestcollect</code>
                </MDTypography>
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
 "emailId":"your registration email",
 "amount":"5",
 "username":"your name",
 "phone":"your phone number",
 "customer_email": "customer email"
}`}
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
        "message": "Payment initiated",
        "amount": "5",
        "transaction_id": "187287247",
        "transaction_date": "2023-11-28T13:34:43.996Z",
        "transaction_url": "https://mercury-t2.phonepe.com/transact/pg?token=YzQxMjlkZTViNTQ3ZWQyZmYxZjc5N2M2OGY0MmU1YTE5ZTBkY2QzMzVmYmZlOTNiMmM1MDVhMGRjODg0YjEyYzFiYzhjNzg0YmFiZjpjNDk2NTZjMzgyMGExODZmMWYwNjJmMjBlOTU4MmQwZA"
    }
}
`}
                </MDTypography>

                <MDTypography mt={'15px'} variant="h6">Error Response (Invalid apiKey):</MDTypography>
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
            </MDBox>
        </DashboardLayout>
    );
}

export default PayinCollect;
