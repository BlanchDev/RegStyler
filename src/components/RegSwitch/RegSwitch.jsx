import PropTypes from "prop-types";
import "./RegSwitch.css";
import InformationModalBtn from "../InformationModalBtn/InformationModalBtn";
import { useRef, useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import EditOptimizationModalBtn from "../EditOptimizationModalBtn/EditOptimizationModalBtn";
import { motion } from "framer-motion";

function RegSwitch({
  uid,
  token,
  browser,
  id,
  title,
  description,
  category,
  code,
  owner,
  createdAt,
  checkedRegSettings,
  setCheckedRegSettings,
  setRegSettings,
  animationDelay,
}) {
  const checkRef = useRef(null);
  const [regSwitchData, setRegSwitchData] = useState({
    id: id || "",
    title: title || "",
    description: description || "",
    category: category || "",
    code: code || "",
    owner: owner || "",
    createdAt: createdAt || "",
  });

  useEffect(() => {
    setRegSwitchData({
      id,
      title,
      description,
      category,
      code,
      owner,
      createdAt,
    });
  }, [
    id,
    title,
    description,
    category,
    code,
    owner,
    createdAt,
    checkedRegSettings,
  ]);

  const toggleRegStyle = (e) => {
    const newChecked = e.target.checked;
    checkRef.current.checked = newChecked;

    if (newChecked) {
      setCheckedRegSettings((prevSettings) => [
        ...prevSettings,
        {
          id: regSwitchData.id,
          title: regSwitchData.title,
          code: regSwitchData.code,
          owner: regSwitchData.owner,
        },
      ]);
    } else {
      setCheckedRegSettings((prevSettings) =>
        prevSettings.filter((item) => item.id !== regSwitchData.id),
      );
    }
  };

  useEffect(() => {
    localStorage.setItem(
      "checkedRegSettings",
      JSON.stringify(checkedRegSettings),
    );
  }, [checkedRegSettings]);

  useEffect(() => {
    checkRef.current.checked =
      checkedRegSettings.some((item) => item.id === regSwitchData.id) || false;
  }, [checkedRegSettings, regSwitchData.id]);

  return (
    <motion.div
      className={`reg-switch column aifs jcsb gap15 ${
        regSwitchData.owner === "user" ? "reg-switch-custom" : ""
      }`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: animationDelay }}
    >
      <div className='reg-switch-header row aic jcsb'>
        <label htmlFor={regSwitchData.id}>{regSwitchData.title}</label>
        <input
          ref={checkRef}
          type='checkbox'
          onChange={(e) => toggleRegStyle(e)}
          id={regSwitchData.id}
        />
      </div>
      <div className='reg-switch-desc column'>
        <p className='reg-desc-limited row aic'>{regSwitchData.description}</p>
      </div>
      <div className='reg-switch-footer row aic jcsb'>
        <div className='reg-switch-footer-left row aic gap10'>
          <div className={`reg-switch-category ${regSwitchData.category}`}>
            {regSwitchData.category}
          </div>
        </div>
        <div className='reg-switch-footer-right row aic gap10'>
          {regSwitchData.owner !== "admin" && (
            <>
              <div className='reg-switch-date'>
                {formatDistanceToNowStrict(
                  new Date(regSwitchData.createdAt * 1000),
                )}
              </div>
              <EditOptimizationModalBtn
                uid={uid}
                token={token}
                browser={browser}
                id={regSwitchData.id}
                title={regSwitchData.title}
                description={regSwitchData.description}
                code={regSwitchData.code}
                category={regSwitchData.category}
                setRegSwitchData={setRegSwitchData}
                setRegSettings={setRegSettings}
              />
            </>
          )}
          <InformationModalBtn
            title={regSwitchData.title}
            description={regSwitchData.description}
            code={regSwitchData.code}
          />
        </div>
      </div>
    </motion.div>
  );
}

RegSwitch.propTypes = {
  uid: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  browser: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  code: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  checkedRegSettings: PropTypes.array.isRequired,
  setCheckedRegSettings: PropTypes.func.isRequired,
  setRegSettings: PropTypes.func.isRequired,
  animationDelay: PropTypes.number.isRequired,
};

export default RegSwitch;
