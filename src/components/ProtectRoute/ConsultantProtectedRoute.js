import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ConsultantProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(
    (state) => state.authConsultant
  );

  if (loading) return null; // or spinner

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ConsultantProtectedRoute;