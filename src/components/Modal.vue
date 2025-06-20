<template>
  <div v-if="isOpen" class="modal-overlay" @click="closeOnOverlayClick && close()">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ title }}</h3>
        <button class="close-button" @click="close">&times;</button>
      </div>
      <div class="modal-body">
        <slot></slot>
      </div>
      <div class="modal-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<style scoped>
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
  padding: var(--spacing-md);
}

.modal-content {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-lg);
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-xl);
  color: var(--secondary-color);
  font-weight: 600;
  flex: 1;
}

.close-button {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  cursor: pointer;
  color: var(--gray);
  padding: var(--spacing-xs);
  line-height: 1;
  transition: color var(--transition-fast);
  border-radius: var(--border-radius-sm);
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: var(--secondary-color);
  background-color: var(--light-gray);
}

.modal-body {
  margin-bottom: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

/* Media queries */
@media (max-width: 768px) {
  .modal-overlay {
    padding: var(--spacing-sm);
  }

  .modal-content {
    padding: var(--spacing-lg);
    max-width: 100%;
    margin: var(--spacing-sm);
  }

  .modal-header h3 {
    font-size: var(--font-size-lg);
  }

  .close-button {
    font-size: var(--font-size-xl);
    min-width: 28px;
    min-height: 28px;
  }

  .modal-footer {
    justify-content: center;
  }

  .modal-footer .btn {
    width: 100%;
    max-width: 200px;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: var(--spacing-xs);
  }

  .modal-content {
    padding: var(--spacing-md);
    margin: 0;
  }

  .modal-header {
    margin-bottom: var(--spacing-md);
  }

  .modal-header h3 {
    font-size: var(--font-size-base);
  }

  .modal-body {
    margin-bottom: var(--spacing-md);
  }

  .modal-footer {
    gap: var(--spacing-sm);
  }
}

@media (min-width: 1024px) {
  .modal-content {
    max-width: 600px;
  }
}
</style> 