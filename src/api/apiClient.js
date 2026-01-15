import axios from 'axios';

const BASE_URL = '';

// Создаем экземпляр axios
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    
    params: {
      api_key: '',
    },
});

// Добавляем перехватчик для отладки
apiClient.interceptors.request.use(
    (config) => {
        console.log('Запрос:', config.url, config.params);
        return config;
    },
    (error) => {
        console.error('Ошибка запроса:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        console.log('Ответ:', response.data);
        return response;
    },
    (error) => {
        console.error('Ошибка ответа:', error);
        return Promise.reject(error);
    }
);

export const productApi = {
    async getProducts(page = 1, limit = 20, categoryId = null) {
        const params = { page, limit };
        if (categoryId) params.category_id = categoryId;
        const response = await apiClient.get('/product', { params });
        return response.data;
    },

    async getCategories() {
        const response = await apiClient.get('/category');
        return response.data;
    },

    async getProductById(id) {
        const response = await apiClient.get(`/product/${id}`);
        return response.data;
    },
    
};