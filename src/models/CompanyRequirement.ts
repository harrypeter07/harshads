import mongoose from "mongoose";

const companyRequirementSchema = new mongoose.Schema({
	companyId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Company",
		required: true,
	},
	// Job Role & Experience
	jobTitle: { type: String, required: true }, // Software Engineer, Data Scientist, etc.
	experienceLevel: { type: String, required: true }, // Fresher, Junior, Mid, Senior

	// Technical Skills & Qualifications
	mandatorySkills: [{ type: String, required: true }], // Programming Languages, Frameworks, etc.
	preferredSkills: [String], // Bonus Skills
	minimumQualification: { type: String, required: true }, // B.Tech, M.Tech, MCA, etc.

	// Hiring Preferences
	employmentType: { type: String, required: true }, // Full-time, Part-time, Internship, Contract
	workMode: { type: String, required: true }, // Remote, Hybrid, On-site
	salaryRange: {
		min: { type: Number, required: true },
		max: { type: Number, required: true },
	},
	jobLocation: { type: String, required: true },

	// Screening Criteria
	aptitudeTestRequired: { type: Boolean, default: false },
	codingRoundRequired: { type: Boolean, default: false },
	interviewRounds: [{ type: String }], // Tech, HR, Managerial

	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.CompanyRequirement ||
	mongoose.model("CompanyRequirement", companyRequirementSchema);
