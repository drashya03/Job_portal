// Register a new company

import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js";


export const registerCompany = async (req, res) => {
    console.log("REQ.BODY:", req.body);
    const {name,email,password} = req.body

    const imageFile = req.file;

    if(!name || !email || !password || !imageFile) {
            return res.json({success:false, message: "Missing Details"})
    }

    try {

        const companyExists = await Company.findOne({email})

        if(companyExists){
            return res.json({success:false, message:'Company already registered'})
        }
        
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        // to store image in cloudinary platform
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image
            },
            token:generateToken(company._id)
        })

    } catch (error) {
        res.json({success:false, message: error.message})   
    }


};

// company login
export const loginCompany = async (req, res) => {

};

// Get company data
export const getCompanyData = async (req, res) => {

};

// post a new job
export const postJob = async (req, res) => {

};

// Get company job applicants

export const getCompanyJobApplicants = async (req, res) => {

};

// Get company posted jobs

export const getCompanyPostedJobs = async (req, res) => {

};


// Change Job app status

export const ChangeJobApplicationStatus = async (req,res) => {

}

// Change job visiblity

export const changeVisiblity = async (req,res) => {

}