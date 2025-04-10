import mongoose from "mongoose";

const interviewerSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	phone: { type: String },
	expertise: [String],
	experience: { type: Number },
	company: { type: String },
	position: { type: String },
	availability: [
		{
			day: String,
			startTime: String,
			endTime: String,
		},
	],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Interviewer ||
	mongoose.model("Interviewer", interviewerSchema);
