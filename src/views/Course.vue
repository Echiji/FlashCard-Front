<template>
    <div class="courses-container">
        <h1>Courses</h1>
        <div class="courses-list">
            <CourseCard 
                v-for="course in courses" 
                :key="course.id" 
                :course="course" 
                @edit-course="openEditModal"
            />
            <button @click="openModal">Créer un cours</button>
        </div>
    </div>
    
    <!-- Modal pour créer/modifier un cours -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
            <h2>{{ isEditing ? 'Modifier un cours :' : 'Ajouter un cours :' }}</h2>
            <form @submit.prevent="saveCourse">
                <div class="form-group">
                    <label for="title">Titre</label>
                    <input type="text" v-model="newCourse.title" id="title" required />
                </div>
                <div class="form-group">
                    <label for="typeCourse">Type de cours</label>
                    <input type="text" v-model="newCourse.typeCourse" id="typeCourse" required />
                </div>
                <div class="modal-buttons">
                    <button type="button" @click="closeModal">Annuler</button>
                    <button v-if="isEditing" type="submit">Modifier</button>
                    <button v-else type="submit">Créer</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import CourseCard from '@/components/CourseCard.vue';
import CourseService from '@/services/CourseService';
import authService from '@/services/authService';

interface Course {
    id: number;
    title: string;
    typeCourse: string;
}

const courses = ref<Course[]>([]);
const showModal = ref(false);
const newCourse = ref<Course>({
    id: 0,
    title: '',
    typeCourse: ''
});
const isEditing = ref(false);

onMounted(async () => {
    try {
        const data = await CourseService.getCourses();
        courses.value = data;
    } catch (error) {
        console.error('Erreur lors du chargement des cours:', error);
        alert('Erreur lors du chargement des cours');
    }
});

const openModal = () => {
    showModal.value = true;
    isEditing.value = false;
    // Réinitialiser le formulaire
    newCourse.value = {
        id: 0,
        title: '',
        typeCourse: ''
    };
};

const openEditModal = (course: Course) => {
    showModal.value = true;
    isEditing.value = true;
    // Pré-remplir le formulaire avec les données du cours
    newCourse.value = {
        id: course.id,
        title: course.title,
        typeCourse: course.typeCourse
    };
};

const closeModal = () => {
    showModal.value = false;
    isEditing.value = false;
};

const saveCourse = async () => {
    try {
        if (isEditing.value) {
            const data = await CourseService.updateCourse(newCourse.value.id, newCourse.value);
            courses.value = courses.value.map(course => course.id === data.id ? data : course);
        } else {
            await createCourse();
        }
        closeModal();
    } catch (error) {
        console.error('Erreur lors de la sauvegarde du cours:', error);
        alert('Erreur lors de la sauvegarde du cours');
    }
};

const createCourse = async () => {
    try {
        // Le service gère déjà l'utilisateur connecté
        const data = await CourseService.createCourse(newCourse.value);
        courses.value.push(data);
    } catch (error) {
        console.error('Erreur lors de la création du cours:', error);
        throw error; // Remonter l'erreur pour la gestion dans saveCourse
    }
};
</script>

<style scoped>
.courses-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.courses-container h1 {
    color: #333;
    margin-bottom: 20px;
}

.courses-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.course-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    background-color: #f9f9f9;
}

.course-lessons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px solid #ddd;
}

.course-lessons h3 {
    color: #333;
    margin: 0;
    font-size: 1.2em;
}

.lessons-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    margin-bottom: 15px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-decoration: none;
    display: inline-block;
    text-align: center;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 80vh;
    overflow-y: auto;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
}

.modal-buttons {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
}

.modal-buttons button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal-buttons button[type="button"] {
    background-color: #6c757d;
    color: white;
}

.modal-buttons button[type="submit"] {
    background-color: #007bff;
    color: white;
}

.modal-buttons button:hover {
    opacity: 0.8;
}
</style>