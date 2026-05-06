import { Product } from '../types';

const categories = ['Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'];

const adjectives = ['Premium', 'Pro', 'Ultra', 'Ultimate', 'Smart', 'Elegant', 'Modern', 'Classic', 'Luxury', 'Eco'];
const nouns = {
  Electronics: ['Smartphone', 'Laptop', 'Headphones', 'Camera', 'Watch', 'Tablet', 'Speaker', 'Monitor', 'Keyboard', 'Drone'],
  Fashion: ['Jacket', 'T-Shirt', 'Sneakers', 'Handbag', 'Jeans', 'Scarf', 'Sunglasses', 'Belt', 'Dress', 'Boots'],
  'Home & Living': ['Lamp', 'Rug', 'Vase', 'Chair', 'Table', 'Clock', 'Mirrors', 'Planter', 'Storage Box', 'Blender'],
  Beauty: ['Serum', 'Lipstick', 'Perfume', 'Pallete', 'Moisturizer', 'Cleanser', 'Mascara', 'Sunscreen', 'Hair Oil', 'Face Mask'],
  Sports: ['Yoga Mat', 'Dumbbells', 'Ball', 'Racket', 'Bicycle', 'Goggles', 'Backpack', 'Bottle', 'Gloves', 'Jersey']
};

const generateImage = (category: string, id: number) => {
  const query = category.toLowerCase().replace(' & ', '-');
  return `https://picsum.photos/seed/nexstore-${query}-${id}/400/400`;
};

export const MOCK_PRODUCTS: Product[] = Array.from({ length: 160 }).map((_, i) => {
  const category = categories[i % categories.length];
  const nounList = nouns[category as keyof typeof nouns];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nounList[Math.floor(Math.random() * nounList.length)];
  
  return {
    id: `prod-${i + 1}`,
    name: `${adjective} ${noun} ${i + 1}`,
    price: Math.floor(Math.random() * 950) + 50,
    description: `This is high-quality ${noun.toLowerCase()} from our ${adjective.toLowerCase()} collection. Perfect for your daily needs.`,
    category,
    image: generateImage(category, i),
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    isOffer: Math.random() > 0.8
  };
});
