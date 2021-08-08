import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className='navbar bg-dark'>
      <h1>
        <Link to='/'>
          {/* it doesn't send a request to the server but just looks at the URL path */}
          <i className='fas fa-code' />DevConnector
        </Link>
      </h1>
      <ul>
        <li><a href='!#'>Developers</a></li>
        <li>
          <Link to='/register'>Register</Link>
        </li>
        <li>
          <Link to='/login'>Login</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar;
