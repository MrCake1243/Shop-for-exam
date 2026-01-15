<template>
    <div class="pagination-simple">
        <div class="pagination-info">
            Страница {{ currentPage }} из {{ totalPages }}
        </div>
        
        <div class="pagination-controls">
            <button 
                @click="$emit('prev-page')"
                :disabled="currentPage === 1"
                class="pagination-btn prev"
            >
                ← Назад
            </button>
            
            <div class="page-numbers">
                <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="$emit('page-change', page)"
                    :class="{ active: page === currentPage }"
                    class="page-number"
                >
                    {{ page }}
                </button>
            </div>
            
            <button 
                @click="$emit('next-page')"
                :disabled="currentPage === totalPages"
                class="pagination-btn next"
            >
                Вперед →
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    currentPage: {
        type: Number,
        required: true,
        default: 1
    },
    totalPages: {
        type: Number,
        required: true,
        default: 1
    }
});

const emit = defineEmits(['prev-page', 'next-page', 'page-change']);

const visiblePages = computed(() => {
    const pages = [];
    const start = Math.max(1, props.currentPage - 1);
    const end = Math.min(props.totalPages, props.currentPage + 1);
    
    for (let i = start; i <= end; i++) {
        pages.push(i);
    }
    return pages;
});
</script>

<style scoped>
.pagination-simple {
    margin: 30px 0;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.pagination-info {
    text-align: center;
    margin-bottom: 15px;
    color: #666;
    font-size: 14px;
}

.pagination-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.pagination-btn {
    padding: 8px 16px;
    background: #f8f9fa;
    border: 2px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    min-width: 100px;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-numbers {
    display: flex;
    gap: 8px;
}

.page-number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border: 2px solid #dee2e6;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
}

.page-number:hover {
    border-color: #4CAF50;
    background: #f1f8e9;
}

.page-number.active {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
    .pagination-controls {
        flex-direction: column;
        gap: 15px;
    }
    
    .pagination-btn {
        width: 100%;
        min-width: auto;
    }
    
    .page-numbers {
        order: -1;
    }
}
</style>