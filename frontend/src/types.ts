
export enum ProjectStatus {
  PLANNING = 'Planning',
  IN_PROGRESS = 'In Progress',
  STALLED = 'Stalled',
  COMPLETED = 'Completed'
}

export interface Project {
  id: string;
  name: string;
  location: string;
  budget: number;
  spent: number;
  status: ProjectStatus;
  completionDate: string;
}

export interface MaterialLog {
  id: string;
  date: string;
  item: string;
  quantity: number;
  unit: string;
  cost: number;
  verified: boolean;
  photoUrl?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  cost: number;
  status: 'Pending' | 'Approved' | 'Paid';
  photoProof?: string;
}

export interface Fundi {
  id: string;
  name: string;
  category: 'Plumber' | 'Electrician' | 'Mason' | 'Foreman';
  rating: number;
  reviews: number;
  verified: boolean;
  avatar: string;
}

export interface Permit {
  name: string;
  status: 'Pending' | 'Applied' | 'Approved';
  agency: 'NEMA' | 'NCA' | 'County';
  renewalDate?: string;
}
