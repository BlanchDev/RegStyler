import PropTypes from "prop-types";
import "./PackageRegSwitch.css";
import InformationModalBtn from "../../../components/InformationModalBtn/InformationModalBtn";
import { useEffect, useRef } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import useScreenNotifi from "../../../hooks/useScreenNotifi/useScreenNotifi";
import { motion } from "framer-motion";

function PackageRegSwitch({
  id,
  title,
  description,
  category,
  code,
  owner,
  createdAt,
  checkedRegSettings,
  setCheckedRegSettings,
  packageID,
  animationDelay,
}) {
  const { setNotifi, ScreenNotifiComponent, isDisabled } = useScreenNotifi();
  const checkRef = useRef(null);

  const toggleRegStyle = (e) => {
    const newChecked = e.target.checked;

    if (!newChecked && checkedRegSettings.length === 1) {
      setNotifi("info", "You can't uncheck the last optimization", 3000);
      checkRef.current.checked = true;
      return;
    }

    checkRef.current.checked = newChecked;

    if (newChecked) {
      setCheckedRegSettings((prevSettings) => [
        ...prevSettings,
        { id, title, code, owner },
      ]);
    } else {
      setCheckedRegSettings((prevSettings) =>
        prevSettings.filter((item) => item.id !== id),
      );
    }
  };

  useEffect(() => {
    localStorage.setItem(packageID, JSON.stringify(checkedRegSettings));
  }, [checkedRegSettings, packageID]);

  useEffect(() => {
    checkRef.current.checked = checkedRegSettings.some(
      (item) => item.id === id,
    );
  }, [checkedRegSettings, id]);

  return (
    <motion.div
      className={`package-reg-switch column aifs jcsb gap15 ${
        owner !== "admin" && "reg-switch-custom"
      }`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
    >
      <div className='reg-switch-header row aic jcsb'>
        <label htmlFor={id}>{title}</label>
        <input
          ref={checkRef}
          type='checkbox'
          onChange={(e) => toggleRegStyle(e)}
          id={id}
          disabled={isDisabled}
        />
      </div>
      <div className='reg-switch-desc column'>
        <p className='reg-desc-limited row aic'>{description}</p>
      </div>
      <div className='reg-switch-footer row aic jcsb'>
        <div className='reg-switch-footer-left row aic gap10'>
          <div className={`reg-switch-category ${category}`}>{category}</div>
        </div>
        <div className='reg-switch-footer-right row aic gap10'>
          {owner !== "admin" && (
            <div className='reg-switch-date'>
              {formatDistanceToNowStrict(new Date(createdAt * 1000))}
            </div>
          )}
          <InformationModalBtn
            title={title}
            description={description}
            code={code}
          />
        </div>
      </div>
      <ScreenNotifiComponent />
    </motion.div>
  );
}

PackageRegSwitch.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  checkedRegSettings: PropTypes.array.isRequired,
  setCheckedRegSettings: PropTypes.func.isRequired,
  packageID: PropTypes.string.isRequired,
  animationDelay: PropTypes.number.isRequired,
};

export default PackageRegSwitch;
