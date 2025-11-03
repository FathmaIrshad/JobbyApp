import Cookies from 'js-cookie'
import {Redirect, withRouter, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = props => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  const openJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <div>
      <Header />
      <div className="home-bg">
        <div className="w-50 p-5">
          <h1>Find the Job That Fits Your Life</h1>
          <p>
            Millions of people are searching for jobs, salary
            information,company reviews.Find the job that fits your abilities
            and potential.
          </p>
          <Link to="/jobs">
            <button type="button" className="btn-blue" onClick={openJobs}>
              Find Jobs
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default withRouter(Home)
