import { ICourse, ICourseForm } from "@/interface/course";
import { courseApi } from "@/utils/api";
import { convertUtcToLocalDateWithoutTimezone } from "@/utils/dateUtils";
import { handleError } from "@/utils/helper";
import { useState } from "react";

const useCourse = () => {
    const [loading, setLoading] = useState<boolean>(false);

    const getCourseById = async (id: number): Promise<ICourse | undefined> => {
        setLoading(true);

        try {
            const { data: response } = await courseApi.get<ICourse>(`course/${id}`);

            return response;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return undefined;
    };

    const createCourse = async (body: ICourseForm): Promise<boolean> => {
        setLoading(true);

        const bodyLocalDate = {
            name: body.name,
            description: body.description,
            enrollmentStart: convertUtcToLocalDateWithoutTimezone(body.enrollmentStart),
            enrollmentEnd: convertUtcToLocalDateWithoutTimezone(body.enrollmentEnd),
            teachingStart: convertUtcToLocalDateWithoutTimezone(body.teachingStart),
            teachingEnd: convertUtcToLocalDateWithoutTimezone(body.teachingEnd),
        };

        try {
            await courseApi.post<ICourse>(`course`, bodyLocalDate);
            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    const updateCourse = async (id: number, body: ICourseForm): Promise<boolean> => {
        setLoading(true);

        const bodyLocalDate = {
            name: body.name,
            description: body.description,
            enrollmentStart: convertUtcToLocalDateWithoutTimezone(body.enrollmentStart),
            enrollmentEnd: convertUtcToLocalDateWithoutTimezone(body.enrollmentEnd),
            teachingStart: convertUtcToLocalDateWithoutTimezone(body.teachingStart),
            teachingEnd: convertUtcToLocalDateWithoutTimezone(body.teachingEnd),
        };

        try {
            await courseApi.put<ICourse>(`course/${id}`, bodyLocalDate);
            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    const deleteCourse = async (id: number): Promise<boolean> => {
        setLoading(true);

        try {
            await courseApi.delete<void>(`course/${id}`);
            return true;
        } catch (error: unknown) {
            handleError(error);
        } finally {
            setLoading(false);
        }

        return false;
    };

    return {
        loading,
        createCourse,
        updateCourse,
        deleteCourse,
        getCourseById
    };
};

export default useCourse;