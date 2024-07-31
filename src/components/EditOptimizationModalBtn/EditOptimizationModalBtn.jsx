import PropTypes from "prop-types";
import { useState } from "react";
import "./EditOptimizationModalBtn.css";
import { MdEdit } from "react-icons/md";
import EditOptimizationModal from "../../utils/Modals/EditOptimizationModal/EditOptimizationModal";

function EditOptimizationModalBtn({
  uid,
  token,
  browser,
  id,
  title,
  description,
  code,
  category,
  setRegSwitchData,
  setRegSettings,
}) {
  const [isEditOptimizationModalOpen, setIsEditOptimizationModalOpen] =
    useState(false);

  return (
    <>
      <button
        type='button'
        className='edit-optimization-btn row aic jcc'
        onClick={() => setIsEditOptimizationModalOpen(true)}
      >
        <MdEdit />
      </button>
      <EditOptimizationModal
        uid={uid}
        token={token}
        browser={browser}
        id={id}
        title={title}
        description={description}
        code={code}
        category={category}
        isEditOptimizationModalOpen={isEditOptimizationModalOpen}
        setIsEditOptimizationModalOpen={setIsEditOptimizationModalOpen}
        setRegSwitchData={setRegSwitchData}
        setRegSettings={setRegSettings}
      />
    </>
  );
}

EditOptimizationModalBtn.propTypes = {
  uid: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  browser: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  setRegSwitchData: PropTypes.func.isRequired,
  setRegSettings: PropTypes.func.isRequired,
};

export default EditOptimizationModalBtn;
