import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// racfp shortcut for porp type
const Alert = ({ alerts }) =>
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => ( // this statement will be executed only if the first 2 statements are true
    // the following variable needs to match the CSS style
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
