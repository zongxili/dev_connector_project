import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import PrivateRoute from './components/routing/PrivateRoute';
import { Provider } from 'react-redux'; // Redux
import store from './store';
import { loadUser } from './actions/auth';
import './App.css';
import setAuthToken from './utils/setAuthToken';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar /> {/* the Navbar will be shown for all components */}
          {/* exact means the URL exactly matches but not containing */}
          <Route exact path='/' component={Landing} />
          <section className="container">
            <Alert />
            <Switch> {/* this component makes sure only one Route shown only one time */}
              <Route exact path="/register" component={Register} />
              {/* component is not same as path
              component can be a 404 component
              route can go to different paths but same component 
            */}
              <Route exact path="/login" component={Login} />
              <PrivateRoute exact
                path="/dashboard"
                component={Dashboard}
              />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </ Router >
    </Provider>
  )
};

export default App;