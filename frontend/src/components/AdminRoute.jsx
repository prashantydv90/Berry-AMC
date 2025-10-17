import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
 // adjust import path

export const AdminRoute = ({ element: Element }) => {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>; // wait until user is fetched
  console.log(user);

  if (!user) return <Navigate to="/user/login" />;
  if (user.role !== "admin") return <Navigate to="/" />;

  return <Element />;
};
