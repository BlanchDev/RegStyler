import { useEffect, useState } from "react";
import "./Settings.css";
import { Helmet } from "react-helmet";
import { userCheck, userDataUpdate } from "../../services/authService";
import useAuth from "../../hooks/useAuth";
import useScreenNotifi from "../../hooks/useScreenNotifi/useScreenNotifi";

function Settings() {
  const { setNotifi, ScreenNotifiComponent, isDisabledNotifi } =
    useScreenNotifi();
  const [nickname, setNickname] = useState("");

  const { uid, token, browser } = useAuth();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const fetchUserCheck = await userCheck(uid);
      setNickname(fetchUserCheck.nickname);
    };

    fetchUserInfo();
  }, [uid]);

  const updateUserData = async (e) => {
    e.preventDefault();
    const fetchUserDataUpdate = await userDataUpdate(
      uid,
      token,
      browser,
      nickname,
    );

    if (fetchUserDataUpdate.success === true) {
      window.location.href = "/home/settings";
      return;
    }

    setNotifi(
      fetchUserDataUpdate.notification.type,
      fetchUserDataUpdate.notification.text,
      3000,
    );
  };

  return (
    <div className='settings column aifs'>
      <Helmet>
        <title>Settings</title>
      </Helmet>
      <form onSubmit={updateUserData} className='form-container column gap20'>
        <div className='column gap5'>
          <label className='label' htmlFor='nickname'>
            Nickname (max 30)
          </label>
          <input
            className='input'
            type='text'
            id='nickname'
            autoComplete='off'
            placeholder='What is your nickname?'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            maxLength={30}
          />
        </div>
        <button
          className='button green'
          type='submit'
          required
          disabled={isDisabledNotifi}
        >
          Change Nickname
        </button>
      </form>
      <ScreenNotifiComponent />
    </div>
  );
}

export default Settings;
