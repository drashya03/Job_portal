import express from 'express'
import { ChangeJobApplicationStatus, changeVisiblity, getCompanyData, getCompanyJobApplicants, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyController.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authmiddleware.js'

const router = express.Router()

// Rajister company
router.post('/register', upload.single('image'), registerCompany)

// company Login
router.post('/login', loginCompany)

// Get company data
router.get('/company', protectCompany, getCompanyData)

// Post a job 
router.post('/post-job', protectCompany, postJob)

// Get Applicants Data of company
router.get('/applicants', protectCompany ,getCompanyJobApplicants)

// get company job list
router.get('/list-jobs',protectCompany , getCompanyPostedJobs)

// change app status
router.post('/change-status', protectCompany ,ChangeJobApplicationStatus)

// change application visiblity
router.post('/change-visiblity',protectCompany ,changeVisiblity)


export default router