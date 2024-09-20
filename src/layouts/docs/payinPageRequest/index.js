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

function PayinIntentDocs() {
    const sandbox = useSandbox((state) => state.sandbox)
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Header selectedDocs="PAYIN PAGE " />

            <MDBox style={containerStyle}>
                <MDTypography mb={'15px'} variant="h4">PAYIN PAGE</MDTypography>
                {
                    sandbox ? (
                        <MDTypography>
                            API URL: <code>https://sandbox.payhub.link/user/sendPayinPageRequest</code>
                        </MDTypography>
                    ) : (
                        <MDTypography>
                            API URL: <code>https://server.payhub.link/user/sendPayinPageRequest</code>
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
    "emailId":'your registration email',
    "upiId":"customer upi id",
    "amount":"100",
    "username":"customer name",
    "phone":"customer phone number",
    "customer_email" : "customer email "
    }
`}
                </MDTypography>

                <MDTypography mt={'15px'} variant="h6">Success Response:</MDTypography>
                <MDTypography>
                    You will get a payment page url which you can open and complete the payment
                </MDTypography>
                <MDTypography as="pre">
                    {`
{
    "responseCode": 200,
    "responseMessage": "Success",
    "responseData": {
        "url": "https://payments.payhub.link/?amount=amount&email=youremail.com&phone=phone&username=username&txid=o_DPjeq6yX1hadsahgfhtkjklZ04cWs",
        "transaction_id": "o_DPjeq6yX1hadsahgfhtkjklZ04cWs"
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

                {/* <MDTypography mt={'15px'} mb={'15px'}>
                    After you do a successful payin using the link by opening it on mobile, please go to the dashboard and click on check status. If the transaction was successful, it will reflect in your balance.
                </MDTypography> */}
            </MDBox>
        </DashboardLayout>
    );
}

export default PayinIntentDocs;
