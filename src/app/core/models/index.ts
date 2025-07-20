export interface User {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'ENSEIGNANT' | 'ELEVE' | 'PARENT';
  nom: string;
  prenom: string;
  token?: string;
}

export interface Admin extends User {
  role: 'ADMIN';
}

export interface Enseignant extends User {
  role: 'ENSEIGNANT';
  matieres: Matiere[];
  classes: Classe[];
}

export interface Eleve extends User {
  role: 'ELEVE';
  dateNaissance: Date;
  classe: Classe;
  notes: Note[];
  bulletins: Bulletin[];
}

export interface Parent extends User {
  role: 'PARENT';
  enfants: Eleve[];
}

export interface Classe {
  id: number;
  nom: string;
  niveau: string;
  anneeScolaire: string;
  enseignants: Enseignant[];
  eleves: Eleve[];
}

export interface Matiere {
  id: number;
  nom: string;
  coefficient: number;
  enseignants: Enseignant[];
}

export interface Note {
  id: number;
  valeur: number;
  coefficient: number;
  date: Date;
  commentaire?: string;
  matiere: Matiere;
  eleve: Eleve;
  trimestre: number;
}

export interface Bulletin {
  id: number;
  eleve: Eleve;
  trimestre: number;
  anneeScolaire: string;
  notes: Note[];
  moyenne: number;
  appreciation: string;
  dateGeneration: Date;
  url?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}