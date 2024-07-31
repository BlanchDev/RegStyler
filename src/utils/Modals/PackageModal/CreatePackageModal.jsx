import PropTypes from "prop-types";
import "../Modal.css";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/useAuth";
import { createPackage } from "../../../services/packageService";
import { useNavigate } from "react-router-dom";

function CreatePackageModal({
  isCreatePackageModalOpen,
  setIsCreatePackageModalOpen,
}) {
  const { uid, token, browser } = useAuth();
  const [checkedRegs, setCheckedRegs] = useState(
    JSON.parse(localStorage.getItem("checkedRegSettings")) || [],
  );
  const [checkedRegsID, setCheckedRegsID] = useState(
    checkedRegs.map((reg) => reg.id),
  );
  const [packageTitle, setPackageTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const regs = JSON.parse(localStorage.getItem("checkedRegSettings")) || [];
    setCheckedRegs(regs);
    setCheckedRegsID(regs.map((reg) => reg.id));
  }, [isCreatePackageModalOpen]);

  if (!isCreatePackageModalOpen) return null;

  const handleCreatePackage = async (e) => {
    e.preventDefault();
    const responsePackage = await createPackage(
      uid,
      token,
      browser,
      packageTitle,
      checkedRegsID,
    );
    if (responsePackage?.urlParam) {
      navigate(`/package/${responsePackage.urlParam}`);
    } else {
      console.error("Invalid responsePackage:", responsePackage);
    }
  };

  return (
    <div className='modal column aic jcc'>
      <button
        className='modal-overlay'
        onClick={() => setIsCreatePackageModalOpen(false)}
      />
      <form
        className='modal-container column gap15'
        noValidate
        onSubmit={(e) => handleCreatePackage(e)}
      >
        <div className='modal-header row aic jcsb'>
          <h2>New Package</h2>
          <button
            className='modal-close row aic jcc'
            onClick={() => setIsCreatePackageModalOpen(false)}
          >
            ×
          </button>
        </div>
        <div className='modal-content column aic jcsb gap20'>
          <div className='create-content-top column aic gap10'>
            <div className='checked-regs'>
              {checkedRegs.map((reg) => (
                <div className='reg-title' key={reg.id}>
                  {reg.title}
                </div>
              ))}
            </div>
          </div>
          <div className='form-container create-content-bottom column aic gap10'>
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
              />
            </div>
            <button
              className='button green'
              type='submit'
              disabled={packageTitle.length === 0}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

CreatePackageModal.propTypes = {
  isCreatePackageModalOpen: PropTypes.bool.isRequired,
  setIsCreatePackageModalOpen: PropTypes.func.isRequired,
};

export default CreatePackageModal;
