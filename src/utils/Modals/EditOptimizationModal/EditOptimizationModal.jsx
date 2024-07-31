import PropTypes from "prop-types";
import "../Modal.css";
import { useState, useEffect } from "react";
import {
  deleteOptimization,
  editOptimization,
} from "../../../services/optimizationsService";

function EditOptimizationModal({
  uid,
  token,
  browser,
  id,
  title,
  description,
  code,
  category,
  isEditOptimizationModalOpen,
  setIsEditOptimizationModalOpen,
  setRegSwitchData,
  setRegSettings,
}) {
  const [optimizationTitle, setOptimizationTitle] = useState("");
  const [optimizationDescription, setOptimizationDescription] = useState("");
  const [optimizationCode, setOptimizationCode] = useState("");
  const [optimizationCategory, setOptimizationCategory] = useState("");

  useEffect(() => {
    if (!id) return;

    setOptimizationTitle(title);
    setOptimizationDescription(description);
    setOptimizationCode(code);
    setOptimizationCategory(category);
  }, [id, title, description, code, category]);

  if (!isEditOptimizationModalOpen) return null;

  const handleSaveOptimization = async (e) => {
    e.preventDefault();
    const optimizationData = {
      optimizationId: id,
      title: optimizationTitle,
      description: optimizationDescription,
      code: optimizationCode,
      category: optimizationCategory,
    };
    const fetchedEditOptimization = await editOptimization(
      uid,
      token,
      browser,
      optimizationData,
    );

    if (fetchedEditOptimization.success) {
      setIsEditOptimizationModalOpen(false);
      setRegSwitchData((prev) => ({
        ...prev,
        title: optimizationTitle,
        description: optimizationDescription,
        code: optimizationCode,
        category: optimizationCategory,
      }));
    }
  };

  const handleDeleteOptimization = async () => {
    const optimizationData = {
      optimizationId: id,
    };

    const fetchedDeleteOptimization = await deleteOptimization(
      uid,
      token,
      browser,
      optimizationData,
    );

    if (fetchedDeleteOptimization.success) {
      setIsEditOptimizationModalOpen(false);
      setRegSettings((prev) =>
        prev.filter((optimization) => optimization.id !== id),
      );
    }
  };

  return (
    <div className='modal column aic jcc'>
      <button
        className='modal-overlay'
        onClick={() => setIsEditOptimizationModalOpen(false)}
      />
      <div className='modal-container column gap15'>
        <div className='modal-header row aic jcsb'>
          <h2>Edit Optimization | {title}</h2>
          <button
            className='modal-close row aic jcc'
            onClick={() => setIsEditOptimizationModalOpen(false)}
          >
            ×
          </button>
        </div>
        <form
          className='modal-content form-container column jcsb'
          onSubmit={(e) => handleSaveOptimization(e)}
        >
          <div className='w100 column gap15'>
            <div className='w100 column gap10'>
              <label htmlFor='optimization-title' className='label'>
                Optimization Title
              </label>
              <input
                type='text'
                id='optimization-title'
                className='input'
                autoComplete='off'
                required
                value={optimizationTitle}
                onChange={(e) => setOptimizationTitle(e.target.value)}
                placeholder='Please create a title of at least 5 characters.'
                minLength={5}
                maxLength={50}
              />
              <label className='label'>
                {optimizationTitle.length}/5 Characters | MAX 50
              </label>
            </div>
            <div className='w100 column gap10'>
              <label htmlFor='optimization-description' className='label'>
                Optimization Description
              </label>
              <textarea
                type='text'
                id='optimization-description'
                className='input'
                autoComplete='off'
                required
                value={optimizationDescription}
                onChange={(e) => setOptimizationDescription(e.target.value)}
                placeholder='Please create a description of at least 5 characters.'
                minLength={5}
                maxLength={265}
              />
              <label className='label'>
                {optimizationDescription.length}/5 Characters | MAX 265
              </label>
            </div>
            <div className='w100 column gap10'>
              <label htmlFor='optimization-code' className='label'>
                Optimization Code
              </label>
              <textarea
                type='text'
                id='optimization-code'
                className='input'
                autoComplete='off'
                required
                value={optimizationCode}
                onChange={(e) => setOptimizationCode(e.target.value)}
                placeholder='Please create a code of at least 5 characters.'
                minLength={5}
                maxLength={265}
              />
              <label className='label'>
                {optimizationCode.length}/5 Characters | MAX 265
              </label>
            </div>
            <div className='column gap5'>
              <label className='label' htmlFor='category'>
                Category
              </label>
              <select
                id='category'
                className='select'
                value={optimizationCategory}
                onChange={(e) => setOptimizationCategory(e.target.value)}
                required
              >
                <option value='system'>System</option>
                <option value='graphic'>Graphic</option>
                <option value='internet'>Internet</option>
                <option value='privacy'>Privacy</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>

          <div className='modal-footer row aic jcc gap10'>
            <button
              className='button green'
              disabled={
                optimizationTitle.length < 5 ||
                optimizationTitle.length > 50 ||
                optimizationDescription.length < 5 ||
                optimizationDescription.length > 265 ||
                optimizationCode.length < 5 ||
                optimizationCode.length > 265 ||
                optimizationCategory === ""
              }
              type='submit'
            >
              Save
            </button>
            <button
              type='button'
              className='button purple'
              onClick={() => setIsEditOptimizationModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type='button'
              className='button red'
              onClick={handleDeleteOptimization}
            >
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

EditOptimizationModal.propTypes = {
  uid: PropTypes.string,
  token: PropTypes.string,
  browser: PropTypes.string,
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  code: PropTypes.string,
  category: PropTypes.string,
  isEditOptimizationModalOpen: PropTypes.bool,
  setIsEditOptimizationModalOpen: PropTypes.func,
  setRegSwitchData: PropTypes.func,
  setRegSettings: PropTypes.func,
};

export default EditOptimizationModal;
