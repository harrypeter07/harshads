export const users = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		role: "candidate",
		password: "hashed_password_1", // In a real app, passwords would be properly hashed
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@company.com",
		role: "recruiter",
		password: "hashed_password_2",
	},
	{
		id: "3",
		name: "Admin User",
		email: "admin@admin.com",
		role: "admin",
		password: "hashed_password_3",
	},
];

export const interviews = [
	{
		id: "1",
		candidateId: "1",
		recruiterId: "2",
		status: "scheduled",
		date: "2024-04-01T10:00:00Z",
		position: "Software Engineer",
	},
	// Add more mock interviews as needed
];

export const companies = [
	{
		id: "1",
		name: "Tech Corp",
		description: "Leading technology company",
		recruiterId: "2",
		openPositions: ["Software Engineer", "Product Manager"],
	},
	// Add more mock companies as needed
];

export const profiles = {
	candidate: {
		"1": {
			skills: ["JavaScript", "React", "Node.js"],
			experience: "5 years",
			education: "Bachelor in Computer Science",
			resume: "path/to/mock/resume.pdf",
		},
	},
	recruiter: {
		"2": {
			company: "Tech Corp",
			position: "Senior Recruiter",
			hiring: ["Software Engineer", "Product Manager"],
		},
	},
};
