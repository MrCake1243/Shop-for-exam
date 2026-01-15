import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
    const cartItems = ref(JSON.parse(localStorage.getItem('cart')) || []);

    // Сохранение в localStorage при изменении
    const saveToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(cartItems.value));
    };

    // Добавление товара в корзину
    const addToCart = (product) => {
        const existingItem = cartItems.value.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.value.push({ ...product, quantity: 1 });
        }
        saveToLocalStorage();
    };

    // Удаление товара из корзины
    const removeFromCart = (productId) => {
        cartItems.value = cartItems.value.filter(item => item.id !== productId);
        saveToLocalStorage();
    };

    // Изменение количества товара
    const updateQuantity = (productId, quantity) => {
        const item = cartItems.value.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            saveToLocalStorage();
        }
    };

    // Вычисляемые свойства
    const cartTotal = computed(() => {
        return cartItems.value.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    });

    const cartItemCount = computed(() => {
        return cartItems.value.reduce((count, item) => count + item.quantity, 0);
    });

    return {
        cartItems,
        cartTotal,
        cartItemCount,
        addToCart,
        removeFromCart,
        updateQuantity
    };
});