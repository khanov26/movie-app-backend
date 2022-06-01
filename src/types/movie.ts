export interface Movie {
    id?: string;
    title: string;
    poster?: string;
    backdrop?: string;
    rating?: number;
    releaseDate: number;
    overview: string;
    runtime: number;
    genres: string[];
}
