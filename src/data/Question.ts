export interface Question {
    id: number;
    question: string;
    type: 'multiple' | 'text';
    possibilities?: string[];  // Pour les questions à choix multiples
    answer: string;
}
