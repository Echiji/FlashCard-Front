export interface CourseDTO {
    id: number;
    title: string;
    typeCourse: string;
    userId: number;
    lessonCount: number;
}

export interface LessonDTO {
    id: number;
    title: string;
    description: string;
    userId: number;
    courseId: number;
    courseTitle: string;
    questionCount: number;
}

export interface PossibilityDTO {
    id: number;
    possibility: string;  
    questionId: number;
}

export interface QuestionDTO {
    id: number;
    question: string;
    type: string;
    answer: string;
    questionnaireId: number;
    possibilities: PossibilityDTO[];
}

export interface TestControleDTO {
    id: number;
    nbBonneReponse: number;
    nbQuestion: number;
    dateCreation: string;
    lessonId: number;
    lessonTitle: string;
    userId: number;
    username: string;
    pourcentageReussite: number;
}

export interface ProfileDTO {
    username: string;
    nbTestControle: number;
    nbTestControlePerfect: number;
    nbTestControleFailed: number;
    nbTestControlePassed: number;
}
