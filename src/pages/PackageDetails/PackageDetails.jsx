import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import { useParams } from "react-router-dom";
import "./PackageDetails.css";
import PackageFooter from "./components/PackageFooter";
import DescriptionAndOptimizations from "./components/DescriptionAndOptimizations";
import EditPackageModal from "../../utils/Modals/EditPackageModal/EditPackageModal";
import { getPackageDetails } from "../../services/packageDetailService";
import { Helmet } from "react-helmet";

function PackageDetails() {
  const { uid, token, browser } = useAuth();
  const { packageID } = useParams();

  const [packageDetails, setPackageDetails] = useState({});
  const [checkedRegSettings, setCheckedRegSettings] = useState(
    JSON.parse(localStorage.getItem(packageID)) || [],
  );
  const [isEditPackageModalOpen, setIsEditPackageModalOpen] = useState(false);

  useEffect(() => {
    const fetchPackageDetails = async () => {
      const fetchedPackageDetails = await getPackageDetails(
        uid || undefined,
        token || undefined,
        browser || undefined,
        packageID,
      );
      setPackageDetails(fetchedPackageDetails);
    };

    fetchPackageDetails();
  }, [uid, token, browser, packageID]);

  return (
    <div className='package-details-layout form-container column aifs jcsb'>
      <Helmet>
        <title>{`${packageDetails.nickname}'s ${packageDetails.title}`}</title>
      </Helmet>

      <DescriptionAndOptimizations
        packageID={packageID}
        packageDetails={packageDetails}
        checkedRegSettings={checkedRegSettings}
        setCheckedRegSettings={setCheckedRegSettings}
      />

      {packageDetails.uid ? (
        <PackageFooter
          {...(uid && token && browser && { uid, token, browser })}
          packageID={packageID}
          checkedRegSettings={checkedRegSettings}
          packageDetails={packageDetails}
          setIsEditPackageModalOpen={setIsEditPackageModalOpen}
        />
      ) : null}

      {packageDetails.uid === uid && isEditPackageModalOpen ? (
        <EditPackageModal
          {...(uid && token && browser && { uid, token, browser })}
          isEditPackageModalOpen={isEditPackageModalOpen}
          setIsEditPackageModalOpen={setIsEditPackageModalOpen}
          packageID={packageID}
          packageDetails={packageDetails}
        />
      ) : null}
    </div>
  );
}

export default PackageDetails;
