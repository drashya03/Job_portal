import JobApplication from "../models/JobApplications.js";
import User from "../models/User.js";
import Job from "../models/job.js";
import { v2 as cloudinary } from "cloudinary"
// Get your data
export const getUserData = async (req, res) => {
  const userId = req.auth.userId;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Apply for a job
export const applyForJob = async (req, res) => {
  const { jobId } = req.body;
  const userId = req.auth.userId;

  try {
    const isAlreadyApplied = await JobApplication.find({ jobId, userId });

    if (isAlreadyApplied.length > 0) {
      return res.json({ success: false, message: "Already Applied" });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.json({ success: false, message: "Job not found" });
    }

    await JobApplication.create({
      companyId: jobData.companyId,
      userId,
      jobId,
      date: Date.now(),
    });

    res.json({ success: true, message: "Applied Successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user applied applications
export const getUserJobApplications = async (req, res) => {
  try {
    const userId = req.auth.userId;

    // Build the query and populate before awaiting the result
    const applications = await JobApplication.find({ userId })
      .populate("companyId", "name email image")
      .populate("jobId", "title description location category level salary")
      .exec();

    // Return an array (may be empty)
    return res.json({ success: true, applications });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// update user profile (resume)
export const updateUserResume = async (req, res) => {
    try {
        const userID = req.auth.userId

    // multer stores the uploaded file on req.file
    const resumeFile = req.file

    const userData = await User.findById(userID)

    if (!userData) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    if (resumeFile) {
      // If resume is a non-image (pdf/doc), upload as raw resource
      // multer with diskStorage will provide resumeFile.path; if using memory storage it may provide buffer
      const uploadSource = resumeFile.path || resumeFile.buffer
      const resumeUpload = await cloudinary.uploader.upload(uploadSource, { resource_type: 'raw' })
      userData.resume = resumeUpload.secure_url
    }

        await userData.save()

        return res.json({success:true, message:'Resume Updated'})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
};
