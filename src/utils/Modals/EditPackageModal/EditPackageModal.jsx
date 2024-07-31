import PropTypes from "prop-types";
import "../Modal.css";
import { useState, useEffect } from "react";
import { getOptimizations } from "../../../services/optimizationsService";
import {
  deletePackage,
  editPackage,
} from "../../../services/packageDetailService";
import { useNavigate } from "react-router-dom";

function EditPackageModal({
  uid,
  token,
  browser,
  isEditPackageModalOpen,
  setIsEditPackageModalOpen,
  packageID,
  packageDetails,
}) {
  const [packageTitle, setPackageTitle] = useState("");
  const [packageDescription, setPackageDescription] = useState("");
  const [allOptimizations, setAllOptimizations] = useState([]);
  const [mineRegs, setMineRegs] = useState([]);
  const [activeTab, setActiveTab] = useState("package");

  const navigate = useNavigate();

  const sortOptimizations = (optimizations) => {
    const categoryOrder = ["system", "graphic", "internet", "privacy", "other"];
    const ownerOrder = ["user", "admin"];

    return optimizations
      .sort(
        (a, b) =>
          categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category),
      )
      .sort(
        (a, b) => ownerOrder.indexOf(a.owner) - ownerOrder.indexOf(b.owner),
      );
  };

  const filterPackageOptimizations = (
    allOptimizations,
    packageOptimizations = [],
  ) => {
    return allOptimizations.filter(
      (opt) =>
        !packageOptimizations.some((packageOpt) => packageOpt.id === opt.id),
    );
  };

  useEffect(() => {
    if (!packageDetails) return;

    setPackageTitle(packageDetails.title);
    setPackageDescription(packageDetails.description);
    setAllOptimizations(packageDetails.optimizations);

    const fetchAndProcessOptimizations = async () => {
      const optimizations = await getOptimizations(uid, token, browser);
      const sortedOptimizations = sortOptimizations(optimizations);
      const filteredOptimizations = filterPackageOptimizations(
        sortedOptimizations,
        packageDetails.optimizations,
      );
      setMineRegs(filteredOptimizations);
    };

    fetchAndProcessOptimizations();
  }, [packageDetails, uid, token, browser]);

  if (!isEditPackageModalOpen) return null;

  const handleRemoveFromPackage = (optimization) => {
    const newPackageOptimizations = allOptimizations.filter(
      (opt) => opt.id !== optimization.id,
    );
    setAllOptimizations(newPackageOptimizations);

    setMineRegs([...mineRegs, optimization]);
  };

  const handleAddToPackage = (optimization) => {
    const newPackageOptimizations = [...allOptimizations, optimization];
    setAllOptimizations(newPackageOptimizations);

    const newMineRegs = mineRegs.filter((opt) => opt.id !== optimization.id);
    setMineRegs(newMineRegs);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    const optimizationsID = allOptimizations.map((opt) => opt.id);
    const fetchedEditPackage = await editPackage(
      uid,
      token,
      browser,
      packageID,
      packageTitle,
      packageDescription,
      optimizationsID,
    );
    if (fetchedEditPackage.success) {
      localStorage.removeItem(packageID);
      navigate(`/package/${packageID}`, { replace: true });
      window.location.reload();
    } else {
      console.error("Package edit failed");
    }
  };

  const handleDeletePackage = async () => {
    const fetchedDeletePackage = await deletePackage(
      uid,
      token,
      browser,
      packageID,
    );

    if (fetchedDeletePackage.success) {
      navigate("/home/packages", { replace: true });
    } else {
      console.error("Package delete failed");
    }
  };

  return (
    <div className='modal column aic jcc'>
      <button
        className='modal-overlay'
        onClick={() => setIsEditPackageModalOpen(false)}
      />
      <div className='modal-container column gap15'>
        <div className='modal-header row aic jcsb'>
          <h2>Edit Package | {packageDetails.title}</h2>
          <button
            className='modal-close row aic jcc'
            onClick={() => setIsEditPackageModalOpen(false)}
          >
            ×
          </button>
        </div>
        <form
          className='modal-content form-container column jcsb'
          onSubmit={(e) => handleSavePackage(e)}
        >
          <div className='w100 column gap15'>
            <div className='w100 column gap10'>
              <label htmlFor='package-title' className='label'>
                Package Title
              </label>
              <input
                type='text'
                id='package-title'
                className='input'
                autoComplete='off'
                required
                value={packageTitle}
                onChange={(e) => setPackageTitle(e.target.value)}
                placeholder='Please create a title of at least 5 characters.'
                minLength={5}
                maxLength={50}
              />
              <label className='label'>
                {packageTitle.length}/5 Characters | MAX 50
              </label>
            </div>
            <div className='w100 column gap10'>
              <label htmlFor='package-description' className='label'>
                Package Description
              </label>
              <textarea
                type='text'
                id='package-description'
                className='input'
                autoComplete='off'
                required
                value={packageDescription}
                onChange={(e) => setPackageDescription(e.target.value)}
                placeholder='Please create a description of at least 60 characters.'
                minLength={60}
                maxLength={265}
              />
              <label className='label'>
                {packageDescription.length}/60 Characters | MAX 265
              </label>
            </div>

            <div className='w100 column gap10'>
              <div className='optimizationsHeader column jcsb '>
                <div className='row aic'>
                  <button
                    type='button'
                    className={`tab ${activeTab === "package" ? "active" : ""}`}
                    onClick={() => setActiveTab("package")}
                  >
                    Package
                    {allOptimizations ? ` (${allOptimizations.length})` : ""}
                  </button>
                  <button
                    type='button'
                    className={`tab ${activeTab === "mine" ? "active" : ""}`}
                    onClick={() => setActiveTab("mine")}
                  >
                    Mine
                    {mineRegs ? ` (${mineRegs.length})` : ""}
                  </button>
                </div>
              </div>
              <div className='package-regs column jcsb gap20'>
                {activeTab === "package" &&
                  allOptimizations.map((optimization) => (
                    <button
                      className={`reg-title ${optimization.owner}`}
                      key={optimization.id}
                      onClick={() => handleRemoveFromPackage(optimization)}
                    >
                      {optimization.title}
                    </button>
                  ))}

                {activeTab === "mine" &&
                  mineRegs.map((optimization) => (
                    <button
                      className={`reg-title ${optimization.owner}`}
                      key={optimization.id}
                      onClick={() => handleAddToPackage(optimization)}
                    >
                      {optimization.title}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          <div className='modal-footer row aic jcc gap10'>
            <button
              className='button green'
              disabled={
                packageTitle.length < 5 ||
                packageTitle.length > 50 ||
                packageDescription.length < 60 ||
                packageDescription.length > 265 ||
                allOptimizations.length < 1
              }
              type='submit'
            >
              Save
            </button>
            <button
              className='button purple'
              type='button'
              onClick={() => setIsEditPackageModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className='button red'
              type='button'
              onClick={handleDeletePackage}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditPackageModal.propTypes = {
  uid: PropTypes.string,
  token: PropTypes.string,
  browser: PropTypes.string,
  isEditPackageModalOpen: PropTypes.bool.isRequired,
  setIsEditPackageModalOpen: PropTypes.func.isRequired,
  packageID: PropTypes.string.isRequired,
  packageDetails: PropTypes.object.isRequired,
};

export default EditPackageModal;
