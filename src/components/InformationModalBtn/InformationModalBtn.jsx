import PropTypes from "prop-types";
import { useState } from "react";
import "./InformationModalBtn.css";
import InformationModal from "../../utils/Modals/InformationModal/InformationModal";

function InformationModalBtn({ title, description, code }) {
  const [isInformationModalOpen, setIsInformationModalOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        className='see-information row aic jcc'
        onClick={() => setIsInformationModalOpen(true)}
      >
        ?
      </button>
      <InformationModal
        title={title}
        description={description}
        code={code}
        isInformationModalOpen={isInformationModalOpen}
        setIsInformationModalOpen={setIsInformationModalOpen}
      />
    </>
  );
}

InformationModalBtn.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
};

export default InformationModalBtn;
