<template>
    <div class="home-container">
        <div class="header-section">
            <h1>Mes Cours</h1>
            <button @click="showCreateModal = true" class="create-course-btn">
                <span>+</span> Créer un cours
            </button>
        </div>
        
        <!-- État de chargement -->
        <div v-if="loading" class="loading">
            <p>Chargement des cours...</p>
        </div>
        
        <!-- État d'erreur -->
        <div v-else-if="error" class="error">
            <p>{{ error }}</p>
            <button @click="loadCourses" class="retry-btn">Réessayer</button>
        </div>
        
        <!-- Affichage des cours -->
        <div v-else-if="courses.length > 0" class="courses-grid">
            <course-card 
                v-for="course in courses" 
                :key="course.id" 
                :course="course"
                @edit-course="handleEditCourse"
            />
        </div>
        
        <!-- Aucun cours -->
        <div v-else class="no-courses">
            <p>Aucun cours disponible.</p>
            <button @click="showCreateModal = true" class="create-btn">Créer un nouveau cours</button>
        </div>

        <!-- Modal de création de cours -->
        <div v-if="showCreateModal" class="modal-overlay" @click="closeModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Créer un nouveau cours</h2>
                    <button @click="closeModal" class="close-btn">&times;</button>
                </div>
                
                <form @submit.prevent="createCourse" class="create-form">
                    <div class="form-group">
                        <label for="title">Titre du cours *</label>
                        <input 
                            id="title"
                            v-model="newCourse.title" 
                            type="text" 
                            required 
                            placeholder="Entrez le titre du cours"
                            class="form-input"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="typeCourse">Type de cours *</label>
                        <input 
                            id="typeCourse"
                            v-model="newCourse.typeCourse" 
                            type="text" 
                            required 
                            placeholder="Ex: Développement Web, Marketing, etc."
                            class="form-input"
                        />
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" @click="closeModal" class="cancel-btn">
                            Annuler
                        </button>
                        <button type="submit" :disabled="creating" class="submit-btn">
                            {{ creating ? 'Création...' : 'Créer le cours' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal d'édition de cours -->
        <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
            <div class="modal-content" @click.stop>
                <div class="modal-header">
                    <h2>Modifier le cours</h2>
                    <button @click="closeEditModal" class="close-btn">&times;</button>
                </div>
                
                <form @submit.prevent="updateCourse" class="create-form">
                    <div class="form-group">
                        <label for="edit-title">Titre du cours *</label>
                        <input 
                            id="edit-title"
                            v-model="editingCourse.title" 
                            type="text" 
                            required 
                            placeholder="Entrez le titre du cours"
                            class="form-input"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-typeCourse">Type de cours *</label>
                        <input 
                            id="edit-typeCourse"
                            v-model="editingCourse.typeCourse" 
                            type="text" 
                            required 
                            placeholder="Ex: Développement Web, Marketing, etc."
                            class="form-input"
                        />
                    </div>
                    
                    <div class="form-actions">
                        <button type="button" @click="closeEditModal" class="cancel-btn">
                            Annuler
                        </button>
                        <button type="submit" :disabled="updating" class="submit-btn">
                            {{ updating ? 'Modification...' : 'Modifier le cours' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CourseCard from '../components/CourseCard.vue';
import CourseService from '../services/CourseService';

const router = useRouter();
const courses = ref<any[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const showCreateModal = ref(false);
const creating = ref(false);
const showEditModal = ref(false);
const updating = ref(false);

interface Course {
    id: number;
    title: string;
    typeCourse: string;
    user_id: number;
    lessonCount: number;
}

interface NewCourse {
    title: string;
    typeCourse: string;
}

const newCourse = ref<NewCourse>({
    title: '',
    typeCourse: ''
});

const editingCourse = ref<Course>({
    id: 0,
    title: '',
    typeCourse: '',
    user_id: 0,
    lessonCount: 0
});

const loadCourses = async () => {
    try {
        loading.value = true;
        error.value = null;
        const coursesData = await CourseService.getAllCourses();
        courses.value = coursesData;
    } catch (err) {
        console.error('Erreur lors du chargement des cours:', err);
        error.value = 'Erreur lors du chargement des cours. Veuillez réessayer.';
    } finally {
        loading.value = false;
    }
};

const createCourse = async () => {
    if (!newCourse.value.title.trim() || !newCourse.value.typeCourse.trim()) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    try {
        creating.value = true;
        await CourseService.createCourse({
            title: newCourse.value.title.trim(),
            typeCourse: newCourse.value.typeCourse.trim()
        });
        
        // Réinitialiser le formulaire
        newCourse.value = { title: '', typeCourse: '' };
        showCreateModal.value = false;
        
        // Recharger la liste des cours
        await loadCourses();
    } catch (err) {
        console.error('Erreur lors de la création du cours:', err);
        alert('Erreur lors de la création du cours. Veuillez réessayer.');
    } finally {
        creating.value = false;
    }
};

const closeModal = () => {
    showCreateModal.value = false;
    newCourse.value = { title: '', typeCourse: '' };
};

const handleEditCourse = (course: Course) => {
    console.log('Édition du cours:', course);
    editingCourse.value = { ...course };
    showEditModal.value = true;
};

const closeEditModal = () => {
    showEditModal.value = false;
    editingCourse.value = { id: 0, title: '', typeCourse: '', user_id: 0, lessonCount: 0 };
};

const updateCourse = async () => {
    if (!editingCourse.value.title.trim() || !editingCourse.value.typeCourse.trim()) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }

    try {
        updating.value = true;
        await CourseService.updateCourse(editingCourse.value.id, {
            title: editingCourse.value.title.trim(),
            typeCourse: editingCourse.value.typeCourse.trim()
        });
        
        // Réinitialiser le formulaire
        editingCourse.value = { id: 0, title: '', typeCourse: '', user_id: 0, lessonCount: 0 };
        showEditModal.value = false;
        
        // Recharger la liste des cours
        await loadCourses();
    } catch (err) {
        console.error('Erreur lors de la mise à jour du cours:', err);
        alert('Erreur lors de la mise à jour du cours. Veuillez réessayer.');
    } finally {
        updating.value = false;
    }
};

onMounted(() => {
    loadCourses();
});
</script>

<style scoped>
.home-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 20px;
}

h1 {
    margin: 0;
    color: #333;
    text-align: center;
    flex: 1;
}

.create-course-btn {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
}

.create-course-btn:hover {
    background-color: #218838;
}

.create-course-btn span {
    font-size: 20px;
    font-weight: bold;
}

.courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
}

.loading, .error, .no-courses {
    text-align: center;
    padding: 40px;
    color: #666;
}

.error {
    color: #dc3545;
}

.retry-btn, .create-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    margin-top: 10px;
    transition: background-color 0.2s ease;
}

.retry-btn:hover, .create-btn:hover {
    background-color: #0056b3;
}

/* Modal styles */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    padding: 0;
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 20px 0 20px;
    border-bottom: 1px solid #eee;
    margin-bottom: 20px;
}

.modal-header h2 {
    margin: 0;
    color: #333;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #666;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #333;
}

.create-form {
    padding: 0 20px 20px 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: #333;
}

.form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
}

.form-input:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 30px;
}

.cancel-btn {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
}

.cancel-btn:hover {
    background-color: #5a6268;
}

.submit-btn {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.2s ease;
}

.submit-btn:hover:not(:disabled) {
    background-color: #0056b3;
}

.submit-btn:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
    .header-section {
        flex-direction: column;
        align-items: stretch;
    }
    
    .create-course-btn {
        justify-content: center;
    }
    
    .courses-grid {
        grid-template-columns: 1fr;
    }
    
    .home-container {
        padding: 10px;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .modal-content {
        width: 95%;
        margin: 10px;
    }
}
</style>
