import { Link, NavLink, useNavigate } from "react-router-dom";
import "./LeftBar.css";
import AuthBtn from "../../components/GoogleSign/AuthBtn";
import useAuth from "../../hooks/useAuth";
import { IoHomeSharp } from "react-icons/io5";
import { FaStore } from "react-icons/fa";

function LeftBar() {
  const { uid, token, browser } = useAuth();
  const navigate = useNavigate();

  const handleHomeNavigate = () => {
    navigate(localStorage.getItem("home-navigate") || "/home");
  };

  return (
    <div className='leftbar column aic jcc'>
      <div className='leftbar-content column aifs'>
        <div className='leftbar-logo row aic jcc'>
          <Link className='logo-text row aic gap5' to='/'>
            <div>RegStyler</div>
          </Link>
        </div>
        <div className='leftbar-menu column aifs jcsb'>
          {uid && token && browser ? (
            <div className='leftbar-header column'>
              <nav className='leftbar-nav column aic jcc'>
                <NavLink
                  className='navBtn'
                  onClick={() => handleHomeNavigate()}
                  to={localStorage.getItem("home-navigate") || "/home"}
                >
                  <IoHomeSharp className='navBtn-icon' />
                  <div className='navBtn-text'>Home</div>
                </NavLink>
                <NavLink className='navBtn' to='/package-store'>
                  <FaStore className='navBtn-icon' />
                  <div className='navBtn-text'>Package Store</div>
                </NavLink>
              </nav>
            </div>
          ) : (
            <div className='leftbar-header column'>
              <nav className='leftbar-nav column aic jcc'>
                <NavLink className='navBtn' to='/'>
                  <IoHomeSharp className='navBtn-icon' />
                  <div className='navBtn-text'>Home</div>
                </NavLink>
                <NavLink className='navBtn' to='/package-store'>
                  <FaStore className='navBtn-icon' />
                  <div className='navBtn-text'>Package Store</div>
                </NavLink>
              </nav>
            </div>
          )}
          <div className='leftbar-footer column aic jcc'>
            <AuthBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftBar;
