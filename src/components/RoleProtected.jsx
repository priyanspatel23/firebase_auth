import { Navigate } from "react-router-dom";
function RoleProtected({
  children,
  role,
  userRole,
}) {
  if (role !== userRole) {
    return <Navigate to="*" />;
  }
  return children;
}
export default RoleProtected;