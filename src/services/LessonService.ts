import axiosInstance from './axiosInstance';
import { Question } from '@/data/Question';

const API_URL = '/api/lessons';

export interface Lesson {
    id?: number;
    title: string;
    description: string;
    user?: any; // Optionnel, selon ce que tu veux afficher
    courseId?: number; // ID du cours associé
    courseTitle?: string; // Titre du cours associé
    questions?: Question[]; // Questions de la leçon
}

class LessonService {
    async getAllLessons(): Promise<any[]> {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    }

    async getLessonById(id: number): Promise<any> {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    }

    async getLessonsByCourseId(courseId: number): Promise<any[]> {
        const response = await axiosInstance.get(`${API_URL}/course/${courseId}`);
        return response.data;
    }

    async getLessonsByUserId(userId: number): Promise<any[]> {
        const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
        return response.data;
    }

    async createLesson(lesson: any): Promise<any> {
        const response = await axiosInstance.post(API_URL, lesson);
        return response.data;
    }

    async createLessonWithCourse(courseId: number, lesson: any): Promise<any> {
        const lessonWithCourse = { ...lesson, courseId };
        const response = await axiosInstance.post(API_URL, lessonWithCourse);
        return response.data;
    }

    async updateLesson(id: number, lesson: any): Promise<any> {
        const response = await axiosInstance.put(`${API_URL}/${id}`, lesson);
        return response.data;
    }

    async deleteLesson(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    }
}

export default new LessonService();
