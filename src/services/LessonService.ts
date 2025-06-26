import axiosInstance from './axiosInstance';
import { Question } from '@/data/Question';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/lessons';

export interface Lesson {
    id?: number;
    title: string;
    description: string;
    user?: any; // Optionnel, selon ce que tu veux afficher
    courseId?: number; // ID du cours associé
    courseTitle?: string; // Titre du cours associé
    questions?: Question[]; // Questions de la leçon
}

export default {
    // Récupérer toutes les leçons de l'utilisateur connecté
    async getLessons(): Promise<Lesson[]> {
        const res = await axiosInstance.get(API_URL);
        console.log('=== LESSON SERVICE - Réponse brute du backend ===');
        console.log('Response data:', res.data);
        return res.data;
    },

    // Créer une nouvelle leçon
    async createLesson(lesson: Lesson): Promise<Lesson> {
        console.log("create lesson "+ lesson.title + " " + lesson.description);
        const res = await axiosInstance.post(API_URL, lesson);
        console.log(res.data);
        return res.data;
    },

    // Créer une nouvelle leçon associée à un cours
    async createLessonWithCourse(courseId: number, lesson: Lesson): Promise<Lesson> {
        console.log("create lesson with course "+ lesson.title + " " + lesson.description + " for course " + courseId);
        const res = await axiosInstance.post(`${API_URL}/courses/${courseId}`, lesson);
        console.log(res.data);
        return res.data;
    },

    // Modifier une leçon existante
    async updateLesson(id: number, lesson: Omit<Lesson, 'id'>): Promise<Lesson> {
        const res = await axiosInstance.put(`${API_URL}/${id}`, lesson);
        return res.data;
    },

    // Supprimer une leçon
    async deleteLesson(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },

    // Récupérer une leçon par son ID
    async getLessonById(id: number): Promise<Lesson> {
        const res = await axiosInstance.get(`${API_URL}/${id}`);
        return res.data;
    },
    
    // Récupérer les leçons d'un cours spécifique
    async getLessonsByCourse(courseId: number): Promise<Lesson[]> {
        const res = await axiosInstance.get(`${API_URL}/course/${courseId}`);
        return res.data;
    }
};
