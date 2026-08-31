import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import SEOHead from '../components/SEOHead';
import HeroBanner, { ProductCarousel, CategoryCard } from '../components/HeroBanner';
import ProductGrid from '../components/ProductGrid';
import { brand, categoryIcons, occasions, whyChooseUs } from '../utils/brandConfig';
import { heroImage, premiumBanner, categoryImages, instagramImages } from '../utils/imageConfig';
import { Star } from 'lucide-react';

export default function HomePage() {
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  useEffect(() => {
    api.get('/products?featured=true&limit=8').then(({ data }) => setTrending(data.products)).catch(() => {});
    api.get('/products?newArrival=true&limit=8').then(({ data }) => setNewArrivals(data.products)).catch(() => {});
    api.get('/products?bestSeller=true&limit=8').then(({ data }) => setBestSellers(data.products)).catch(() => {});
  }, []);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: brand.name,
    url: 'https://aurumgrove.com',
    potentialAction: { '@type': 'SearchAction', target: 'https://aurumgrove.com/search?q={search_term_string}', 'query-input': 'required name=search_term_string' },
  };

  return (
    <>
      <SEOHead title="Premium Jewellery Online" description={brand.tagline} path="/" schema={schema} />

      <HeroBanner title={brand.tagline} subtitle="Discover handcrafted gold and diamond jewellery for every moment." image={heroImage} />

      {/* Category Icons */}
      <section className="py-12 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-4">
            {categoryIcons.map((cat) => (
              <Link key={cat.slug} to={`/shop/${cat.slug}`} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-2xl group-hover:shadow-md group-hover:scale-105 transition-all">
                  {cat.icon}
                </div>
                <span className="text-xs text-center font-medium group-hover:text-gold transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-10">Shop By Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['rings', 'earrings', 'necklaces', 'bracelets', 'bangles'].map((slug) => (
            <CategoryCard key={slug} name={slug.charAt(0).toUpperCase() + slug.slice(1)} slug={slug} image={categoryImages[slug]} />
          ))}
        </div>
      </section>

      <ProductCarousel products={trending} title="Trending Now" />

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl mb-8">New Arrivals</h2>
        <ProductGrid products={newArrivals} />
        <div className="text-center mt-8">
          <Link to="/shop?sort=newest" className="text-gold-dark font-medium hover:underline">View All New Arrivals →</Link>
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-cream rounded-2xl mx-4">
        <h2 className="font-display text-3xl mb-8 text-center">Best Sellers</h2>
        <ProductGrid products={bestSellers} />
      </section>

      {/* Shop For */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-10">Shop For</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: 'Women', slug: 'women-jewellery', image: categoryImages.women },
            { name: 'Men', slug: 'men-jewellery', image: categoryImages.men },
            { name: 'Kids', slug: 'kids-jewellery', image: categoryImages.kids },
          ].map((item) => (
            <CategoryCard key={item.slug} name={item.name} slug={item.slug} image={item.image} />
          ))}
        </div>
      </section>

      {/* Occasions */}
      <section className="py-16 bg-ivory">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">Jewellery For Every Occasion</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {occasions.map((o) => (
              <Link key={o.slug} to={`/shop?occasion=${o.slug}`} className="px-6 py-3 bg-white rounded-full text-sm font-medium hover:bg-gold hover:text-white transition-colors shadow-sm">
                {o.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Gifting */}
      <section className="py-16 px-4 max-w-7xl mx-auto text-center">
        <h2 className="font-display text-3xl mb-4">Gifting Collection</h2>
        <p className="text-muted max-w-lg mx-auto mb-8">Thoughtfully curated jewellery gifts for birthdays, anniversaries, and every celebration.</p>
        <Link to="/shop/gifting" className="inline-block bg-gold text-white px-8 py-3 rounded-full text-sm font-medium tracking-wider hover:bg-gold-dark transition-colors">
          EXPLORE GIFTS
        </Link>
      </section>

      {/* Premium Collection Banner */}
      <section className="relative h-[50vh] overflow-hidden mx-4 rounded-2xl">
        <img src={premiumBanner} alt="Premium Collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center text-white">
          <div>
            <h2 className="font-display text-4xl md:text-5xl mb-4">Premium Collection</h2>
            <p className="text-lg mb-6">Exquisite designs for the discerning connoisseur</p>
            <Link to="/shop?featured=true" className="border border-white px-8 py-3 rounded-full text-sm tracking-wider hover:bg-white hover:text-charcoal transition-colors">
              DISCOVER MORE
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-10">Why Choose {brand.name}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {whyChooseUs.map((item) => (
            <div key={item.title} className="text-center p-4">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold/10 flex items-center justify-center text-gold text-xl">✦</div>
              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-display text-3xl text-center mb-10">Customer Reviews</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya S.', text: 'Absolutely stunning engagement ring! The craftsmanship is exceptional.', rating: 5 },
              { name: 'Rahul M.', text: 'Great wholesale experience. Competitive pricing and reliable delivery.', rating: 5 },
              { name: 'Ananya K.', text: 'Beautiful mangalsutra design. Modern yet traditional. Highly recommend!', rating: 5 },
            ].map((review) => (
              <div key={review.name} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <Star key={i} size={14} className="fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-sm text-muted mb-3">"{review.text}"</p>
                <p className="text-sm font-medium">{review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl text-center mb-8">Follow @{brand.name.replace(' ', '').toLowerCase()}</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
          {instagramImages.map((img, i) => (
            <div key={i} className="aspect-square rounded-lg overflow-hidden">
              <img src={img} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-charcoal text-white">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl mb-3">Stay Inspired</h2>
          <p className="text-gray-400 mb-6">Get jewellery inspiration and exclusive offers.</p>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" className="flex-1 px-4 py-3 rounded-full text-charcoal text-sm focus:outline-none" />
            <button type="submit" className="bg-gold hover:bg-gold-dark px-6 py-3 rounded-full text-sm font-medium transition-colors">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
}
