import React from 'react';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import Header from 'layouts/docs/header';
import MDBox from 'components/MDBox';
import MDTypography from 'components/MDTypography';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import { Card } from '@mui/material';

const containerStyle = {
  padding: '20px',
  marginTop: '90px',
};

function CallbackandVerifyTransaction() {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Header selectedDocs="CallBack" />

      <MDBox style={containerStyle}>
        <MDTypography mb={'15px'} variant="h4">CallBack</MDTypography>

        <MDTypography mb={1}>
          From your dashboard, update your callback url to receive callbacks for your transactions.
        </MDTypography>
        <MDTypography variant="h6">
          Format:
        </MDTypography>
        <MDTypography as="pre">
          {`
{
  transaction_id: ‘123xyz',
 status: 'success || failed ',
 amount: 10,
 date: '2023-10-27T08:43:27.709Z',
 utr:'123xyz',
 encryptedData:'xyzllsndkwl=='
}

`}
        </MDTypography>
        <MDTypography mb={1}>
          To verify your transaction , you can decrypt the encryptedData property of the callback object using your encryption key.You can get the encryption key from Profile.
        </MDTypography>
        <MDTypography variant="h6">
          Algorithm for decryption:
        </MDTypography>
        <MDTypography as="pre">
          {`
function decryptParameters(input,secretKey){
  const decryptedBytes = CryptoJS.AES.decrypt(input, secretKey);
  const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
  return decryptedData;
}
`}

        </MDTypography>
        <MDTypography mb={1}>
          You can convert this function to the language of your choice:
        </MDTypography>
        <MDTypography variant="h6">Successful Decryption:</MDTypography>
        <MDTypography as="pre">
          {`
{"transaction_id":"o_BbgPok4pPgNERAkX-231113102840",
"amount":5,
"status":"success",
"phone":"9340xyz",
"username":"john doe",
"upiId":"9378dnn@yesbank",
utr:'123xyz',
"transaction_date":"2023-11-13T10:28:41.178Z"}
`}
        </MDTypography>
      </MDBox>
    </DashboardLayout>
  );
}

export default CallbackandVerifyTransaction;
