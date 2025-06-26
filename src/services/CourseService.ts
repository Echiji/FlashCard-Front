import axiosInstance from './axiosInstance';
import authService from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/courses';

export interface Course {
    id: number;
    title: string;
    typeCourse: string;
}

export default {
    async getCourses(): Promise<Course[]> {
        const res = await axiosInstance.get(API_URL);
        return res.data;
    },
    async deleteCourse(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    },
    async updateCourse(id: number, course: Course): Promise<Course> {
        const res = await axiosInstance.put(`${API_URL}/${id}`, course);
        return res.data;
    },
    async createCourse(course: Course): Promise<Course> {
        // Récupérer l'utilisateur connecté
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            throw new Error('Utilisateur non connecté');
        }

        // Créer le cours avec l'ID de l'utilisateur
        const res = await axiosInstance.post(`${API_URL}?userId=${currentUser.id}`, course);
        return res.data;
    },
    async getCourseById(id: number): Promise<Course> {
        const res = await axiosInstance.get(`${API_URL}/${id}`);
        return res.data;
    }
};


