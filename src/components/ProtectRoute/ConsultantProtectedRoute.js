import { useEffect } from "react";
import { useSelector } from "react-redux";

const ConsultantProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(
    (state) => state.authConsultant,
  );

  const params = new URLSearchParams(window.location.search);
  const shop = params.get("shop");

  useEffect(() => {
    if (!loading && !isAuthenticated && shop) {
      window.top.location.href = `https://${shop}/apps/consultant-theme/login`;
    }
  }, [loading, isAuthenticated, shop]);

  if (loading) return null; // ya spinner

  if (!isAuthenticated) return null;

  return children;
};

export default ConsultantProtectedRoute;
