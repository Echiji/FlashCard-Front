import { Question } from "./Question";

export interface Lesson {
    id: number;
    title: string;
    description: string;
    questions: Question[];
}

