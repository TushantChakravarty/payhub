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

/** 
  All of the routes for the Material Dashboard 2 React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
// import Tables from "layouts/tables";
// import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
// import Notifications from "layouts/notifications";
import Profile from "layouts/profile";
// import Developer from "layouts/developer";
import SignIn from "layouts/authentication/sign-in";
// import SignUp from "layouts/authentication/sign-up";
import ResetPassword from "layouts/authentication/reset-password/cover";
import Logout from "layouts/authentication/logout";
// import AddPayment from "layouts/tables/addPayment"
// import AddMoney from "layouts/tables/addMoney"
import AddCallback from "layouts/callback"
import AddRedirectUrl from "layouts/redirectUrl"
// @mui icons
import Icon from "@mui/material/Icon";
// docs
import Docs from "layouts/docs"
import PayinDocs from "layouts/docs/payinDocs"
import PayinIntentDocs from "layouts/docs/payinIntent"
// import PayinCollectDocs from "layouts/docs/payin-collect"
import FetchPayinStatusDocs from "layouts/docs/fetchPayinDocs"
import PayinPageRequest from "layouts/docs/payinPageRequest"
import PayoutDocs from "layouts/docs/payoutDocs";
import FetchPayoutStatusDocs from "layouts/docs/fetchPayoutDocs"
import CallbackAndVerifyTransaction from "layouts/docs/callback-verifyTransaction"
import Settlements from "layouts/settlements"
import Topups from "layouts/topups"
import DailyLogs from "layouts/daily-logs"
import Support from "layouts/support"
import Chat from "layouts/support/chat"
import Payouts from "layouts/payoutDash"
const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  {
    type: "collapse",
    name: "Payouts",
    key: "payouts",
    icon: <Icon fontSize="small">arrow_outward</Icon>,
    route: "/payouts",
    component: <Payouts />,
  },
  // {
  //   type: "collapse",
  //   name: "Payment",
  //   key: "payments",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/payment",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Withdraw",
  //   key: "withdraw",
  //   icon: <Icon fontSize="small">money</Icon>,
  //   route: "/withdraw",
  //   component: <AddPayment />,
  // },
  {
    type: "collapse",
    name: "Settlement",
    key: "settlement",
    icon: <Icon fontSize="small">receipt_long</Icon>,
    route: "/settlement",
    component: <Settlements />,
  },
  {
    type: "collapse",
    name: "Topups",
    key: "topups",
    icon: <Icon fontSize="small">description</Icon>,
    route: "/topups",
    component: <Topups />,
  },
  {
    type: "collapse",
    name: "Daily Logs",
    key: "daily-logs",
    icon: <Icon fontSize="small">date_range</Icon>,
    route: "/daily-logs",
    component: <DailyLogs />,
  },
  {
    type: "collapse",
    name: "Tech Support",
    key: "support",
    icon: <Icon fontSize="small">record_voice_over</Icon>,
    route: "/support",
    component: <Support />,
  },
  // {
  //   type: "collapse",
  //   name: "Add Money",
  //   key: "add-money",
  //   icon: <Icon fontSize="small">money</Icon>,
  //   route: "/add-money",
  //   component: <AddMoney />,
  // },
  {
    type: "collapse",
    name: "Api Docs",
    key: "docs",
    icon: <Icon fontSize="small">book</Icon>,
    route: "/docs",
    component: <Docs />,
  },
  {
    type: "collapse",
    name: "Add Callback Url",
    key: "add-callback",
    icon: <Icon fontSize="small">link</Icon>,
    route: "/add-callback",
    component: <AddCallback />,
  },

  {
    type: "collapse",
    name: "Add RedirectUrl",
    key: "add-redirect",
    icon: <Icon fontSize="small">link</Icon>,
    route: "/add-redirect",
    component: <AddRedirectUrl />,
  },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">person</Icon>,
    route: "/profile",
    component: <Profile />,
  },
  // {
  //   type: "collapse",
  //   name: "Developer",
  //   key: "developer",
  //   icon: <Icon fontSize="small">code</Icon>,
  //   route: "/developer",
  //   component: <Developer />,
  // },
  {
    //type: "collapse",
    //name: "Chat",
    key: "chat",
    //icon: <Icon fontSize="small">mark_email_read</Icon>,
    route: "/chat",
    component: <Chat />,
  },
  // {
  //   //type: "collapse",
  //   //name: "Docs",
  //   key: "docs",
  //   //icon: <Icon fontSize="small">book</Icon>,
  //   route: "/docs",
  //   component: <Docs />,
  // },
  {
    type: "collapse",
    name: "Log Out",
    key: "Log-out",
    icon: <Icon fontSize="small">logout</Icon>,
    route: "/authentication/logout",
    component: <Logout />,
  },
  {
    //type: "collapse",
    //name: "Reset Password",
    key: "change-password",
    // icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/change-password",
    component: <ResetPassword />,
  },
  {
    //type: "collapse",
    //name: "Sign In",
    key: "sign-in",
    //icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    //type: "collapse",
    // name: "payins",
    key: "payin",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/payin", // This should match the route path
    component: <PayinDocs />,
  },
  {
    //type: "collapse",
    // name: "payins",
    key: "payin-intent",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/payin-intent", // This should match the route path
    component: <PayinIntentDocs />,
  },
  // {
  //   //type: "collapse",
  //   // name: "payins",
  //   key: "payin-collect",
  //   //icon: <Icon fontSize="small">money</Icon>,
  //   route: "/docs/payin-collect", // This should match the route path
  //   component: <PayinCollectDocs />,
  // },
  {
    //type: "collapse",
    // name: "payins",
    key: "fetch-payin-status",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/payin-status", // This should match the route path
    component: <FetchPayinStatusDocs />,
  },
  {
    //type: "collapse",
    // name: "payins",
    key: "payout",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/payout", // This should match the route path
    component: <PayoutDocs />,
  },
  {
    //type: "collapse",
    // name: "payins",
    key: "fetch-payout-status",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/payout-status", // This should match the route path
    component: <FetchPayoutStatusDocs />,
  },
  {
    //type: "collapse",
    // name: "payins",
    key: "callback-VerifyTransaction",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/callback-verify", // This should match the route path
    component: <CallbackAndVerifyTransaction />,
  },
  {
    //type: "collapse",
    // name: "payins",
    key: "payinPageRequest",
    //icon: <Icon fontSize="small">money</Icon>,
    route: "/docs/payin-page-request", // This should match the route path
    component: <PayinPageRequest />,
  },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },

];

export default routes;
