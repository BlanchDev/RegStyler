import googleLogo from "../../assets/google-logo.svg";
import useAuth from "../../hooks/useAuth";
import "./AuthBtn.css";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useEffect, useState } from "react";
import { userCheck } from "../../services/authService";
import userpp from "../../assets/user-pp.png";
import { IoIosSettings } from "react-icons/io";

function AuthBtn() {
  const { uid, token, browser } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const fetchUserCheck = await userCheck(uid);
      setUserInfo(fetchUserCheck);
    };

    fetchUserInfo();
  }, [uid]);

  return (
    <div className='auth-btns row aic jcc'>
      {uid && token && browser ? (
        <div className='user-panel row aic jcsb'>
          <div className='user-details row aic jcfs gap10'>
            <img src={userpp} alt='User profile' className='user-photo' />
            <div className='user-info column aifs jcc'>
              <div className={`user-name ${userInfo?.role}`}>
                {userInfo?.nickname}
              </div>
              <div className='user-role'>{userInfo?.role}</div>
            </div>
          </div>
          <div className='panel-btns row aic gap10'>
            <Link to='/home/settings'>
              <IoIosSettings className='panel-btn' />
            </Link>

            <Link className='sign-out-btn' to='/logout'>
              <BiLogOut className='panel-btn' />
            </Link>
          </div>
        </div>
      ) : (
        <Link className='sign-in row aic jcc gap10' to='/login'>
          <img src={googleLogo} alt='Google logo' />
          <span>Sign In with Google 🌈</span>
        </Link>
      )}
    </div>
  );
}

export default AuthBtn;
