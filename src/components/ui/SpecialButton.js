import React from "react";
import PropTypes from "prop-types";
import "./SpecialButton.css";

function SpecialButton(props) {
  return (
    <button
      class="custom-btn btn-8"
      style={{ width: props.width }}
      disabled={props.isDisabled}
    >
      <span><b>{props.message}</b></span>
    </button>
  );
}

SpecialButton.propTypes = {
  message: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool,
};

SpecialButton.defaultProps = {
  isDisabled: true,
};

export default SpecialButton;
