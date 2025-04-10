import mongoose from "mongoose";

const jobSeekerSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: String },
	skills: [String],
	experience: [
		{
			company: String,
			position: String,
			startDate: Date,
			endDate: Date,
			description: String,
		},
	],
	education: [
		{
			institution: String,
			degree: String,
			field: String,
			startDate: Date,
			endDate: Date,
		},
	],
	resume: { type: String },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.JobSeeker ||
	mongoose.model("JobSeeker", jobSeekerSchema);
