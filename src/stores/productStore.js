import { defineStore } from 'pinia';
import { ref } from 'vue';
import { productApi } from '@/api/apiClient';

export const useProductStore = defineStore('product', () => {
    const products = ref([]);
    const categories = ref([]);
    const selectedCategoryId = ref(null);
    const currentPage = ref(1);
    const totalPages = ref(1);
    const isLoading = ref(false);
    const error = ref(null);

    // Загрузка товаров
    const fetchProducts = async () => {
        isLoading.value = true;
        error.value = null;
        
        try {
            const data = await productApi.getProducts(
                currentPage.value,
                12,
                selectedCategoryId.value
            );
            
            // Простая обработка ответа
            if (data) {
                products.value = data.items || data.products || data || [];
                totalPages.value = data.total_pages || 1;
            } else {
                products.value = [];
                totalPages.value = 1;
            }
            
            console.log('Товаров загружено:', products.value.length);
            
        } catch (err) {
            error.value = 'Ошибка загрузки товаров';
            console.error('Ошибка fetchProducts:', err);
            products.value = [];
        } finally {
            isLoading.value = false;
        }
    };

    // Загрузка категорий
    const fetchCategories = async () => {
        try {
            const data = await productApi.getCategories();
            
            if (data && data.categories) {
                categories.value = data.categories;
            } else if (data && Array.isArray(data)) {
                categories.value = data;
            } else {
                categories.value = [];
            }
        } catch (err) {
            console.error('Ошибка fetchCategories:', err);
            categories.value = [];
        }
    };

    // Установить категорию
    const setCategory = (categoryId) => {
        selectedCategoryId.value = categoryId;
        currentPage.value = 1;
        fetchProducts();
    };

    // Сбросить фильтр
    const resetFilter = () => {
        selectedCategoryId.value = null;
        currentPage.value = 1;
        fetchProducts();
    };

    // Сменить страницу
    const setPage = (page) => {
        currentPage.value = page;
        fetchProducts();
    };

    // Инициализация
    const init = async () => {
        await fetchCategories();
        await fetchProducts();
    };

    return {
        products,
        categories,
        selectedCategoryId,
        currentPage,
        totalPages,
        isLoading,
        error,
        fetchProducts,
        fetchCategories,
        setCategory,
        resetFilter,
        setPage,
        init
    };
});