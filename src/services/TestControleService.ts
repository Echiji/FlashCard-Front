import axiosInstance from './axiosInstance';

const API_URL = '/api/test-controle';

class TestControleService {

    async getTestControleById(id: number): Promise<any> {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    }

    async getTestControlesByUserId(userId: number): Promise<any[]> {
        const response = await axiosInstance.get(`${API_URL}/user/${userId}`);
        return response.data;
    }

    async getTestControlesByLessonId(lessonId: number): Promise<any[]> {
        const response = await axiosInstance.get(`${API_URL}/lesson/${lessonId}`);
        return response.data;
    }

    async createTestControle(testControle: any): Promise<any> {
        const response = await axiosInstance.post(API_URL, testControle);
        return response.data;
    }

    async deleteTestControle(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    }

    async isPerfect(id: number): Promise<boolean> {
        const response = await axiosInstance.get(`${API_URL}/isPerfect/${id}`);
        return response.data;
    }
}

export default new TestControleService();