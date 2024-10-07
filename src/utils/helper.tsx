import axios from "axios";
import { toast } from "react-toastify";

export const isNilOrEmpty = (value: unknown): boolean => {
    return value === null || value === undefined || value === '';
};

export const handleSuccess = (messsage: string = "ดำเนินการสำเร็จ") => {
    toast.success(messsage);
};

export const handleError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || `Axios error: ${error.message}`;
        toast.error(errorMessage);
    } else {
        toast.error("Ooops! มีบางอย่างผิดพลาด");
    }
};

export const moveToTop = () => {
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    });
}

export const formatToCurrency = (currency : number) => {
    return currency.toFixed(2);
}