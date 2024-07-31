import { NavLink } from "react-router-dom";
import "./HomeHeader.css";

function HomeHeader() {
  const handleSaveNavigate = (nav) => {
    localStorage.setItem("home-navigate", nav);
  };

  return (
    <header className='home-header'>
      <div className='home-header-content row aic jcfs'>
        <div className='tabs row aic jcsb'>
          <div className='row aic jcc'>
            <NavLink
              className='tab row aic jcc'
              to='/home/optimizations'
              onClick={() => handleSaveNavigate("/home/optimizations")}
            >
              Optimizations
            </NavLink>
            <NavLink
              className='tab row aic jcc'
              to='/home/packages'
              onClick={() => handleSaveNavigate("/home/packages")}
            >
              My Packages
            </NavLink>
          </div>
          <div className='row aic jcc'>
            <NavLink
              className='tab row aic jcc'
              to='/home/add-custom-regstyle'
              onClick={() => handleSaveNavigate("/home/add-custom-regstyle")}
            >
              Add Custom RegStyle
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}

export default HomeHeader;
