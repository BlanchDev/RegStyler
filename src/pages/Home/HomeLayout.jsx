import { Outlet } from "react-router-dom";
import HomeHeader from "../../Layout/HomeHeader/HomeHeader";
import useAuth from "../../hooks/useAuth";

function HomeLayout() {
  const { uid, token, browser } = useAuth();

  return (
    <>
      {uid && token && browser ? (
        <>
          <HomeHeader />
          <Outlet />
        </>
      ) : null}
    </>
  );
}

export default HomeLayout;
