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

import { useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation, useNavigate, Outlet } from "react-router-dom";
// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";
import { useConfig } from '../src/config'
// Images
import brandWhite from "assets/images/1.png";
import brandDark from "assets/images/payhub-black.jpg";
import { useUser } from "ZustandState/useUser";
import Docs from "layouts/docs"
export default function App() {
  const { apiUrl, supportApiUrl } = useConfig()
  const setUser = useUser((state) => state.setUser)
  const userEmail = localStorage.getItem('user_email')
  const userApiKey = localStorage.getItem('user_apiKey');
  const [QueryNotification, setQueryNotification] = useState('')
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const location = useLocation();
  const isAuthRoute = location.pathname === '/authentication/sign-in';
  const navigate = useNavigate(); // Hook for programmatic navigation
  async function setProfile(body) {
    try {
      const response = await fetch(`${apiUrl}/user/getprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      const res = await response.json();
      if (res.responseCode !== 200) {
        // toast.error(res.responseMessage, {
        //   position: "top-right",
        //   autoClose: 2000, // Auto close the toast after 3 seconds
        //   hideProgressBar: false,
        // });
        console.log('unable to get user')
        return;
      }

      const userBody = {
        emailId: res.responseData.emailId,
        apiKey: res.responseData.apiKey
      }
      if (res.responseData) {
        setUser(userBody)
        setBalance(res?.responseData?.balance)
        setTransactions(res?.responseData?.transactions.length)
      }
    } catch (e) {
      console.log(e)
    }
  }
  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      // Redirect to dashboard if user is authenticated and trying to access /authentication/sign-in
      if (window.location.pathname === '/authentication/sign-in') {
        navigate('/dashboard');
      }
    } else {
      // Redirect to sign-in page if user is not authenticated
      navigate('/authentication/sign-in');
    }
  }, [navigate]);

  useEffect(() => {
    const userBody = {
      emailId: userEmail
    }
    setProfile(userBody)
  }, [])
  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });
  const getQueryNotification = async () => {
    try {
      const response = await fetch(`${supportApiUrl}/api/chat/merchant/message/pending`, {
        method: 'GET',
        headers: {
          "apiKey": userApiKey,
          "emailId": userEmail,
          'Content-Type': 'application/json',
        },
      })
      if (!response) return;
      const res = await response.json()
      if (res.responseCode !== 200) return;
      setQueryNotification(res.responseData)
    } catch (err) {
      console.log("Error Fetching getQueryNotification: ", err)
    }
  }
  useEffect(() => {
    // Run getQueryNotification on component mount
    getQueryNotification();

    // Set up a timer to run getQueryNotification every 2000ms if not on the sign-in route
    if (!isAuthRoute) {
      const timerId = setInterval(() => {
        getQueryNotification();
      }, 3600000);

      // Clean up the timer on component unmount
      return () => clearInterval(timerId);
    }
  }, [isAuthRoute]);

  const updatedRoutes = routes.map(route => {
    if (route.key === "support") {
      return { ...route, notificationCount: QueryNotification.totalAgentMessageCount };
    }
    return route;
  });
  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
        <CssBaseline />
        {layout === "dashboard" && (
          <>
            <Sidenav
              color={sidenavColor}
              brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
              brandName="PAYHUB"
              routes={updatedRoutes}
              onMouseEnter={handleOnMouseEnter}
              onMouseLeave={handleOnMouseLeave}
            />
            <Configurator />
            {configsButton}
          </>
        )}
        {layout === "vr" && <Configurator />}
        <Routes>
          {getRoutes(updatedRoutes)}
          <Route path="/docs/*" element={<Docs />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && (
        <>
          <Sidenav
            color={sidenavColor}
            brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
            brandName="PAYHUB"
            routes={updatedRoutes}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
          />
          <Configurator />
          {configsButton}
        </>
      )}
      {layout === "vr" && <Configurator />}
      <Routes>
        {getRoutes(updatedRoutes)}
        <Route path="/docs/*" element={<Docs />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </ThemeProvider>

  );
}
