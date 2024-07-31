import { useEffect } from "react";
import PropTypes from "prop-types";
import useAuth from "../hooks/useAuth";

function ForRender({ children }) {
  const { uid, token, browser } = useAuth();

  useEffect(() => {
    localStorage.setItem("uid", uid);
    localStorage.setItem("token", token);
    localStorage.setItem("browser", browser);
  }, [uid, token, browser]);

  return <>{children}</>;
}

ForRender.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ForRender;
