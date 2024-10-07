export interface ICourseForm {
    name: string;
    description: string;
    enrollmentStart: Date;
    enrollmentEnd: Date;
    teachingStart: Date;
    teachingEnd: Date;
}

export interface ICourse extends ICourseForm {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    createdByUserId: number;
}