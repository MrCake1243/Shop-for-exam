<template>
    <div class="product-card" @click="$emit('click', product)">
        <div class="product-image">
            <img 
                :src="getProductImage(product)" 
                :alt="product.name"
                loading="lazy"
                @error="handleImageError"
            />
        </div>
        
        <div class="product-info">
            <h3>{{ product.name }}</h3>
            <div class="category">Категория: {{ product.category_name || product.category_id }}</div>
            <div class="rating">⭐ {{ (product.rating || 0).toFixed(1) }}</div>
            <div class="price">{{ product.price || 0 }} ₽</div>
            <button @click.stop="addToCart" class="cart-btn">
                В корзину
            </button>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';
import { image_url } from '@/views/HomeView.vue';
import imageFallback from '@/utils/imageFallback'; 
const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

const cartStore = useCartStore();

const getFallbackImage = () => {
    const colors = ['4CAF50', '2196F3', 'FF9800', 'E91E63', '9C27B0'];
    const color = colors[props.product.id % colors.length];
    return `https://via.placeholder.com/300x300/${color}/fff?text=Товар+${props.product.id}`;
};

const handleImageError = (event) => {
    // При ошибке загрузки используем SVG заглушку
    event.target.src = imageFallback.generateSVG(product, 300, 300);
};

const addToCart = () => {
    cartStore.addToCart(props.product);
};

const getProductImage = (product) => {
    return imageFallback.getImageUrl(product);
};
</script>

<style scoped>
.product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.1);
    cursor: pointer;
    transition: transform 0.2s;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.product-image {
    height: 200px;
    overflow: hidden;
    background: #f5f5f5;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-info h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: #333;
    line-height: 1.4;
    flex: 1;
}

.category {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-block;
}

.rating {
    color: #ff9800;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 14px;
}

.price {
    font-size: 20px;
    font-weight: bold;
    color: #e53935;
    margin-bottom: 15px;
}

.cart-btn {
    margin-top: auto;
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background 0.2s;
}

.cart-btn:hover {
    background: #388E3C;
}
</style>