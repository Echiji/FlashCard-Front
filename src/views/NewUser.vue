<template>
<div class="new-user-container">
    <span class="new-user-text">Salut, bienvenue sur notre application de création de leçons.</span>
    <span class="new-user-text">Pour commencer, veuillez vous inscrire ou vous connecter.</span>
    <div class="button-container">
        <button @click="router.push('/login')">Login</button>
        <button @click="router.push('/register')">Register</button>
    </div>
</div>

</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<style scoped>
.new-user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
}

.button-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.button-container button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
}

.button-container button:hover {
    background-color: #0056b3;
}

.new-user-text {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
}


</style>