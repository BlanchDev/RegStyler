import PropTypes from "prop-types";
import "../Modal.css";

function InformationModal({
  title,
  description,
  code,
  isInformationModalOpen,
  setIsInformationModalOpen,
}) {
  if (!isInformationModalOpen) return null;

  setIsInformationModalOpen(false);
  setIsInformationModalOpen(true);

  return (
    <div className='modal column aic jcc'>
      <button
        className='modal-overlay'
        onClick={() => setIsInformationModalOpen(false)}
      />
      <div className='modal-container column gap15'>
        <div className='modal-header row aic jcsb'>
          <h2>{title}</h2>
          <button
            className='modal-close row aic jcc'
            onClick={() => setIsInformationModalOpen(false)}
          >
            ×
          </button>
        </div>
        <div className='modal-content column aic gap20'>
          <p className='desc-nolimited'>{description}</p>
          <pre className='code-block'>{code}</pre>
        </div>
      </div>
    </div>
  );
}

InformationModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  isInformationModalOpen: PropTypes.bool.isRequired,
  setIsInformationModalOpen: PropTypes.func.isRequired,
};

export default InformationModal;
