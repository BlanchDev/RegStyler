import { useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

function AuthorizedGuard({ children }) {
  const { user, uid, token, browser } = useAuth();
  const location = useLocation();

  const prevUid = useRef(localStorage.getItem("uid"));
  const prevToken = useRef(localStorage.getItem("token"));
  const prevBrowser = useRef(localStorage.getItem("browser"));

  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/logout") {
      return;
    }

    const checkLocalStorage = () => {
      if (user && (!uid || !token || !browser)) {
        localStorage.removeItem("uid");
        localStorage.removeItem("token");
        localStorage.removeItem("browser");
        window.location.href = "/logout";
      }

      if (
        prevUid.current != localStorage.getItem("uid") ||
        prevToken.current != localStorage.getItem("token") ||
        prevBrowser.current != localStorage.getItem("browser")
      ) {
        localStorage.removeItem("uid");
        localStorage.removeItem("token");
        localStorage.removeItem("browser");
        window.location.href = "/logout";
      }
    };

    checkLocalStorage();

    const intervalId = setInterval(checkLocalStorage, 100);

    return () => clearInterval(intervalId);
  }, [user, uid, token, browser, location]);

  return <>{children}</>;
}

AuthorizedGuard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthorizedGuard;
