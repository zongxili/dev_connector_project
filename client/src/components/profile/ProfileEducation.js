import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ experience: {
  school, degree, fieldofstudy, current, from, to, description
} }) => {
  return (
    <div>
      <h3 className='text-dark'>{school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from} </Moment> - {current ? 'Now ' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      </p>
      <p>
        <strong>Degree:</strong>{degree}
      </p>
      <p>
        <strong>Field of Study:</strong>{fieldofstudy}
      </p>
      <p>
        <strong>Description:</strong>{description}
      </p>
    </div>
  )
};

ProfileEducation.propTypes = {
  experience: PropTypes.array.isRequired,
};

export default ProfileEducation;