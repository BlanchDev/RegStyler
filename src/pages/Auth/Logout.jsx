import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useEffect } from "react";
import { Helmet } from "react-helmet";
import useAuth from "../../hooks/useAuth";

function Logout() {
  const { setUid, setToken } = useAuth();

  useEffect(() => {
    const signOutAndNavigate = async () => {
      try {
        localStorage.removeItem("uid");
        localStorage.removeItem("token");
        setUid();
        setToken();
        await signOut(auth);
        window.location.href = "/";
      } catch (error) {
        console.error("Çıkış yapılırken hata oluştu: ", error);
      }
    };

    signOutAndNavigate();
  }, [setUid, setToken]);

  return (
    <>
      <Helmet>
        <title>Logout</title>
      </Helmet>
      WHAT?
    </>
  );
}

export default Logout;
