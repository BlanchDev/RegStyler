import { Navigate } from "react-router-dom";
import { useAuth } from "./contextapi";
import PropTypes from "prop-types";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to='/login' />;
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
