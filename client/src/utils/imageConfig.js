export const getProductImage = (product, index = 0) => {
  if (product?.images?.[index]) return product.images[index];
  return `https://images.unsplash.com/photo-1515562141207-7a88fb7071ee?w=800&q=80`;
};

export const heroImage = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=1600&q=80';
export const premiumBanner = 'https://images.unsplash.com/photo-1599643478518-a784e069c662?w=1600&q=80';
export const aboutHero = 'https://images.unsplash.com/photo-1611591431799-11f2980a0c7f?w=1600&q=80';
export const wholesaleHero = 'https://images.unsplash.com/photo-1617032210318-096e6c314904?w=1600&q=80';

export const categoryImages = {
  rings: 'https://images.unsplash.com/photo-1515562141207-7a88fb7071ee?w=600&q=80',
  earrings: 'https://images.unsplash.com/photo-1535632066922-ab7c3ab60908?w=600&q=80',
  necklaces: 'https://images.unsplash.com/photo-1599643478518-a784e069c662?w=600&q=80',
  bracelets: 'https://images.unsplash.com/photo-1611591431799-11f2980a0c7f?w=600&q=80',
  bangles: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80',
  women: 'https://images.unsplash.com/photo-1515562141207-7a88fb7071ee?w=800&q=80',
  men: 'https://images.unsplash.com/photo-1617032210318-096e6c314904?w=800&q=80',
  kids: 'https://images.unsplash.com/photo-1601121143461-0f9fa3697495?w=800&q=80',
};

export const instagramImages = [
  'https://images.unsplash.com/photo-1515562141207-7a88fb7071ee?w=400&q=80',
  'https://images.unsplash.com/photo-1535632066922-ab7c3ab60908?w=400&q=80',
  'https://images.unsplash.com/photo-1599643478518-a784e069c662?w=400&q=80',
  'https://images.unsplash.com/photo-1611591431799-11f2980a0c7f?w=400&q=80',
  'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
  'https://images.unsplash.com/photo-1602751584552-8ba73aad10e2?w=400&q=80',
];
