import axiosInstance from './axiosInstance';
import { PossibilityDTO } from '../../Types';

const API_URL = '/api/possibilities';

export interface PossibilityCreateRequest {
    value: string;
    question: {
        id: number;
    };
}

export interface PossibilityUpdateRequest {
    value: string;
}

class PossibilityService {
    // Récupérer les possibilités d'une question (retourne des DTOs)
    async getPossibilitiesByQuestion(questionId: number): Promise<PossibilityDTO[]> {
        const response = await axiosInstance.get(`${API_URL}/questions/${questionId}`);
        return response.data;
    }

    // Créer une nouvelle possibilité
    async createPossibility(possibility: PossibilityCreateRequest): Promise<PossibilityDTO> {
        const response = await axiosInstance.post(API_URL, possibility);
        return response.data;
    }

    // Récupérer une possibilité par ID (retourne un DTO)
    async getPossibilityById(id: number): Promise<PossibilityDTO> {
        const response = await axiosInstance.get(`${API_URL}/${id}`);
        return response.data;
    }

    // Mettre à jour une possibilité
    async updatePossibility(id: number, possibility: PossibilityUpdateRequest): Promise<PossibilityDTO> {
        const response = await axiosInstance.put(`${API_URL}/${id}`, possibility);
        return response.data;
    }

    // Supprimer une possibilité
    async deletePossibility(id: number): Promise<void> {
        await axiosInstance.delete(`${API_URL}/${id}`);
    }
}

export default new PossibilityService();
