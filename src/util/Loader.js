import React from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import MDBox from 'components/MDBox';
function Loader() {
    return (
        <MDBox mt={25} display={'flex'} justifyContent="center">
            <ClipLoader color="#36d7b7" size={50} />
        </MDBox>
    )
}

export default Loader

