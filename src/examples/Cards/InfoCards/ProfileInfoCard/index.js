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

// react-routers components
import { Link } from "react-router-dom";

// prop-types is library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
// import Tooltip from "@mui/material/Tooltip";
import Icon from "@mui/material/Icon";
import { toast } from "react-toastify";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";
import typography from "assets/theme/base/typography";
import MDButton from "components/MDButton";
import { useState } from "react";

function ProfileInfoCard({ title, description, info, social, action, shadow, showBtnTest }) {
  const labels = [];
  const values = [];
  const { socialMediaColors } = colors;
  const { size } = typography;
  const [apiKeyVisibility, setApiKeyVisibility] = useState(false)
  const [encryptionKeyVisibility, setEncryptionKeyVisibility] = useState(false)
  // Convert this form `objectKey` of the object key in to this `object key`
  Object.keys(info).forEach((el) => {
    if (el.match(/[A-Z\s]+/)) {
      const uppercaseLetter = Array.from(el).find((i) => i.match(/[A-Z]+/));
      const newElement = el.replace(uppercaseLetter, `${uppercaseLetter.toLowerCase()}`);
      labels.push(newElement);
    } else {
      labels.push(el);
    }
  });
  const handleCopyToClipboard = (data, key) => {

    const dataToCopy = data;
    navigator.clipboard.writeText(dataToCopy);
    toast.success(`${key} copied`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
    });
  };
  const handleVisibility = (key) => {
    key === "apiKey" ? setApiKeyVisibility(!apiKeyVisibility) : setEncryptionKeyVisibility(!encryptionKeyVisibility)
  };
  // Push the object values into the values array
  Object.values(info).forEach((el) => values.push(el));

  // Render the card info items
  const renderItems = labels.map((label, key) => (

    <MDBox key={label} flexWrap="wrap" display="flex" py={1} pr={2}>
      <MDTypography width="10vh" variant="button" fontWeight="bold" textTransform="capitalize">
        {label}:
      </MDTypography>
      {
        label !== "apikey" && label !== "encryptionkey" &&
        <MDTypography wordWrap={true} maxWidth="100%" ml={2} variant="button" fontWeight="regular" color="text">
          &nbsp;{values[key]}
        </MDTypography>

      }

      {
        label === "apikey" && <>
          <MDTypography ml={2} wordWrap={true} maxWidth="100%" variant="button" fontWeight="regular" color="text">
            {apiKeyVisibility ? values[key] : "*".repeat(values[key].length)}
          </MDTypography>
          <MDBox ml={1} >
            {
              apiKeyVisibility ? (
                < Icon onClick={() => handleVisibility("apiKey")} variant="a" color="text">
                  visibility_off
                </Icon>
              ) : (
                < Icon onClick={() => handleVisibility("apiKey")} variant="a" color="text">
                  visibility
                </Icon>
              )
            }
            < Icon onClick={() => handleCopyToClipboard(values[key], "ApiKey")} variant="a" color="text">
              copy
            </Icon>
          </MDBox>
        </>
      }
      {
        label === "encryptionkey" && <>
          <MDTypography wordWrap={true} maxWidth="100%" ml={2} variant="button" fontWeight="regular" color="text">
            {encryptionKeyVisibility ? values[key] : "*".repeat(values[key].length)}
          </MDTypography>
          <MDBox ml={1}>
            {
              encryptionKeyVisibility ? (
                < Icon onClick={() => handleVisibility("encryptionKey")} variant="a" color="text">
                  visibility_off
                </Icon>
              ) : (
                < Icon onClick={() => handleVisibility("encryptionKey")} variant="a" color="text">
                  visibility
                </Icon>
              )
            }
            < Icon onClick={() => handleCopyToClipboard(values[key], "EncryptionKey")} variant="a" color="text">
              copy
            </Icon>
          </MDBox>
        </>
      }

    </MDBox >
  ));

  // Render the card social media icons
  // const renderSocial = social.map(({ link, icon, color }) => (
  //   <MDBox
  //     key={color}
  //     component="a"
  //     href={link}
  //     target="_blank"
  //     rel="noreferrer"
  //     fontSize={size.lg}
  //     color={socialMediaColors[color].main}
  //     pr={1}
  //     pl={0.5}
  //     lineHeight={1}
  //   >
  //     {icon}
  //   </MDBox>
  // ));

  return (
    <Card sx={{ height: "100%", width: "100vh", boxShadow: !shadow && "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {
          showBtnTest && (
            <MDButton target="_blank" component={Link} to={action.route} color="info">
              View Documentation
            </MDButton>
          )
        }

        {/* <MDTypography component={Link} to={action.route} variant="body2" color="secondary">
          <Tooltip title={action.tooltip} placement="top">
            <Icon>edit</Icon>
          </Tooltip>
        </MDTypography> */}
      </MDBox>
      <MDBox px={2}>
        {/* <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            {description}
          </MDTypography>
        </MDBox> */}
        {/* <MDBox opacity={0.3}>
          <Divider />
        </MDBox> */}
        <MDBox>
          {
            renderItems
          }
          <MDBox display="flex" py={1} pr={2}>
            {/* <MDTypography variant="button" fontWeight="bold" textTransform="capitalize">
              social: &nbsp;
            </MDTypography>
            {renderSocial} */}
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

// Setting default props for the ProfileInfoCard
ProfileInfoCard.defaultProps = {
  shadow: true,
  showBtnTest: false
};

// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  info: PropTypes.objectOf(PropTypes.string),
  social: PropTypes.arrayOf(PropTypes.object),
  action: PropTypes.shape({
    route: PropTypes.string,
    tooltip: PropTypes.string,
  }),
  shadow: PropTypes.bool,
  showBtnTest: PropTypes.bool
};

export default ProfileInfoCard;
