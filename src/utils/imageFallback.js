// Локальные заглушки для изображений (без внешних запросов)
export const imageFallback = {
    // Генерация SVG изображения
    generateSVG(product, width = 300, height = 300) {
        const colors = {
            
            'default': '#607D8B'
        };
        
        const category = 'default';
        const color = colors.default;
        
        // Короткий текст
        const text = this.getShortText(product);
        
        // Создаем SVG
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="${color}" />
                <rect x="5%" y="5%" width="90%" height="90%" fill="${this.lightenColor(color, 20)}" 
                      rx="10" ry="10" stroke="${color}" stroke-width="2" />
                <text x="50%" y="45%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" 
                      font-size="${width / 10}" font-weight="bold">
                    ${text.line1}
                </text>
                <text x="50%" y="65%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" 
                      font-size="${width / 15}">
                    ID: ${product.id}
                </text>
                <text x="50%" y="85%" text-anchor="middle" fill="white" font-family="Arial, sans-serif" 
                      font-size="${width / 20}" opacity="0.8">
                    ${category.substring(0, 12)}
                </text>
            </svg>
        `.trim();
        
        // Конвертируем в Data URL
        return 'data:image/svg+xml;base64,' + btoa(svg);
    },
    
    // Осветление цвета
    lightenColor(color, percent) {
        let r = parseInt(color.slice(1, 3), 16);
        let g = parseInt(color.slice(3, 5), 16);
        let b = parseInt(color.slice(5, 7), 16);
        
        r = Math.min(255, r + (255 - r) * percent / 100);
        g = Math.min(255, g + (255 - g) * percent / 100);
        b = Math.min(255, b + (255 - b) * percent / 100);
        
        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    },
    
    // Получение короткого текста
    getShortText(product) {
        if (!product.name) {
            return { line1: `Товар ${product.id}`, line2: '' };
        }
        
        const words = product.name.split(' ');
        if (words.length >= 2) {
            // Берем первое и последнее слово
            return { 
                line1: words[0].substring(0, 8), 
                line2: words[words.length - 1].substring(0, 8) 
            };
        } else {
            // Делим длинное слово пополам
            const name = product.name;
            const half = Math.floor(name.length / 2);
            return {
                line1: name.substring(0, Math.min(8, half)),
                line2: name.substring(half, Math.min(16, half + 8))
            };
        }
    },
    
    // Простой цветной фон
    generateColorBackground(product) {
        const colors = {
          
            'default': '#607D8B'
        };
        
        const category = 'default';
        return colors[category] || colors.default;
    },
    
    // Получить изображение (пробует API, потом заглушку)
    getImageUrl(product) {
        // Сначала пробуем URL из API
        if (product.image_url && product.image_url.startsWith('http')) {
            return product.image_url;
        
        }
        
        // Или другие поля с изображением
        const possibleFields = ['image', 'img', 'photo', 'picture', 'thumbnail'];
        for (const field of possibleFields) {
            if (product[field] && product[field].startsWith('http')) {
                return product[field];
            }
        }
        
        // Если нет изображения, используем SVG заглушку
        return this.generateSVG(product);
    }
};

export default imageFallback;