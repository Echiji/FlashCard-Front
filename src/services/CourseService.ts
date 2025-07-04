import axiosInstance from './axiosInstance';
import authService from './authService';

const API_URL = '/api/courses';

export interface Course {
    id: number;
    title: string;
    typeCourse: string;
}

class CourseService {
    async getAllCourses(): Promise<any[]> {
        const response = await axiosInstance.get(API_URL);
        return response.data;
    }

    async getCourseById(id: number): Promise<any> {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    }

    async getCoursesByUserId(userId: number): Promise<any[]> {
        const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
        return response.data;
    }

    async createCourse(course: any): Promise<any> {
        const response = await axiosInstance.post(API_URL, course);
        return response.data;
    }

    async updateCourse(id: number, course: any): Promise<any> {
        const response = await axiosInstance.put(`${API_URL}/${id}`, course);
        return response.data;
    }

    async deleteCourse(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    }
}

export default new CourseService();


