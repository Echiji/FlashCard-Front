import axiosInstance from './axiosInstance';
import { Question } from './QuestionService';
const API_URL = '/api/questionnaires';

export interface Questionnaire {
    id: number;
    title: string;
    description: string;
    lessonId: number;
    questions: Question[];
}   

const getQuestionnaireById = async (id: number) => {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
};

const getQuestionnaireByLessonId = async (lessonId: number) => {
    const response = await axiosInstance.get(`${API_URL}/lesson/${lessonId}`);
    return response.data;
};

const getAllQuestionnaires = async () => {
    const response = await axiosInstance.get(`${API_URL}`);
    return response.data;
};

const createQuestionnaire = async (data: { title: string; lessonId: number; description?: string }) => {
    const response = await axiosInstance.post(`${API_URL}`, data);
    return response.data;
};

const updateQuestionnaire = async (id: number, data: any) => {
    const response = await axiosInstance.put(`${API_URL}/${id}`, data);
    return response.data;
};

const deleteQuestionnaire = async (id: number) => {
    await axiosInstance.delete(`${API_URL}/${id}`);
};

const getQuestionnairesByLessonId = async (lessonId: number) => {
    const response = await axiosInstance.get(`${API_URL}/lesson/${lessonId}`);
    return response.data;
};

export default { 
    getQuestionnaireById, 
    getQuestionnaireByLessonId, 
    getAllQuestionnaires, 
    createQuestionnaire,
    updateQuestionnaire, 
    deleteQuestionnaire,
    getQuestionnairesByLessonId
};    

