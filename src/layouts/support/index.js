import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React, { useEffect, useState } from 'react'
import MDBox from 'components/MDBox'
import DefaultNavbar from './DefaultNavbar'
import { useMaterialUIController } from 'context'
import { useConfig } from "../../config"
import FinanceQuery from './financeQuery'
import TechnicalQuery from './technicalQuery'
import AddFinanceQuery from './addFinanceQuery'
import AddTechnicalQuery from './addTechnicalQuery'
import { useLocation } from 'react-router-dom'
function support() {
    const [currentComponent, setCurrentComponent] = useState("FinanceQueries")
    const { apiUrl } = useConfig()
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    const location = useLocation()
    const { data, type } = location.state || {}
    const adminEmail = localStorage.getItem('admin_email');
    const adminApiKey = localStorage.getItem('admin_apiKey');
    useEffect(() => {
        if (type === "dashboard") {
            setCurrentComponent("AddFinanceQuery")
        }
    }, [])
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <DefaultNavbar currentComponentSetter={setCurrentComponent} />
            <MDBox pb={3} mt={9}>
                {
                    currentComponent === "FinanceQueries" ? <FinanceQuery /> : null
                }
                {
                    currentComponent === "TechnicalQueries" ? <TechnicalQuery /> : null
                }
                {
                    currentComponent === "AddFinanceQuery" ? <AddFinanceQuery transactionData={type === "dashboard" ? data : null} componentSetter={setCurrentComponent} /> : null
                }
                {
                    currentComponent === "AddTechnicalQuery" ? <AddTechnicalQuery componentSetter={setCurrentComponent} /> : null
                }
                {/* test */}
                {/* <MDBox mb={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={12}>
                                {
                                    !loading && (<MerchantInformation allMerchants={merchant} getAllMerchantsfunc={getAllMerchants} />)
                                }
                            </Grid>
                        </Grid>
                    </MDBox> */}


                {/* {
                    loading && (
                        <Loader />
                    )
                } */}

            </MDBox>
        </DashboardLayout>
    )
}

export default support