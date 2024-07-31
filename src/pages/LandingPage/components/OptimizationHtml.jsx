import PropTypes from "prop-types";
import InformationModalBtn from "../../../components/InformationModalBtn/InformationModalBtn";

function OptimizationHtml({ optimization }) {
  return (
    <div
      className={`landing-reg-switch column aifs jcsb gap15 ${
        optimization.owner === "user" ? "reg-switch-custom" : ""
      }`}
    >
      <div className='reg-switch-header row aic jcsb'>
        <div>{optimization.title}</div>
        <input type='checkbox' checked={optimization.checked} readOnly />
      </div>
      <div className='reg-switch-desc column'>
        <p className='reg-desc-limited row aic'>{optimization.description}</p>
      </div>
      <div className='reg-switch-footer row aic jcsb'>
        <div className='reg-switch-footer-left row aic gap10'>
          <div className={`reg-switch-category ${optimization.category}`}>
            {optimization.category}
          </div>
        </div>
        <div className='reg-switch-footer-right row aic gap10'>
          <div className='reg-switch-date'>
            {optimization.owner !== "admin" && optimization.date}
          </div>
          <InformationModalBtn
            title={"null"}
            description={"null"}
            code={"null"}
          />
        </div>
      </div>
    </div>
  );
}

OptimizationHtml.propTypes = {
  optimization: PropTypes.object.isRequired,
};

export default OptimizationHtml;
