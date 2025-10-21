import express from 'express'
import { ChangeJobApplicationStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'

const router = express.Router()

// Rajister company
router.post('/register', upload.single('image'), registerCompany)

// company Login
router.post('/login', loginCompany)

// Get company data
router.post('/company', getCompanyData)

// Post a job 
router.post('/post-job', postJob)

// Get Applicants Data of company
router.post('/applicants', getCompanyJobApplicants)

// get company job list
router.post('/list-job', getCompanyPostedJobs)

// change app status
router.post('/change-status', ChangeJobApplicationStatus)

// change application visiblity
router.post('/change-visiblity',changeVisiblity)


export default router