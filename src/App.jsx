import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import LeftBar from "./Layout/LeftBar/LeftBar";
import Main from "./Layout/Main/Main";
import useAuth from "./hooks/useAuth";
import AuthorizedGuard from "./guard/AuthorizedGuard";
import UnAuthorizedGuard from "./guard/UnAuthorizedGuard";

import LandingPage from "./pages/LandingPage/LandingPage";
import AddCustomRegStyle from "./pages/Home/AddCustomRegStyle/AddCustomRegStyle";
import HomeLayout from "./pages/Home/HomeLayout";
import Optimizations from "./pages/Home/Optimizations/Optimizations";
import Packages from "./pages/Home/Packages/Packages";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import PackageDetails from "./pages/PackageDetails/PackageDetails";
import PackageStore from "./pages/PackageStore/PackageStore";
import Settings from "./pages/Settings/Settings";

function App() {
  const { user, isLoading, uid, token, browser } = useAuth();

  if (isLoading && uid) {
    return (
      <>
        <LeftBar />
        <Main>
          <div>Loading...</div>
        </Main>
      </>
    );
  }

  if (user && uid && token && browser) {
    return (
      <AuthorizedGuard>
        <LeftBar />
        <Main>
          <Routes>
            <Route
              path='/'
              element={<Navigate to='/home/optimizations' replace />}
            />
            <Route path='/logout' element={<Logout />} />
            <Route path='/home' element={<HomeLayout />}>
              <Route
                index
                element={<Navigate to='/home/optimizations' replace />}
              />
              <Route path='optimizations' element={<Optimizations />} />
              <Route path='packages' element={<Packages />} />
              <Route
                path='add-custom-regstyle'
                element={<AddCustomRegStyle />}
              />
              <Route path='settings' element={<Settings />} />
            </Route>
            <Route path='/package/:packageID' element={<PackageDetails />} />
            <Route path='/package-store' element={<PackageStore />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Main>
      </AuthorizedGuard>
    );
  }

  if (!user || !uid || !token || !browser) {
    return (
      <UnAuthorizedGuard>
        <LeftBar />
        <Main>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<Login />} />
            <Route path='/logout' element={<Logout />} />
            <Route path='*' element={<Navigate to='/' replace />} />
            <Route path='/package/:packageID' element={<PackageDetails />} />
            <Route path='/package-store' element={<PackageStore />} />
          </Routes>
        </Main>
      </UnAuthorizedGuard>
    );
  }
}

export default App;
