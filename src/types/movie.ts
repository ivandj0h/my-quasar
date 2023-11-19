export interface Movie {
  id?: number;
  title: string;
  director: string;
  summary: string;
  genres: string[];
}

export interface MovieSummary {
  title: string;
  genres: string[];
}
