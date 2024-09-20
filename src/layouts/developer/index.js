import { Card, Grid } from '@mui/material'
import MDTypography from 'components/MDTypography'
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from 'examples/Navbars/DashboardNavbar'
import React from 'react'
import ProfileInfoCard from 'examples/Cards/InfoCards/ProfileInfoCard'
import { useMaterialUIController } from 'context'
function Developer() {
    const [controller] = useMaterialUIController()
    const { darkMode } = controller
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid container spacing={1}>
                <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                    <MDTypography variant="caption" fontWeight="medium" fontSize="medium" color={darkMode ? "white" : "black"}>Merchant Information</MDTypography>
                    <ProfileInfoCard
                        //description="Hi, I’m Alec Thompson, Decisions: If you can’t decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
                        info={{
                            // fullName: "Alec M. Thompson",
                            // mobile: "(44) 123 1234 123",
                            Business: 'Payhub Test',
                            Name: 'Payhub Test',
                            email: 'Payhub Test',
                        }}
                        action={{ route: "", tooltip: "Edit Profile" }}
                        shadow={false}
                    />
                </Grid>
            </Grid>


        </DashboardLayout>
    )
}

export default Developer