import {Component} from 'react'
import Cookies from 'js-cookie'
import {IoMdOpen} from 'react-icons/io'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FaStar} from 'react-icons/fa'
import './index.css'
import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItem extends Component {
  state = {apiStatus: apiStatusConstants.initial, jobItemData: {}}

  componentDidMount() {
    this.getJobItem()
  }

  getJobItem = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const jobDetailsApiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobDetailsApiUrl, options)
    console.log(response)
    const data = await response.json()
    console.log('API Response:', data) // Add this line for debugging
    if (response.ok === true) {
      const jobData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }
      this.setState({
        jobItemData: jobData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobItem = () => {
    const {jobItemData} = this.state
    const {jobDetails, similarJobs} = jobItemData
    const {
      company_logo_url: companyLogoUrl,
      company_website_url: companyWebsiteUrl,
      employment_type: employmentType,
      job_description: jobDescription,
      skills,
      life_at_company: lifeAtCompany,
      location,
      package_per_annum: packagePerAnnum,
      rating,
    } = jobDetails

    return (
      <div>
        <ul>
          <Header />
        </ul>
        <div className="job-item-bg">
          <div className="job-item-container">
            <img src={companyLogoUrl} alt="job details company logo" />
            <h1>{jobDetails.title}</h1>
            <hr />
            <div>
              <p>
                <FaStar className="star-filled" /> {rating}
              </p>
            </div>
            <div className="d-flex justify-content-between">
              <div className="d-flex">
                <MdLocationOn />
                &nbsp;
                <p>{location}&nbsp;&nbsp;</p>
                <BsFillBriefcaseFill />
                &nbsp;&nbsp;
                <p>{employmentType}</p>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
            <hr />
            <div className="d-flex justify-content-between">
              <h1>Description</h1>
              <a href={companyWebsiteUrl}>
                Visit
                <IoMdOpen />
              </a>
            </div>
            <p>{jobDescription}</p>
            <h4>Skills</h4>
            <ul className="d-flex flex-wrap">
              {skills.map(skill => (
                <li
                  key={skill.name}
                  className="d-flex justify-content-center align-items-center m-5"
                >
                  <img
                    src={skill.image_url}
                    alt={skill.name}
                    height="50px"
                    width="50px"
                    className="m-2 p-0"
                  />
                  <h6 className="text-white m-0 p-0">{skill.name}</h6>
                </li>
              ))}
            </ul>
            <h3>Life At Company</h3>
            <p>{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.image_url}
              alt="life at company"
              height="100px"
              width="100px"
            />
          </div>

          <h1>Similar Jobs</h1>
          <ul className="d-flex flex-wrap">
            {similarJobs.map(job => (
              <li key={job.id} className="job-item-container similar-job-li">
                <div className="d-flex justify-content-center align-items-center">
                  <img
                    src={job.company_logo_url}
                    alt="similar job company logo"
                    height="50px"
                    width="50px"
                    className="ml-0 mr-2"
                  />
                  <div>
                    <h6>{job.title}</h6>
                    <p>
                      <FaStar className="star-filled" />
                      {job.rating}
                    </p>
                  </div>
                </div>
                <h4>Description</h4>
                <p>{job.job_description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex justify-content-between align-items-center">
                    <MdLocationOn />
                    <p className="m-2">{job.location}</p>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <BsFillBriefcaseFill />
                    <p className="m-2">{job.employment_type}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        height="200px"
        width="300px"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        onClick={this.getJobItem}
        className="profile-failure-bg"
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItem()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}
export default JobItem
