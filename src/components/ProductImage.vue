<template>
    <div class="product-image">
        <!-- Основное изображение -->
        <img 
            v-if="showApiImage"
            :src="imageUrl"
            :alt="alt"
            @load="handleLoad"
            @error="handleError"
            class="api-image"
        />
        
        <!-- Локальная заглушка -->
        <img 
            v-else
            :src="withoutPhoto"
            :alt="alt"
            class="fallback-image"
        />
        
        <!-- Индикатор загрузки -->
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Импортируем локальное изображение
import withoutPhoto from '@/assets/images/without-photo.png';

const props = defineProps({
    imageUrl: {
        type: String,
        default: ''
    },
    alt: {
        type: String,
        default: 'Product image'
    }
});

// Состояние
const showApiImage = ref(true);
const isLoading = ref(true);
const hasError = ref(false);
const loadTimer = ref(null);

// Таймаут загрузки (4 секунды)
const LOAD_TIMEOUT = 4000;

// Обработчики событий
const handleLoad = () => {
    clearTimeout(loadTimer.value);
    isLoading.value = false;
    hasError.value = false;
    console.log('Изображение загружено успешно');
};

const handleError = () => {
    clearTimeout(loadTimer.value);
    isLoading.value = false;
    hasError.value = true;
    showApiImage.value = false;
    console.log('Ошибка загрузки изображения, показываем заглушку');
};

// Запуск таймаута
const startLoadTimer = () => {
    if (loadTimer.value) clearTimeout(loadTimer.value);
    
    loadTimer.value = setTimeout(() => {
        if (isLoading.value) {
            console.log('Таймаут загрузки изображения');
            isLoading.value = false;
            hasError.value = true;
            showApiImage.value = false;
        }
    }, LOAD_TIMEOUT);
};

// Сброс состояния при изменении URL
watch(() => props.imageUrl, (newUrl) => {
    if (newUrl) {
        showApiImage.value = true;
        isLoading.value = true;
        hasError.value = false;
        startLoadTimer();
    } else {
        // Если URL пустой, сразу показываем заглушку
        showApiImage.value = false;
        isLoading.value = false;
        hasError.value = true;
    }
});

onMounted(() => {
    if (props.imageUrl) {
        startLoadTimer();
    } else {
        // Если нет URL, сразу показываем заглушку
        showApiImage.value = false;
        isLoading.value = false;
    }
});

onUnmounted(() => {
    if (loadTimer.value) {
        clearTimeout(loadTimer.value);
    }
});
</script>

<style scoped>
.product-image {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    border-radius: 8px;
    background: #f5f5f5;
}

.api-image, .fallback-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s;
}

.api-image {
    opacity: 0;
}

.api-image.loaded {
    opacity: 1;
}

.fallback-image {
    opacity: 1;
    padding: 20px;
    object-fit: contain;
}

/* Индикатор загрузки */
.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>