/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
// import MDAvatar from "components/MDAvatar";
import MDBadge from "components/MDBadge";
import { useEffect, useState } from "react";
import { useUser } from "ZustandState/useUser";
import { toast } from 'react-toastify';
import { useConfig } from "../../../config"
import { useNavigate } from "react-router-dom";
// Images
// import team2 from "assets/images/team-2.jpg";
// import team3 from "assets/images/team-3.jpg";
// import team4 from "assets/images/team-4.jpg";
export default function data() {

  const { apiUrl } = useConfig()
  const balance = useUser((state) => state.balance)
  const transactions = useUser((state) => state.transactions)
  const token = localStorage.getItem('user_token');
  const user = useUser((state) => state.user)
  const setUser = useUser((state) => state.setUser)
  const userEmail = localStorage.getItem('user_email')

  const [payments, setPayments] = useState([])
  const [statusChecking, setStatusChecking] = useState(Array(payments.length).fill(false)); // Initialize as an array
  const navigate = useNavigate()
  async function setProfile(body) {
    try {

      const response = await fetch(`${apiUrl}/user/getprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
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
      const userBody = {
        emailId: res.responseData.emailId,
        apiKey: res.responseData.apiKey
      }
      if (res.responseData) {
        setUser(userBody)
      }
    } catch (e) {
      console.log(e)
    }
  }
  const body = {
    emailId: user ? user.emailId : "",
  }
  async function getAllTransactions() {
    try {
      const response = await fetch(`${apiUrl}/user/getallusertransactions`, {
        method: 'POST',
        headers: {
          //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(body)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      if (res.responseCode === 403) {
        toast.error(res?.responseMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
        localStorage.removeItem('user_token');
        navigate('/authentication/sign-in');
      }
      console.log(res.responseData)
      if (res.responseData)
        setPayments(res.responseData.reverse())
      else
        setPayments([])
    } catch (err) {
      console.log("Error Fetching Transactions: ", err)
    }
  }
  async function getTransactionStatus(item) {
    const body = {
      transaction_id: item.transactionId,
    }
    try {
      const response = await fetch(`${apiUrl}/user/gettransactionstatus`, {
        method: 'POST',
        headers: {
          //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(body)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      if (res.responseCode === 403) {
        toast.error(res?.responseMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
        localStorage.removeItem('user_token');
        navigate('/authentication/sign-in');
      }
      return res
    } catch (err) {
      console.log("Error Fetching Transactions: ", err)
    }

  }
  async function getPayinStatus(item) {
    const dateOnly = item.transaction_date.split("T")[0];

    console.log(dateOnly)
    const body = {
      "emailId": user ? user.emailId : "",
      transaction_id: item.transactionId,
      date: dateOnly
    }
    try {
      const response = await fetch(`${apiUrl}/user/getpayinstatus`, {
        method: 'POST',
        headers: {
          //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(body)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      //setPayments(res.responseData)
      if (res.responseCode === 403) {
        toast.error(res?.responseMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
        localStorage.removeItem('user_token');
        navigate('/authentication/sign-in');
      }

      return res
    } catch (err) {
      console.log("Error Fetching Transactions: ", err)
    }

  }


  async function getPayinStatusPinwallet(item) {
    const dateOnly = item.transaction_date.split("T")[0];

    console.log(dateOnly)
    const body = {
      "emailId": user ? user.emailId : "",
      transactionId: item.transactionId,
    }
    try {
      const response = await fetch(`${apiUrl}/user/getpinwalletpayinstatus`, {
        method: 'POST',
        headers: {
          //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(body)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      //setPayments(res.responseData)
      if (res.responseCode === 403) {
        toast.error(res?.responseMessage, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
        });
        localStorage.removeItem('user_token');
        navigate('/authentication/sign-in');
      }

      return res
    } catch (err) {
      console.log("Error Fetching Transactions: ", err)
    }

  }


  async function updateTransactionStatus(item, status, type) {
    let body
    if (status == 'failed') {

      body = {
        "emailId": user ? user.emailId : "tushantxyzz",
        transactionId: item.transactionId,
        status: "failed",
      }
    } else if (status == 'pending') {

      body = {
        "emailId": user ? user.emailId : "tushantxyzz",
        transactionId: item.transactionId,
        status: "IN-PROCESS",
      }
    } else {
      body = {
        "emailId": user ? user.emailId : "tushantxyzz",
        transactionId: item.transactionId,
        status: 'success',
        balance: type == 'payin' ? null : Number(balance) - Number(item.amount)
      }
    }

    try {
      const response = await fetch(`${apiUrl}/user/updatetransaction`, {
        method: 'POST',
        headers: {
          //   'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
          'Content-Type': 'application/json',
          'token': token,
          'apiKey': user ? user.apiKey : ''
        },
        body: JSON.stringify(body)
      })

      if (!response) console.log("Something went wrong")
      const res = await response.json()
      //setPayments(res.responseData)
      console.log(res)
    } catch (err) {
      console.log("Error Fetching Transactions: ", err)
    }
  }
  function formatDateAndTime(dateString) {
    // Check if the date string contains 'T' as a separator (e.g., 2023-09-17T04:40:55.260Z)
    const isISOString = dateString.includes('T');

    // Parse the date string using the appropriate format
    const date = isISOString ? new Date(dateString) : new Date(dateString.replace(' ', 'T'));

    // Format the date and time
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();

    return { formattedDate, formattedTime };
  }
  useEffect(() => {
    const userBody = {
      emailId: userEmail,
      token: token
    }
    setProfile(userBody)
      .then(() => {
        getAllTransactions()
      })
  }, [])

  return {
    columns: [
      { Header: "transaction id", accessor: "transactionid", width: "45%", align: "left" },
      { Header: "UTR", accessor: "UTR", align: "left" },
      { Header: "currency", accessor: "currency", align: "left" },
      { Header: "amount", accessor: "amount", align: "left" },
      { Header: "status", accessor: "status", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "time", accessor: "time", align: "center" },
      { Header: "check status", accessor: "checkstatus", align: "center" },
      { Header: "search", accessor: "search", align: "center" },
    ],

    rows: payments && payments.map((item, index) => ({
      transactionid: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.transactionId}
        </MDTypography>
      ),
      UTR: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.utr}
        </MDTypography>
      ),
      currency: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.currency}
        </MDTypography>
      ),
      amount: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {item.amount && `₹ ${item?.amount || ''}`}
        </MDTypography>
      ),
      status: (
        <MDBox ml={-1}>
          <MDBadge badgeContent={item.status} color={item.status === "Success" || item.status === "success" ? "success" : item.status === "IN-PROCESS" ? "warning" : item.status === "PENDING" ? "warning" : "error"} variant="gradient" size="sm" />
        </MDBox>
      ),
      date: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDateAndTime(item.transaction_date).formattedDate}
        </MDTypography>
      ),
      time: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {formatDateAndTime(item.transaction_date).formattedTime}
        </MDTypography>
      ),
      checkstatus: (
        <div onClick={() => {
          const updatedStatusArray = [...statusChecking];
          updatedStatusArray[index] = true;
          setStatusChecking(updatedStatusArray);
          if (item.status == 'Success' || item.status == 'success') {
            toast.error('Already processed', {
              position: "top-right",
              autoClose: 2000, // Auto close the toast after 3 seconds
              hideProgressBar: false,
            });
            const resetStatusArray = [...statusChecking];
            resetStatusArray[index] = false;
            setStatusChecking(resetStatusArray);
            return;
          }

          if (item.payout_type
            ==
            "PAYIN") {
            const updatedStatusArray = [...statusChecking];
            updatedStatusArray[index] = true;
            setStatusChecking(updatedStatusArray);
            if (item.hash == 'xyzPinwallet') {
              return getPayinStatusPinwallet(item)
                .then((response) => {
                  console.log(response)
                  const resetStatusArray = [...statusChecking];
                  resetStatusArray[index] = false;
                  setStatusChecking(resetStatusArray)
                })
            }
            getPayinStatus(item)
              .then((response) => {
                console.log(response)
                if (response) {

                  if (response?.responseData?.status
                    ==
                    "success") {
                    updateTransactionStatus(item, 'success', 'payin')
                    const resetStatusArray = [...statusChecking];
                    resetStatusArray[index] = false;
                    setStatusChecking(resetStatusArray);

                  } else if (response.responseData.status
                    ==
                    "pending") {
                    updateTransactionStatus(item, 'pending', 'payin')
                    const resetStatusArray = [...statusChecking];
                    resetStatusArray[index] = false;
                    setStatusChecking(resetStatusArray);

                  }
                  else if (response.responseData.status
                    ==
                    "failed") {
                    updateTransactionStatus(item, 'failed', 'payin')
                    const resetStatusArray = [...statusChecking];
                    resetStatusArray[index] = false;
                    setStatusChecking(resetStatusArray);

                  } else {
                    updateTransactionStatus(item, 'failed', 'payin')
                    const resetStatusArray = [...statusChecking];
                    resetStatusArray[index] = false;
                    setStatusChecking(resetStatusArray);

                  }
                }
              }).catch((error) => {
                console.log(error)
              })
          } else {
            const updatedStatusArray = [...statusChecking];
            updatedStatusArray[index] = true;
            setStatusChecking(updatedStatusArray);
            getTransactionStatus(item)
              .then((response) => {
                if (response.responseData.status
                  ==
                  "Success") {
                  updateTransactionStatus(item, 'success', 'payout')
                  getAllTransactions()
                  const resetStatusArray = [...statusChecking];
                  resetStatusArray[index] = false;
                  setStatusChecking(resetStatusArray);

                } else if (response.responseData.statusCode == 400) {
                  updateTransactionStatus(item, 'failed', 'payout')
                  getAllTransactions()
                  const resetStatusArray = [...statusChecking];
                  resetStatusArray[index] = false;
                  setStatusChecking(resetStatusArray);
                }
                else {
                  updateTransactionStatus(item, 'failed', 'payout')
                  getAllTransactions()
                  const resetStatusArray = [...statusChecking];
                  resetStatusArray[index] = false;
                  setStatusChecking(resetStatusArray);
                }
              }).catch((error) => {
                console.log(error)
              })
          }
        }}>
          <MDButton
            color={statusChecking[index] ? "secondary" : "success"}
            variant="gradient"
            fullWidth
          >
            {statusChecking[index] ? "Checking Status..." : "Check Status"}

          </MDButton>
        </div>
      ),
    }))
  };


}
