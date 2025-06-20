import axiosInstance from './axiosInstance';
import { Lesson } from './LessonService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/questions';

export interface Possibility {
    id: number;
    value: string;
}

export interface Question {
    id: number;
    question: string;
    type: string;
    answer: string;
    lesson?: Lesson; // Optionnel, selon ce que tu veux afficher
    possibilities?: Possibility[]; // Possibilités pour les questions à choix multiples
}

export default {
    // Récupérer toutes les leçons de l'utilisateur connecté
    async getQuestionsByLesson(lesson: Lesson): Promise<Question[]> {
        const res = await axiosInstance.get(`${API_URL}/lessons/${lesson.id}`);
        return res.data;
    },

    // Créer une nouvelle leçon
    async createQuestion(question: Question): Promise<Question> {
        console.log("create question "+ question.question + " " + question.answer);
        const res = await axiosInstance.post(API_URL, question);
        console.log(res.data);
        return res.data;
    },

    // Modifier une leçon existante
    async updateQuestion(id: number, question: Omit<Question, 'id'>): Promise<Question> {
        const res = await axiosInstance.put(`${API_URL}/${id}`, question);
        return res.data;
    },

    // Supprimer une leçon
    async deleteQuestion(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },

    // Récupérer une leçon par son ID
    async getQuestionById(id: number): Promise<Question> {
        const res = await axiosInstance.get(`${API_URL}/${id}`);
        return res.data;
    }
};
