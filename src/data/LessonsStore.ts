export interface Lesson {
    id: number;
    name: string;
    description: string;
    questions: string[];
    answers: string[];
}

export const lessons: Lesson[] = [
    { 
        id: 1, 
        name: 'Lesson 1', 
        description: 'Lesson 1 description',
        questions: ['1+1=2', '2+2=4', '3+3=6'],
        answers: ['2', '4', '6']
    },
    { 
        id: 2, 
        name: 'Lesson 2', 
        description: 'Lesson 2 description',
        questions: ['1+1=2', '2+2=4', '3+3=6'],
        answers: ['2', '4', '6']
    },
    { 
        id: 3, 
        name: 'Lesson 3', 
        description: 'Lesson 3 description',
        questions: ['1+1=2', '2+2=4', '3+3=6'],
        answers: ['2', '4', '6']
    }
]; 