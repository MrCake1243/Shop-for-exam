<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <!-- Кнопка закрытия -->
            <button class="close-btn" @click="$emit('close')">×</button>
            
            <!-- Изображение товара -->
            <div class="product-image">
            <img 
                :src="getProductImage()" 
                :alt="product.name"
                @error="handleImageError"
            />
            </div>
            
            <!-- Информация о товаре -->
            <div class="product-details">
                <h2 class="product-title">{{ product.name }}</h2>
                
                <div class="product-meta">
                    <span class="category">{{ product.category_name || 'Без категории' }}</span>
                    <div class="rating">
                        ⭐ {{ (product.rating || 0).toFixed(1) }}
                        <span class="rating-count">({{ product.rating_count || 0 }})</span>
                    </div>
                </div>
                
                <div class="price">{{ product.price || 0 }} ₽</div>
                
                <div class="description" v-if="product.description">
                    <h3>Описание</h3>
                    <p>{{ product.description }}</p>
                </div>
                
                <!-- Кнопки действий -->
                <div class="action-buttons">
                    <button @click="addToCart" class="add-to-cart">
                        Добавить в корзину
                    </button>
                    <button @click="$emit('close')" class="close-modal">
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import imageFallback from '@/utils/imageFallback';
// Импортируем SVG заглушку
import withoutPhoto from '@/assets/withoutPhoto.svg';
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});



const emit = defineEmits(['close']);

const cartStore = useCartStore();
const imageError = ref(false);

const getFallbackImage = () => {
    const colors = ['4CAF50', '2196F3', 'FF9800', 'E91E63', '9C27B0'];
    const color = colors[props.product.id % colors.length];
    
    const categoryCode = props.product.category_name 
        ? props.product.category_name.substring(0, 2).toUpperCase()
        : 'PR';
    
    return `https://via.placeholder.com/400x400/${color}/fff?text=${categoryCode}${props.product.id}`;
};

const getProductImage = () => {
    if (imageError.value) {
        return withoutPhoto;
    }
    
    // Пробуем разные поля с изображением
    const imageFields = ['image_url', 'image', 'img', 'photo', 'picture', 'thumbnail'];
    
    for (const field of imageFields) {
        if (props.product[field] && props.product[field].trim() !== '') {
            const url = props.product[field].trim();
            
            if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) {
                if (url.startsWith('/')) {
                    return `https://nti.urfu.ru${url}`;
                }
                return url;
            }
        }
    }
    
    // Если изображение не найдено, используем SVG заглушку
    return withoutPhoto;
};

const handleImageError = (event) => {
    imageError.value = true;
    event.target.src = getFallbackImage();
};

const addToCart = () => {
    cartStore.addToCart(props.product);
    emit('close');
};
</script>

<style scoped>
/* Оверлей */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* Контент модального окна */
.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Кнопка закрытия */
.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    width: 40px;
    height: 40px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 50%;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.close-btn:hover {
    background: #f5f5f5;
    transform: scale(1.1);
}

/* Изображение товара */
.product-image {
    padding: 30px;
    text-align: center;
    background: #f8f9fa;
    border-bottom: 1px solid #eee;
}

.product-image img {
    max-width: 100%;
    max-height: 300px;
    object-fit: contain;
    border-radius: 10px;
}

/* Детали товара */
.product-details {
    padding: 30px;
}

.product-title {
    margin: 0 0 15px 0;
    font-size: 24px;
    color: #333;
    line-height: 1.3;
}

.product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.category {
    background: #e3f2fd;
    color: #1976d2;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
}

.rating {
    color: #ff9800;
    font-weight: 600;
    font-size: 18px;
}

.rating-count {
    color: #666;
    font-size: 14px;
    font-weight: normal;
    margin-left: 5px;
}

.price {
    font-size: 32px;
    font-weight: 700;
    color: #e53935;
    margin: 20px 0;
}

.description {
    margin: 25px 0;
    padding: 20px;
    background: #f9f9f9;
    border-radius: 10px;
}

.description h3 {
    margin: 0 0 10px 0;
    color: #555;
    font-size: 18px;
}

.description p {
    margin: 0;
    line-height: 1.6;
    color: #666;
}

/* Кнопки действий */
.action-buttons {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.add-to-cart {
    flex: 1;
    background: #4CAF50;
    color: white;
    border: none;
    padding: 16px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s;
}

.add-to-cart:hover {
    background: #388E3C;
}

.close-modal {
    flex: 0 0 120px;
    background: white;
    color: #666;
    border: 2px solid #ddd;
    padding: 16px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.close-modal:hover {
    background: #f5f5f5;
    border-color: #999;
}

/* Мобильная адаптация */
@media (max-width: 768px) {
    .modal-overlay {
        padding: 10px;
        align-items: flex-end;
    }
    
    .modal-content {
        max-height: 85vh;
        border-radius: 16px 16px 0 0;
    }
    
    .product-image {
        padding: 20px;
    }
    
    .product-image img {
        max-height: 250px;
    }
    
    .product-details {
        padding: 20px;
    }
    
    .product-title {
        font-size: 20px;
        padding-right: 40px; /* Для кнопки закрытия */
    }
    
    .product-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .close-btn {
        top: 10px;
        right: 10px;
        width: 36px;
        height: 36px;
        font-size: 20px;
    }
}

@media (max-width: 480px) {
    .product-title {
        font-size: 18px;
    }
    
    .price {
        font-size: 28px;
    }
    
    .action-buttons button {
        padding: 14px;
        font-size: 15px;
    }
}
</style>