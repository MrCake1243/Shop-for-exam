<template>
    <div id="app">
        <nav class="navbar">
            <router-link to="/">Магазин</router-link>
            <router-link to="/cart" class="cart-link">
                Корзина
                <span v-if="cartStore.cartItemCount > 0" class="cart-badge">
                    {{ cartStore.cartItemCount }}
                </span>
            </router-link>
        </nav>
        
        <main>
            <router-view />
        </main>
    </div>
</template>

<script setup>
import { useCartStore } from '@/stores/cartStore';

const cartStore = useCartStore();
</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f8f9fa;
}

#app {
    min-height: 100vh;
}

.navbar {
    background: white;
    padding: 20px 40px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar a {
    text-decoration: none;
    color: #333;
    font-weight: 600;
    font-size: 1.1rem;
    padding: 10px 20px;
    border-radius: 6px;
    transition: background 0.3s;
}

.navbar a:hover {
    background: #f0f0f0;
}

.cart-link {
    position: relative;
}

.cart-badge {
    position: absolute;
    top: -8px;
    right: 0;
    background: #e74c3c;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
}

main {
    padding-top: 20px;
}

@media (max-width: 768px) {
    .navbar {
        padding: 15px 20px;
    }
    
    .navbar a {
        padding: 8px 16px;
        font-size: 1rem;
    }
}
</style>