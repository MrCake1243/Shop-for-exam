<template>
    <div class="home-view">
        
        
        <!-- Фильтры категорий -->
        <div class="filters-section">
            <h3>Категории:</h3>
            <div class="categories-scroll">
                <button 
                    @click="productStore.resetFilter()"
                    :class="{ active: !productStore.selectedCategoryId }"
                    class="filter-btn all"
                >
                    Все товары
                </button>
                
                <button 
                    v-for="category in productStore.categories" 
                    :key="category.id"
                    @click="productStore.setCategory(category.id)"
                    :class="{ active: productStore.selectedCategoryId === category.id }"
                    class="filter-btn"
                >
                    {{ category.name }}
                </button>
            </div>
            
            <!-- Информация о фильтре -->
            <div v-if="productStore.selectedCategoryId" class="filter-info">
                <span class="filter-text">
                    Категория: {{ getCategoryName(productStore.selectedCategoryId) }}
                </span>
                <button @click="productStore.resetFilter()" class="clear-filter">
                    ✕ Сбросить
                </button>
            </div>
        </div>
        
        <!-- Основной контент -->
        <div class="main-content">
            <!-- Загрузка -->
            <div v-if="productStore.isLoading" class="loading-state">
                <div class="spinner"></div>
                <p>Загрузка товаров...</p>
            </div>
            
            <!-- Сообщение об ошибке -->
            <div v-else-if="error" class="error-state">
                ❌ {{ error }}
                <button @click="loadProducts" class="retry-btn">Повторить</button>
            </div>
            
            <!-- Нет товаров -->
            <div v-else-if="productStore.products.length === 0" class="empty-state">
                <div class="empty-icon">😔</div>
                <h3>Товары не найдены</h3>
                <p v-if="productStore.selectedCategoryId">
                    В категории "{{ getCategoryName(productStore.selectedCategoryId) }}" товаров нет
                </p>
                <button @click="productStore.resetFilter()" class="show-all-btn">
                    Показать все товары
                </button>
            </div>
            
            <!-- Сетка товаров -->
            <div v-else class="products-section">
                <!-- Информация о товарах -->
                <div class="products-info">
                    <span class="count-info">
                        Показано {{ productStore.products.length }} товаров
                        <span v-if="productStore.selectedCategoryId">
                            в категории "{{ getCategoryName(productStore.selectedCategoryId) }}"
                        </span>
                    </span>
                </div>
                
                <!-- Сетка товаров -->
                <div class="products-grid">
                    <div 
                        v-for="product in productStore.products" 
                        :key="product.id"
                        class="product-card"
                        @click="openProductModal(product)"
                    >
                        <div class="product-image">
                            <img 
                                :src="getProductImage(product)" 
                                :alt="product.name"
                                loading="lazy"
                                @error="handleImageError($event, product)"
                            />
                        </div>
                        <div class="product-content">
                            <h3 class="product-title">{{ product.name }}</h3>
                            <div class="product-meta">
                                <span class="product-category">
                                    {{ product.category_name || 'Без категории' }}
                                </span>
                                <span class="product-rating">
                                    ⭐ {{ (product.rating || 0).toFixed(1) }}
                                </span>
                            </div>
                            <div class="product-price">{{ product.price || 0 }} ₽</div>
                            <button 
                                @click.stop="addToCart(product)"
                                class="add-to-cart"
                            >
                                В корзину
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Пагинация -->
                <PaginationFixed
                    v-if="productStore.totalPages > 1"
                    :current-page="productStore.currentPage"
                    :total-pages="productStore.totalPages"
                    @prev-page="prevPage"
                    @next-page="nextPage"
                    @page-change="productStore.setPage"
                />
            </div>
        </div>
        
        <!-- Модальное окно товара -->
        <ProductModalFixed
            v-if="selectedProduct"
            :product="selectedProduct"
            @close="closeModal"
        />
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useProductStore } from '@/stores/productStore';
import { useCartStore } from '@/stores/cartStore';
import PaginationFixed from '@/components/PaginationBar.vue';
import ProductModalFixed from '@/components/ProductModal.vue';
import imageFallback from '@/utils/imageFallback';
// Импортируем SVG заглушку
import withoutPhoto from '@/assets/withoutPhoto.svg';
const productStore = useProductStore();
const cartStore = useCartStore();

const selectedProduct = ref(null);
const error = ref(null);

