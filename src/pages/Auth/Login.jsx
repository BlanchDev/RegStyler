import { signInWithPopup } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, provider } from "../../firebase/config";
import "./Login.css";
import { userCheck, userLogin, userRegister } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import useScreenNotifi from "../../hooks/useScreenNotifi/useScreenNotifi";

function Login() {
  const { user, browser } = useAuth();
  const [nickname, setNickname] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const { setNotifi, ScreenNotifiComponent, isDisabledNotifi } =
    useScreenNotifi();

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        const fetchedUserCheck = await userCheck(user.providerData[0].uid);
        setIsNewUser(fetchedUserCheck.isNew);

        if (fetchedUserCheck.isNew) {
          setNickname(user.displayName);
        } else {
          const login = await userLogin(user.providerData[0].uid, browser);
          if (login) {
            window.location.href = "/home";
          }
        }
        return;
      }

      await signInWithPopup(auth, provider).catch((e) => {
        if (e.code === "auth/popup-closed-by-user") {
          console.error("Popup closed by user before completing sign in.");
          window.location.href = "/logout";
        } else {
          console.error("Error during sign in: ", e);
        }
      });
    };

    checkUserStatus();
  }, [user, browser, navigate]);

  if (!user) {
    return (
      <>
        <Helmet>
          <title>Login</title>
        </Helmet>
        Loading...
      </>
    );
  }

  if (isNewUser) {
    const handleNickname = async (e) => {
      e.preventDefault();
      try {
        const fetchedRegister = await userRegister(
          user.providerData[0].uid,
          nickname,
          user.email,
          user.photoURL,
        );
        if (
          fetchedRegister.success === true &&
          fetchedRegister.uid &&
          fetchedRegister.token &&
          fetchedRegister.browser
        ) {
          setIsNewUser(false);
          localStorage.setItem("uid", fetchedRegister.uid);
          localStorage.setItem("token", fetchedRegister.token);
          localStorage.setItem("browser", fetchedRegister.browser);
          window.location.href = "/home/optimizations";
          return;
        }

        setNotifi(
          fetchedRegister.notification.type,
          fetchedRegister.notification.text,
          3000,
        );
      } catch (e) {
        console.error("Error during user registration: ", e);
      }
    };

    return (
      <div className='form-container row aic jcc'>
        <Helmet>
          <title>Login</title>
        </Helmet>
        <form
          onSubmit={(e) => handleNickname(e)}
          className='login column aic jcsb'
        >
          <div className='row aic gap15'>
            <div className='column gap10'>
              <label htmlFor='name' className='label'>
                Do you want to change your nickname? (max 30)
              </label>
              <input
                type='text'
                className='input'
                id='name'
                placeholder='Nickname'
                autoComplete='off'
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                minLength={1}
                maxLength={30}
              />
            </div>
          </div>
          <button
            className='button green'
            disabled={
              isDisabledNotifi || nickname.length < 1 || nickname.length > 30
            }
            type='submit'
          >
            Continue
          </button>
        </form>
        <ScreenNotifiComponent />
      </div>
    );
  }
}

export default Login;
