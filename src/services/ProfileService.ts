// ProfileService.ts
import axiosInstance from './axiosInstance';

class ProfileService {
    async getUserProfile(): Promise<any> {
        const response = await axiosInstance.get('/api/user/profile');
        return response.data;
    }
}

export default new ProfileService();