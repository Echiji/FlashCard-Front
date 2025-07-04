import axiosInstance from './axiosInstance';


const API_URL = '/api/questions';

export interface Question {
    id: number;
    question: string;
    type: string;
    answer: string;
    questionnaireId: number;
    possibilities?: { id?: number; possibility: string; questionId?: number }[];
}

class QuestionService {
    async getQuestionsByQuestionnaireId(questionnaireId: number): Promise<any[]> {
        const response = await axiosInstance.get(`${API_URL}/questionnaire/${questionnaireId}`);
        return response.data;
    }

    async getQuestionById(id: number): Promise<any> {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    }

    async createQuestion(question: any): Promise<any> {
        const response = await axiosInstance.post(API_URL, question);
        return response.data;
    }

    async updateQuestion(id: number, question: any): Promise<any> {
        const response = await axiosInstance.put(`${API_URL}/${id}`, question);
        return response.data;
    }

    async deleteQuestion(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    }
}

export default new QuestionService();
