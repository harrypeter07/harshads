export interface WorkExperience {
	id: string;
	company: string;
	position: string;
	startDate: string;
	endDate?: string | null;
	description: string;
}
