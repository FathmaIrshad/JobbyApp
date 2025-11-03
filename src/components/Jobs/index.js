import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdSearch, MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}
const apiProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}
class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    apiProfileStatus: apiProfileStatusConstants.initial,
    profileData: '',
    jobsList: [],
    employmentType: [],
    salaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getProfile()
    this.getJobs()
  }

  getProfile = async () => {
    this.setState({apiProfileStatus: apiProfileStatusConstants.inProgress})

    const profileAPI = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileAPI, options)
    const data = await response.json()
    if (response.ok === true) {
      const profile = data.profile_details
      const updatedProfileData = {
        name: profile.name,
        image: profile.profile_image_url,
        bio: profile.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        apiProfileStatus: apiProfileStatusConstants.success,
      })
    } else {
      this.setState({
        apiProfileStatus: apiProfileStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {employmentType, salaryRange, searchInput} = this.state
    const employmenttype = employmentType.join(',')
    const jobsAPI = `https://apis.ccbp.in/jobs?employment_type=${employmenttype}&minimum_package=${salaryRange}&search=${searchInput}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsAPI, options)
    const data = await response.json()
    if (response.ok === true) {
      const updatedJobs = data.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderProfileFailureView = () => (
    <div>
      <button
        onClick={this.getProfile}
        className="profile-failure-bg"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileData, apiProfileStatus} = this.state
    const {name, image, bio} = profileData

    switch (apiProfileStatus) {
      case apiProfileStatusConstants.success:
        return (
          <div className="profile-bg">
            <img src={image} alt="profile" />
            <h1>{name}</h1>
            <p>{bio}</p>
          </div>
        )
      case apiProfileStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiProfileStatusConstants.inProgress:
        return <>{this.renderProfileLoadingView()}</>
      default:
        return null
    }
  }

  renderJobsListView = () => {
    const {jobsList} = this.state
    // const {
    //   companyLogoUrl,
    //   employmentType,
    //   id,
    //   jobDescription,
    //   location,
    //   packagePerAnnum,
    //   rating,
    //   title,
    // } = jobsList

    return (
      <>
        {jobsList.length === 0 ? (
          <div>
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
              height="150px"
              width="250px"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        ) : (
          <ul>
            {jobsList.map(eachJob => (
              <Link to={`/jobs/${eachJob.id}`} key={eachJob.id}>
                <li className="job-container">
                  <div>
                    <img
                      src={eachJob.companyLogoUrl}
                      alt="company logo"
                      height="50px"
                      width="50px"
                      className="company-logo"
                    />
                  </div>
                  <div>
                    <h1>{eachJob.title}</h1>
                    <p>
                      <FaStar className="star-filled" /> {eachJob.rating}
                    </p>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div className="d-flex">
                      <MdLocationOn />
                      &nbsp;
                      <p>{eachJob.location}&nbsp;&nbsp;</p>
                      <BsFillBriefcaseFill />
                      &nbsp;&nbsp;
                      <p>{eachJob.employmentType}</p>
                    </div>
                    <p>{eachJob.packagePerAnnum}</p>
                  </div>
                  <hr />
                  <h1>Description</h1>
                  <p>{eachJob.jobDescription}</p>
                </li>
              </Link>
            ))}
          </ul>
        )}
      </>
    )
  }

  renderJobsFailureView = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        onClick={this.getJobs}
        className="profile-failure-bg"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderJobsList = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchJobs = () => {
    this.getJobs()
  }

  onSelectSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobs)
  }

  onChangeEmploymentType = event => {
    this.setState(
      prevState => ({
        employmentType: [...prevState.employmentType, event.target.value],
      }),
      this.getJobs,
    )
  }

  // onClickRetryJobs = () => {
  //   this.getJobs()
  // }
  // onClickRetryProfile = () => {
  //   this.getProfile()
  // }
  render() {
    const {searchInput} = this.state
    const {employmentTypesList, salaryRangesList} = this.props
    // const {label, employmentTypeId} = employmentTypesList
    // const {salaryRangeId ,label} = salaryRangesList
    return (
      <>
        <Header />
        <div className="job-bg">
          <div className="profile">
            <div>{this.renderProfileView()}</div>
            <hr />
            <div>
              <h1>Type of Employment</h1>
              <ul>
                {employmentTypesList.map(employment => (
                  <li key={employment.employmentTypeId}>
                    <input
                      type="checkbox"
                      id={employment.employmentTypeId}
                      name="employmentType"
                      value={employment.employmentTypeId}
                      onChange={this.onChangeEmploymentType}
                    />
                    <label
                      htmlFor={employment.employmentTypeId}
                      className="text-white"
                    >
                      {employment.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr />
            <div>
              <h4>Salary Range</h4>
              <ul>
                {salaryRangesList.map(salary => (
                  <li key={salary.salaryRangeId}>
                    <input
                      type="radio"
                      id={salary.salaryRangeId}
                      name="salary"
                      value={salary.salaryRangeId}
                      onChange={this.onSelectSalaryRange}
                    />
                    <label
                      htmlFor={salary.salaryRangeId}
                      className="text-white"
                    >
                      {salary.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="jobs-list">
            <div className="search-container d-flex justify-content-between">
              <input
                type="search"
                placeholder="Search"
                className="search-input"
                value={searchInput}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                className="search-btn"
                onClick={this.searchJobs}
                data-testid="searchButton"
              >
                <MdSearch className="h1" />
              </button>
            </div>

            <div>{this.renderJobsList()}</div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
