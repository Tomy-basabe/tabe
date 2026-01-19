import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to dashboard - will be replaced with auth check later
  return <Navigate to="/" replace />;
};

export default Index;
