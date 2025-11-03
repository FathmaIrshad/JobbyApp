import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <div className="d-flex justify-content-between align-items-center header-bg">
      <ul>
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              height="30px"
              width="110px"
            />
          </Link>
        </li>
        <li className="d-flex justify-content-around">
          <Link to="/">
            <h3>Home</h3>
          </Link>
        </li>
        <li>
          <Link to="/jobs">
            <h3>Jobs</h3>
          </Link>
        </li>
        <li>
          <button type="button" className="btn-blue" onClick={onClickLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}
export default withRouter(Header)
