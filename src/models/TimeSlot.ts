import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "JobSeeker",
		required: true,
	},
	interviewerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Interviewer",
		required: false,
		default: null,
	},
	skills: [
		{
			type: String,
			required: true,
		},
	],
	jobRole: {
		type: String,
		required: true,
	},
	interviewDone: {
		type: Boolean,
		default: false,
	},
	timeSlot: {
		type: String,
		enum: [
			"1:00 PM – 3:00 PM",
			"3:00 PM – 6:00 PM",
			"6:00 PM – 9:00 PM",
			"9:00 PM – 12:00 AM",
		],
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

const TimeSlot =
	mongoose.models.TimeSlot || mongoose.model("TimeSlot", timeSlotSchema);

export default TimeSlot;
