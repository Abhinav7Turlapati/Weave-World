import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    if (!user || !user.isLoggedIn) {
        return <Navigate to="/login" state={{ message: "Please login to access this page." }} replace />;
    }

    return children;
};

export default ProtectedRoute;
