<template>
    <div class="cart-view">
        <h1>Корзина</h1>
        
        <div v-if="cartStore.cartItems.length === 0" class="empty-cart">
            Корзина пуста
        </div>
        
        <div v-else class="cart-items">
            <div class="cart-item" v-for="item in cartStore.cartItems" :key="item.id">
                <img :src="item.image_url" :alt="item.name" />
                
                <div class="item-info">
                    <h3>{{ item.name }}</h3>
                    <span class="category">{{ item.category_name }}</span>
                </div>
                
                <div class="quantity-controls">
                    <button 
                        @click="updateQuantity(item.id, item.quantity - 1)"
                        :disabled="item.quantity <= 1"
                    >
                        -
                    </button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, item.quantity + 1)">
                        +
                    </button>
                </div>
                
                <div class="item-price">
                    {{ item.price * item.quantity }} ₽
                </div>
                
                <button 
                    @click="removeItem(item.id)"
                    class="remove-btn"
                >
                    ×
                </button>
            </div>
            
            <div class="cart-summary">
                <div class="summary-row">
                    <span>Итого:</span>
                    <span class="total-price">{{ cartStore.cartTotal }} ₽</span>
                </div>
                <button class="checkout-btn">
                    Оформить заказ
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();

const updateQuantity = (productId, quantity) => {
    cartStore.updateQuantity(productId, quantity);
};

const removeItem = (productId) => {
    cartStore.removeFromCart(productId);
};
</script>

<style scoped>
.cart-view {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

h1 {
    margin-bottom: 32px;
    color: #2c3e50;
}

.empty-cart {
    text-align: center;
    padding: 60px;
    color: #777;
    font-size: 1.2rem;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.cart-item {
    display: grid;
    grid-template-columns: 100px 2fr auto 1fr auto;
    align-items: center;
    gap: 24px;
    padding: 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
}

.cart-item img {
    width: 100px;
    height: 100px;
    object-fit: contain;
    border-radius: 8px;
}

.item-info h3 {
    margin: 0 0 8px 0;
    color: #333;
}

.category {
    background: #f0f0f0;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 0.9rem;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 12px;
}

.quantity-controls button {
    width: 36px;
    height: 36px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
}

.quantity-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.quantity-controls span {
    min-width: 40px;
    text-align: center;
    font-weight: 600;
}

.item-price {
    font-size: 1.3rem;
    font-weight: 700;
    color: #e74c3c;
    text-align: right;
}

.remove-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: #ff4757;
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.5rem;
}

.cart-summary {
    margin-top: 32px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 1.2rem;
}

.total-price {
    font-size: 2rem;
    font-weight: 700;
    color: #e74c3c;
}

.checkout-btn {
    width: 100%;
    padding: 18px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.2rem;
    cursor: pointer;
}

@media (max-width: 768px) {
    .cart-view {
        padding: 16px;
    }

    .cart-item {
        grid-template-columns: 80px 1fr;
        grid-template-rows: auto auto auto;
        gap: 12px;
    }

    .cart-item img {
        width: 80px;
        height: 80px;
    }

    .quantity-controls {
        grid-column: 1;
        grid-row: 3;
        justify-self: start;
    }

    .item-price {
        grid-column: 2;
        grid-row: 2;
        text-align: right;
    }

    .remove-btn {
        grid-column: 2;
        grid-row: 3;
        justify-self: end;
    }
}
</style>