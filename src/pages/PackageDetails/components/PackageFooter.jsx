import PropTypes from "prop-types";
import { sharePackage } from "../../../services/packageDetailService";
import useScreenNotifi from "../../../hooks/useScreenNotifi/useScreenNotifi";
import { useState, useEffect } from "react";

function PackageFooter({
  uid,
  token,
  browser,
  packageID,
  checkedRegSettings,
  packageDetails,
  setIsEditPackageModalOpen,
}) {
  const [isPackagePublic, setIsPackagePublic] = useState();

  const { setNotifi, ScreenNotifiComponent, isDisabledNotifi } =
    useScreenNotifi();

  useEffect(() => {
    setIsPackagePublic(packageDetails.isPublic);
  }, [packageDetails]);

  const handleShareWithPackageStore = async () => {
    if (
      packageDetails.isPublic === "0" &&
      (packageDetails.title.length < 5 ||
        packageDetails.description.length < 60)
    ) {
      setNotifi(
        "warning",
        "Please create a title/description/optimization of at least 5/60/1 characters.",
        3000,
      );
      return;
    }

    const isPublic = 1;
    const sharedPackage = await sharePackage(
      uid,
      token,
      browser,
      packageID,
      isPublic,
      packageDetails.title,
      packageDetails.description,
    );
    if (sharedPackage.success) {
      setNotifi("success", "Package shared with Package Store", 3000);
      setIsPackagePublic("1");
    }
  };

  const handleEditPackage = () => {
    setIsEditPackageModalOpen(true);
  };

  const handleRemoveFromPackageStore = async () => {
    const isPublic = 0;
    const sharedPackage = await sharePackage(
      uid,
      token,
      browser,
      packageID,
      isPublic,
      packageDetails.title,
      packageDetails.description,
    );
    if (sharedPackage.success) {
      setNotifi("success", "Package removed from Package Store", 3000);
      setIsPackagePublic("0");
    }
  };

  const downloadCheckedRegSettings = () => {
    const regHeader = `Windows Registry Editor Version 5.00\n\n`;
    const regComments = `; RegStyler.blanch.dev/package/${packageID}\n\n`;
    const regContent = checkedRegSettings.map((reg) => reg.code).join("\n");

    const fullRegContent = `${regHeader}${regComments}${regContent}`;

    const blob = new Blob([fullRegContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${packageDetails.nickname}'s_${packageDetails.title}_package.reg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='package-footer row aic jcsb gap20'>
      <div className='row aic jcfs gap10'>
        <button className='button green' onClick={downloadCheckedRegSettings}>
          Download
        </button>
        {packageDetails.uid === uid && isPackagePublic === "0" && (
          <>
            <button
              className='button orange'
              onClick={handleShareWithPackageStore}
              disabled={isDisabledNotifi}
            >
              Share with Package Store
            </button>
            <button className='button blue' onClick={handleEditPackage}>
              Edit Package
            </button>
          </>
        )}
        {packageDetails.uid === uid && isPackagePublic === "1" && (
          <button
            className='button purple'
            onClick={handleRemoveFromPackageStore}
            disabled={isDisabledNotifi}
          >
            Remove from Package Store
          </button>
        )}
      </div>
      <div className='row aic '>
        <p className='label'>{checkedRegSettings.length} Selected</p>
      </div>
      <ScreenNotifiComponent />
    </div>
  );
}

PackageFooter.propTypes = {
  uid: PropTypes.string,
  token: PropTypes.string,
  browser: PropTypes.string,
  packageID: PropTypes.string,
  checkedRegSettings: PropTypes.array,
  packageDetails: PropTypes.object,
  setIsEditPackageModalOpen: PropTypes.func,
};

export default PackageFooter;
