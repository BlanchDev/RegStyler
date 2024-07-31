import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/contextapi";

function useAuth() {
  const context = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [uid, setUid] = useState(localStorage.getItem("uid") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [browser, setBrowser] = useState(
    localStorage.getItem("browser") || null,
  );

  useEffect(() => {
    setUser(context.user);

    if (context.user) {
      setIsLoading(false);

      if (
        localStorage.getItem("uid") &&
        localStorage.getItem("token") &&
        localStorage.getItem("browser")
      ) {
        if (localStorage.getItem("uid") === context.user.providerData[0].uid) {
          setUid(localStorage.getItem("uid"));
          setToken(localStorage.getItem("token"));
          setBrowser(localStorage.getItem("browser"));
        } else {
          localStorage.removeItem("uid");
          localStorage.removeItem("token");
          setUid();
          setToken();
          window.location.href = "/logout";
        }
      }
    }
  }, [context, uid, token, browser]);

  return { user, isLoading, uid, token, browser, setUid, setToken, setBrowser };
}

export default useAuth;
