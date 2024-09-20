import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();

    useEffect(() => {
        // Remove user_token from localStorage
        localStorage.removeItem('user_token');

        // Navigate to the sign-in page
        navigate('/authentication/sign-in');
    }, [navigate]);

    // You can also return some UI here if needed
    return (
        <div>

        </div>
    );
}

export default Logout;