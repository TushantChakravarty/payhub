import * as React from "react";
import {
    TextField,
    Grid,
    Paper,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import PropTypes from "prop-types";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDAvatar from "components/MDAvatar";
import { useMaterialUIController } from "context";
import { useLocation } from "react-router-dom";
import { Card } from "@mui/material";
import { useConfig } from "../../../config"
import { useState, useEffect, useRef } from "react";
import { format } from 'date-fns';
import { MdChat } from "react-icons/md"
import DefaultInfoCard from "./DefaultInfoCard";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { formatChatDate, capitalizeFirstLetter } from "util/formatTimeAndDate";
import CryptoJS from "crypto-js";
const ChatUI = () => {
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    const messagesRef = useRef(null);
    const location = useLocation()
    const { item, category } = location.state
    const [input, setInput] = useState("");
    const [chat, setChat] = useState()
    const userApiKey = localStorage.getItem('user_apiKey')
    const { supportApiUrl, secretKey } = useConfig()
    const handleSend = () => {
        if (input.trim() !== "") {
            setInput("");
            sendMessage(input)
        }
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };
    function decryptObject(encryptedData) {
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedData.data, secretKey);
        var decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
        var decryptedJsonData = JSON.parse(decryptedData);
        return decryptedJsonData
    }
    const handleChat = async () => {
        try {
            const response = await fetch(`${supportApiUrl}/api/chat/merchant/create/${item?._id}`, {
                method: 'POST',
                headers: {
                    "apiKey": userApiKey,
                    'Content-Type': 'application/json',
                },
            })

            if (!response) return;
            const res = await response.json()
            if (res.responseCode !== 200) return;
            const encryptedData = res?.encryptedResponseData
            const deycryptedData = decryptObject(encryptedData)
            setChat(deycryptedData)
        } catch (err) {
            console.log("Error Fetching Chat: ", err)
        }
    }
    const sendMessage = async (message) => {
        try {
            let body = {
                message
            }
            const response = await fetch(`${supportApiUrl}/api/chat/merchant/message/create/${item?._id}`, {
                method: 'POST',
                headers: {
                    "apiKey": userApiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })

            if (!response) return;
            const res = await response.json()
            if (res.responseCode !== 200) return;
            const encryptedData = res?.encryptedResponseData
            const deycryptedData = decryptObject(encryptedData)
            setChat(deycryptedData)
            scrollToBottom()
        } catch (err) {
            console.log("Error Fetching Chat: ", err)
        }
    }
    const scrollToBottom = () => {
        try {
            const domNode = messagesRef?.current;
            if (!domNode) return;

            const scroll = (target) => {
                const scrollHeight = target.scrollHeight;
                const scrollTop = target.scrollTop;
                const scrollRemaining = scrollHeight - scrollTop;
                const step = scrollRemaining / 10;

                let requestId;

                const animateScroll = () => {
                    const isBottom =
                        Math.ceil(target.scrollTop + target.clientHeight) >=
                        target.scrollHeight;

                    if (!isBottom) {
                        target.scrollTop += step;
                        requestId = requestAnimationFrame(animateScroll);
                    } else {
                        cancelAnimationFrame(requestId);
                    }
                };

                requestId = requestAnimationFrame(animateScroll);
            };

            setTimeout(() => {
                scroll(domNode);
            }, 200); // start animation after 200ms
        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        handleChat()
        const timerId = setInterval(() => {
            handleChat();
        }, 2000);

        // Clean up the timer on component unmount
        return () => clearInterval(timerId);
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [])
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container spacing={3}>
                <Grid item xl={8} lg={4} sm={12} xs={12}>
                    <Grid mt={1} container spacing={3}>
                        <Grid xs={12} sm={12} xl={5}>
                            {
                                category === "finance" ? (
                                    <DefaultInfoCard
                                        amount={chat?.query?.amount}
                                        txStatus={chat?.query?.transactionStatus}
                                        txId={chat?.query?.transactionId}
                                        txDate={chat?.query?.transactionDate.split('T')[0]}
                                        category={category}
                                    />
                                ) : (
                                    <DefaultInfoCard
                                        subject={chat?.query?.subject}
                                        category={category}
                                    />
                                )
                            }
                        </Grid>
                        <Grid xs={12} sm={12} xl={6}>
                            <Card>
                                <MDBox pt={1} pb={3} px={1} height={'27vh'}>
                                    <MDTypography pt={0.5} pb={0.5} variant="h6" gutterBottom>
                                        Attachments
                                    </MDTypography>
                                    {chat?.query && (
                                        <MDBox
                                            display="grid"
                                            gridTemplateColumns="repeat(auto-fill, minmax(30%, 1fr))"
                                            gap={2}
                                            height="80%"
                                        >
                                            {chat?.query?.images?.map((image, index) => (
                                                <MDBox
                                                    key={index}
                                                    border={darkMode ? '1px solid white' : '1px solid black'}
                                                    borderRadius="4px"
                                                    overflow="hidden"
                                                    onClick={() => {
                                                        window.open(image?.imageUrl, '_blank');
                                                    }}
                                                >

                                                    <img
                                                        src={image?.imageUrl}
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
                    <Grid mt={8} px={2} container spacing={3}>
                        <Grid item xs={12} sm={12} xl={11.3}>
                            <Card>
                                <MDBox bgColor={darkMode ? "#nnn" : "white"} pt={2} pb={3} px={3} height={'40vh'} style={{ overflowY: 'auto' }}
                                    sx={{
                                        "::-webkit-scrollbar": {
                                            width: 0.5, // Adjust the width as needed
                                        },
                                        "::-webkit-scrollbar-thumb": {
                                            background: "#nnn", // Make the thumb transparent
                                        },
                                        scrollbarWidth: "thin", // For Firefox
                                        scrollbarColor: "transparent transparent", // For Firefox
                                    }}
                                >
                                    <MDTypography pt={0.5} pb={1.5} variant="h6" gutterBottom>
                                        Query Note
                                    </MDTypography>
                                    <List sx={{ width: '100%' }}>
                                        {
                                            chat?.query?.description &&
                                            <MDBox>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <MDAvatar sx={{
                                                            bgcolor: "secondary.main",
                                                            width: 32, height: 32
                                                        }}>
                                                            {"S"}
                                                        </MDAvatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <MDTypography>
                                                                Support
                                                            </MDTypography>

                                                        }
                                                        secondary={
                                                            <MDBox color={darkMode ? "white" : "black"}>
                                                                <MDTypography
                                                                    sx={{ display: 'inline', fontWeight: 'bold' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                >
                                                                    {formatChatDate(chat?.query?.resolvedAt)}
                                                                </MDTypography>
                                                                {` — ${chat?.query?.description}`}
                                                            </MDBox>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider variant="inset" component="li" />
                                            </MDBox>
                                        }
                                        {
                                            chat?.query?.note &&
                                            <MDBox>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemAvatar>
                                                        <MDAvatar sx={{
                                                            bgcolor: "primary.main",
                                                            width: 32, height: 32
                                                        }}>
                                                            {chat?.chat?.businessName[0]}
                                                        </MDAvatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={
                                                            <MDTypography>

                                                                {capitalizeFirstLetter(chat?.chat?.businessName)}
                                                            </MDTypography>
                                                        }
                                                        secondary={
                                                            <MDBox color={darkMode ? "white" : "black"}>
                                                                <MDTypography
                                                                    sx={{ display: 'inline', fontWeight: 'bold' }}
                                                                    component="span"
                                                                    variant="body2"
                                                                >
                                                                    {formatChatDate(chat?.query?.createdAt)}
                                                                </MDTypography>
                                                                {` — ${chat?.query?.note}`}
                                                            </MDBox>
                                                        }
                                                    />
                                                </ListItem>
                                                <Divider sx={{ marginTop: 3 }} variant="inset" component="li" />
                                            </MDBox>
                                        }
                                    </List>

                                </MDBox>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xl={4} lg={4} xs={12} sm={12}>
                    <MDBox
                        p={0.2}
                        mt={-2}
                        sx={{
                            height: "80vh",
                            display: "flex",
                            flexDirection: "column",
                            bgcolor: "grey.200",
                            border: "0.1px solid #ccc", // Add this line for the border
                            borderRadius: "8px", // You can adjust the border-radius as needed
                        }}
                    >
                        <Card
                            sx={{
                                backgroundColor: theme => theme.palette.dark.main,
                                borderBottomLeftRadius: "0",
                                borderBottomRightRadius: "0",
                                textAlign: "center", // Align the text at the center
                            }}
                        >
                            <MDBox
                                sx={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    py: 2,
                                }}
                            >
                                <MDTypography variant="h6" color="white">
                                    Live Support Chat
                                </MDTypography>
                            </MDBox>
                        </Card>
                        {
                            chat?.chat?.chatMessages?.length < 1 ? (
                                <MDBox
                                    display="flex"
                                    flexDirection="column"
                                    alignItems="center"
                                    justifyContent="center"
                                    height="100%"
                                    width="100%"
                                    className="animate__animated animate__fadeIn"
                                    bgColor="white"
                                >

                                    <MDBox
                                        mt={3}
                                        display="flex"
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="space-between"
                                        className="space-y-4"
                                    >
                                        <MDBox display="flex" alignItems="center" justifyContent="center">
                                            <MdChat
                                                style={{
                                                    fontSize: '3rem', // Adjust the size as needed
                                                    color: 'grey-300', // Use the desired colors
                                                }}
                                            />
                                        </MDBox>
                                        <MDBox display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                                            <MDTypography variant="body2" color={"textSecondary"}>
                                                Start Chat
                                            </MDTypography>
                                            <MDTypography variant="body2" color={"textSecondary"}>
                                                Send a message to start chat
                                            </MDTypography>
                                        </MDBox>
                                    </MDBox>
                                </MDBox>
                            ) : (

                                <MDBox bgColor="white" ref={messagesRef} sx={{
                                    flexGrow: 1,
                                    overflow: "auto",
                                    p: 2,
                                    "::-webkit-scrollbar": {
                                        width: 0.5, // Adjust the width as needed
                                    },
                                    "::-webkit-scrollbar-thumb": {
                                        background: "#nnn", // Make the thumb transparent
                                    },
                                    scrollbarWidth: "thin", // For Firefox
                                    scrollbarColor: "transparent transparent", // For Firefox
                                }}>
                                    {chat?.chat?.chatMessages && chat?.chat?.chatMessages.map((item, index) => (
                                        <Message key={index} message={item} />
                                    ))}
                                </MDBox>
                            )
                        }

                        <MDBox bgColor="white" sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <input
                                        type="text"
                                        size="large"
                                        style={{ width: '100%', height: "5vh", padding: "2px" }} // Adjust width as needed
                                        placeholder="Type a message"
                                        value={input}
                                        onChange={handleInputChange}
                                        onKeyPress={(event) => {
                                            if (event.key === 'Enter') {
                                                event.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={3}>
                                    <MDButton
                                        fullWidth
                                        color="info"
                                        variant="contained"
                                        endIcon={<SendIcon />}
                                        onClick={handleSend}
                                    >
                                        Send
                                    </MDButton>
                                </Grid>
                            </Grid>
                        </MDBox>
                    </MDBox>
                </Grid>

            </Grid>

        </DashboardLayout>
    );
};

const Message = ({ message }) => {
    const isMine = message?.senderRole === "merchant";
    const [controller] = useMaterialUIController()
    const { darkMode } = controller

    return (
        <MDBox
            sx={{
                display: "flex",
                justifyContent: !isMine ? "flex-start" : "flex-end",
                mb: 2,
            }}
        >
            <MDBox
                sx={{
                    display: "flex",
                    flexDirection: !isMine ? "row" : "row-reverse",
                    alignItems: "center",
                }}
            >
                <MDAvatar sx={{
                    bgcolor: !isMine ? "primary.main" : "secondary.main",
                    width: 32, height: 32
                }}>
                    {isMine ? message?.senderName[0] : message?.senderName[0]}
                </MDAvatar>

                <Paper
                    variant="outlined"
                    sx={{
                        p: 1,
                        ml: !isMine ? 1 : 0,
                        mr: !isMine ? 0 : 1,
                        backgroundColor: !isMine
                            ? "grey.200"
                            : (theme) => theme.palette.info.main,
                        borderRadius: !isMine
                            ? "20px 20px 20px 5px"
                            : "20px 20px 5px 20px",
                        whiteSpace: "normal", // Allow text to wrap
                        wordBreak: "break-word", // Break words if they are too long
                    }}
                >
                    <MDBox display={'flex'} flexDirection={'column'}>
                        <MDTypography
                            variant="body2" // You can use "body1", "body2", or customize further
                            color={darkMode && !isMine ? "black" : !darkMode && !isMine ? "dark" : "white"}
                        >
                            {message?.message}
                        </MDTypography>
                        <MDTypography
                            variant="caption" // You can adjust the variant as needed
                            color={darkMode && !isMine ? "black" : !darkMode && !isMine ? "dark" : "white"}
                        >
                            {formatChatDate(message?.createdAt)}
                        </MDTypography>
                    </MDBox>
                </Paper>


            </MDBox>
        </MDBox>
    );
};

Message.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.number.isRequired,
        message: PropTypes.string.isRequired,
        senderName: PropTypes.string,
        senderRole: PropTypes.string.isRequired,
        createdAt: PropTypes.string.isRequired,
    }).isRequired,
};

export default ChatUI;