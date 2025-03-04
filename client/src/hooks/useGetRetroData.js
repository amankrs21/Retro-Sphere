import { useAuth } from "./useAuth";
import { useLoading } from "./useLoading";

export const useGetRetroData = () => {
    const { http } = useAuth();
    const { setLoading } = useLoading();

    const getRetroData = async () => {
        try {
            setLoading(true);
            const response = await http.get('/group/fetch');
            localStorage.setItem('retroData', JSON.stringify(response?.data));
            return response?.data;
        } catch (error) {
            console.error("Error fetching retro:", error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { getRetroData };
};
