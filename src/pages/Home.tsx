import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { ProductCard } from '../components/ProductCard';
import { QuickViewModal } from '../components/QuickViewModal';
import { Product } from '../types';
import { motion } from 'framer-motion';
import { ChevronRight, Star, Heart, Clock, MapPin, Sparkles } from 'lucide-react';

export const Home = () => {
  const { products, loading } = useProducts();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const featuredProducts = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <section className="relative h-[65vh] w-full bg-[var(--color-beige)] overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1555507036-ab1f40ce88f4?auto=format&fit=crop&q=80&w=800" 
          alt="Freshly baked goods" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-script text-6xl text-white drop-shadow-lg mb-4"
          >
            Zora Bakes
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-white text-lg font-medium mb-8 drop-shadow-md"
          >
            Artisanal goodies, baked fresh and delivered to your door.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link 
              to="/shop" 
              className="bg-[var(--color-terracotta)] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl hover:bg-opacity-90 transition-all"
            >
              Explore Our Goodies
            </Link>
          </motion.div>
        </div>
        
        {/* Trust Badges */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/60 to-transparent py-6 px-4 flex justify-center gap-6 text-white text-xs font-medium">
          <div className="flex items-center gap-1.5"><Star size={14} className="text-yellow-400 fill-yellow-400" /> Homemade</div>
          <div className="flex items-center gap-1.5"><Clock size={14} className="text-[var(--color-sage)]" /> Fresh Daily</div>
          <div className="flex items-center gap-1.5"><Heart size={14} className="text-red-400 fill-red-400" /> Eggless Options</div>
        </div>
      </section>

      {/* Seasonal Banner */}
      <section className="bg-[var(--color-terracotta)] text-white py-3 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles size={16} className="text-[var(--color-gold)]" />
        <span className="text-sm font-medium">Spring Collection is here! Treat yourself to our new Lemon Lavender cookies.</span>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 bg-white">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-script text-4xl text-[var(--color-chocolate)]">Fresh from the Oven</h2>
          <Link to="/shop" className="text-sm font-semibold text-[var(--color-terracotta)] flex items-center">
            See All <ChevronRight size={16} />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 snap-x">
          {['Cakes', 'Brownies', 'Cookies', 'Bread', 'Loaves', 'Custom'].map((cat, i) => (
            <Link 
              key={cat} 
              to={`/shop?category=${cat.toLowerCase()}`}
              className="snap-start shrink-0 flex flex-col items-center gap-3"
            >
              <div className="w-20 h-20 rounded-full bg-[var(--color-beige)] border-2 border-[var(--color-cream)] shadow-sm flex items-center justify-center overflow-hidden">
                <img 
                  src={`https://source.unsplash.com/random/200x200/?${cat.toLowerCase()},bakery`} 
                  alt={cat}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200';
                  }}
                />
              </div>
              <span className="text-sm font-medium text-[var(--color-chocolate)]">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 px-4 bg-[var(--color-beige)]">
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-script text-4xl text-[var(--color-chocolate)]">Fan Favorites</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-4 px-4 snap-x">
          {featuredProducts.map((product) => (
            <div key={product.id} className="snap-start shrink-0 w-[240px]">
              <ProductCard product={product} onQuickView={handleQuickView} />
            </div>
          ))}
        </div>
      </section>

      {/* Baker's Choice */}
      <section className="py-10 px-4 bg-white">
        <div className="bg-[var(--color-cream)] rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-sage)] opacity-10 rounded-bl-full" />
          <h2 className="font-script text-4xl text-[var(--color-terracotta)] mb-2">Baker's Choice</h2>
          <h3 className="text-xl font-bold text-[var(--color-chocolate)] mb-3">Lemon Blueberry Loaf</h3>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            "This week I'm loving our zesty lemon loaf. It's the perfect companion for your evening tea. The blueberries are fresh from the local market!" - Zora
          </p>
          <button 
            onClick={() => {
              const p = products.find(p => p.id === 'p5');
              if (p) handleQuickView(p);
            }}
            className="bg-[var(--color-chocolate)] text-[var(--color-cream)] px-6 py-2.5 rounded-full text-sm font-bold shadow-md disabled:opacity-50"
            disabled={loading}
          >
            Treat Yourself
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-chocolate)] text-[var(--color-beige)] py-10 px-6 text-center">
        <h2 className="font-script text-4xl mb-4 text-[var(--color-terracotta)]">Zora Bakes</h2>
        <p className="text-sm opacity-80 mb-6">Homemade with love by our bakers in Bangalore.</p>
        
        <div className="flex flex-col gap-4 items-center text-sm opacity-90 mb-8">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-[var(--color-terracotta)]" />
            <span>Indiranagar, Bangalore (Pickup available)</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-[var(--color-terracotta)]" />
            <span>Mon-Sat: 10 AM - 8 PM</span>
          </div>
        </div>
        
        <div className="text-xs opacity-50">
          &copy; {new Date().getFullYear()} Zora Bakes. All rights reserved.
        </div>
      </footer>

      <QuickViewModal 
        product={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};
