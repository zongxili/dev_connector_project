import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';


const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  });

  const { name, email, password, password2 } = formData; // pull the info from 'formData' object

  const onCharge = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  // by doing this, the target will be as same as the name
  // Why put e.target.name in brackets? 
  // This is to dynamically update object property (when the name of the property is unknown upfront but runtime).
  // e means event

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      // the 2nd parameter is the 'alertType'
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password });
      // console.log('SUCCESS');
    }
  };

  // Redirect if registered
  if (isAuthenticated) {
    return <Redirect to="/dashboard" />
  }


  return (
    <Fragment>
      <h1 className='large text-primary'>Sign Up</h1>
      <p className='lead'><i className='fas fa-user'></i> Create Your Account</p>
      <form className='form' onSubmit={e => onSubmit(e)}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Name'
            name='name'
            value={name}
            onChange={e => onCharge(e)}
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            name='email'
            value={email}
            onChange={e => onCharge(e)}
            required
          />
          <small className='form-text'>
            This site uses Gravatar so if you want a profile image, use a Gravatar email
          </small>
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            value={password}
            onChange={e => onCharge(e)}
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Confirm Password'
            name='password2'
            value={password2}
            onChange={e => onCharge(e)}
            minLength='6'
          />
        </div>
        <input
          type='submit'
          className='btn btn-primary'
          value='Register'
        />
      </form>
      <p className='my-1'>
        Already have an account? <Link to='/login'>Sign In</Link>
      </p>
    </Fragment>
  )
};

Register.propTypes = {
  // ptfr for PropTypes.func.isRequired
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(
  mapStateToProps,
  { setAlert, register }
)(Register);