// Получить название категории
const getCategoryName = (categoryId) => {
    const category = productStore.categories.find(c => c.id === categoryId);
    return category ? category.name : `Категория ${categoryId}`;
};
const imageErrors = ref({});
// Заглушка для изображения
const getFallbackImage = (product) => {
    const colors = ['4CAF50', '2196F3', 'FF9800', 'E91E63', '9C27B0'];
    const color = colors[product.id % colors.length];
    return `https://via.placeholder.com/300x300/${color}/fff?text=${encodeURIComponent(product.name.substring(0, 15))}`;
};
const getProductImage = (product) => {
    // Если уже была ошибка загрузки, показываем заглушку
    if (imageErrors.value[product.id]) {
        return withoutPhoto;
    }
    
    // Пробуем разные поля с изображением
    const imageFields = ['image_url', 'image', 'img', 'photo', 'picture', 'thumbnail'];
    
    for (const field of imageFields) {
        if (product[field] && product[field].trim() !== '') {
            const url = product[field].trim();
            
            // Проверяем, что это валидный URL
            if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) {
                // Если относительный путь, добавляем базовый URL
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
// Навигация по страницам
const prevPage = () => {
    if (productStore.currentPage > 1) {
        productStore.setPage(productStore.currentPage - 1);
        scrollToTop();
    }
};

const nextPage = () => {
    if (productStore.currentPage < productStore.totalPages) {
        productStore.setPage(productStore.currentPage + 1);
        scrollToTop();
    }
};

const handleImageError = (event) => {
    // При ошибке загрузки используем SVG заглушку
    event.target.src = imageFallback.generateSVG(product, 300, 300);
};
// Прокрутка к верху при смене страницы
const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Открыть модальное окно
const openProductModal = (product) => {
    selectedProduct.value = product;
    document.body.style.overflow = 'hidden';
};

// Закрыть модальное окно
const closeModal = () => {
    selectedProduct.value = null;
    document.body.style.overflow = 'auto';
};

// Добавить в корзину
const addToCart = (product) => {
    cartStore.addToCart(product);
    
    // Визуальный фидбэк
    const event = new CustomEvent('cart-add', { detail: product });
    window.dispatchEvent(event);
};

// Загрузка товаров
const loadProducts = async () => {
    error.value = null;
    try {
        await productStore.fetchProducts();
    } catch (err) {
        error.value = 'Ошибка загрузки товаров';
        console.error(err);
    }
};

// Наблюдаем за ошибками загрузки
watch(() => productStore.products, (newProducts) => {
    if (newProducts.length === 0 && !productStore.isLoading) {
        error.value = 'Товары не найдены';
    }
});

onMounted(async () => {
    try {
        await productStore.init();
    } catch (err) {
        error.value = 'Ошибка инициализации';
        console.error(err);
    }
});
</script>

<style scoped>
.home-view {
    min-height: 100vh;
    background: #f8f9fa;
    padding-bottom: 40px;
}

/* Шапка */
.header {
    background: white;
    padding: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    position: sticky;
    top: 0;
    z-index: 100;
}

.header h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
}

.cart-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: #333;
    font-weight: 600;
    padding: 10px 20px;
    background: #f8f9fa;
    border-radius: 8px;
    transition: background 0.2s;
}

.cart-link:hover {
    background: #e9ecef;
}

.cart-count {
    background: #e53935;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
    min-width: 24px;
    text-align: center;
}

/* Фильтры */
.filters-section {
    background: white;
    padding: 20px;
    margin: 0 20px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filters-section h3 {
    margin: 0 0 15px 0;
    color: #555;
    font-size: 18px;
}

.categories-scroll {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 15px;
    margin-bottom: 15px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;
}

.categories-scroll::-webkit-scrollbar {
    height: 6px;
}

.categories-scroll::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
}

.filter-btn {
    padding: 10px 20px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 25px;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    flex-shrink: 0;
    transition: all 0.2s;
}

.filter-btn:hover {
    border-color: #4CAF50;
    background: #f1f8e9;
}

.filter-btn.active {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
}

.filter-btn.all {
    font-weight: 600;
}

.filter-info {
    padding: 12px 16px;
    background: #e8f5e9;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-left: 4px solid #4CAF50;
}

.filter-text {
    font-weight: 500;
    color: #2e7d32;
}

.clear-filter {
    background: #f44336;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
}

/* Основной контент */
.main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Состояния */
.loading-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.error-state {
    background: #ffebee;
    color: #c62828;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.retry-btn {
    background: #c62828;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.empty-icon {
    font-size: 60px;
    margin-bottom: 20px;
}

.empty-state h3 {
    color: #666;
    margin-bottom: 10px;
}

.empty-state p {
    color: #999;
    margin-bottom: 25px;
}

.show-all-btn {
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 16px;
}

/* Сетка товаров */
.products-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.products-info {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #eee;
}

.count-info {
    color: #666;
    font-size: 14px;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

/* Карточка товара */
.product-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    cursor: pointer;
    transition: all 0.3s;
    border: 1px solid #eee;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    border-color: #4CAF50;
}

.product-image {
    height: 200px;
    overflow: hidden;
    background: #f5f5f5;
    position: relative;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.product-card:hover .product-image img {
    transform: scale(1.05);
}

.product-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-title {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: #333;
    line-height: 1.4;
    flex: 1;
    display: -webkit-box;

    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
}

.product-category {
    font-size: 12px;
    color: #666;
    background: #f0f0f0;
    padding: 4px 10px;
    border-radius: 12px;
}

.product-rating {
    color: #ff9800;
    font-weight: 600;
    font-size: 14px;
}

.product-price {
    font-size: 22px;
    font-weight: bold;
    color: #e53935;
    margin-bottom: 15px;
}

.add-to-cart {
    margin-top: auto;
    background: #4CAF50;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: background 0.2s;
    width: 100%;
}

.add-to-cart:hover {
    background: #388E3C;
}

/* Адаптивность */
@media (max-width: 768px) {
    .header {
        padding: 15px;
        margin-bottom: 15px;
    }
    
    .header h1 {
        font-size: 20px;
    }
    
    .filters-section {
        margin: 0 15px 15px;
        padding: 15px;
    }
    
    .main-content {
        padding: 0 15px;
    }
    
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 15px;
    }
    
    .product-image {
        height: 180px;
    }
    
    .product-content {
        padding: 15px;
    }
    
    .product-title {
        font-size: 15px;
    }
    
    .product-price {
        font-size: 20px;
    }
    
    .add-to-cart {
        padding: 10px;
        font-size: 13px;
    }
}

@media (max-width: 480px) {
    .products-grid {
        grid-template-columns: 1fr;
    }
    
    .filters-section {
        margin: 0 10px 15px;
        padding: 12px;
    }
    
    .filter-btn {
        padding: 8px 16px;
        font-size: 13px;
    }
    
    .cart-link {
        padding: 8px 12px;
        font-size: 14px;
    }
    
    .header h1 {
        font-size: 18px;
    }
}
</style>