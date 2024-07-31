import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";

function UnAuthorizedGuard({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/logout") {
      return;
    }

    const checkLocalStorage = () => {
      if (localStorage.getItem("uid") || localStorage.getItem("token")) {
        localStorage.removeItem("uid");
        localStorage.removeItem("token");
        localStorage.removeItem("browser");
        window.location.href = "/logout";
      }

      if (
        user &&
        (!localStorage.getItem("uid") || !localStorage.getItem("token"))
      ) {
        window.location.href = "/logout";
      }
    };

    checkLocalStorage();

    const intervalId = setInterval(checkLocalStorage, 1000);

    return () => clearInterval(intervalId);
  }, [location, user]);

  return <>{children}</>;
}

UnAuthorizedGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UnAuthorizedGuard;
