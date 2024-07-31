import "./Main.css";
import PropTypes from "prop-types";

function Main({ children }) {
  return (
    <main className='column aic'>
      <div className='main-content column aic'>{children}</div>
    </main>
  );
}

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
