import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  Search, 
  User as UserIcon, 
  Menu, 
  X, 
  TrendingUp, 
  Star, 
  ArrowRight, 
  Filter, 
  ShoppingCart, 
  Store, 
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  Percent
} from 'lucide-react';
import { User, Product, CartItem } from './types';
import { MOCK_PRODUCTS } from './lib/data';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' }>(
  ({ className, variant = 'primary', ...props }, ref) => {
    const variants = {
      primary: 'premium-gradient text-white shadow-lg shadow-indigo-200 hover:shadow-indigo-300',
      secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
      outline: 'bg-transparent border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
      ghost: 'bg-transparent text-slate-600 hover:bg-slate-100'
    };
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50',
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100',
      className
    )}
    {...props}
  />
));

// --- Main Application ---

export default function NexStore() {
  const [view, setView] = useState<'auth' | 'dashboard' | 'seller'>('auth');
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCart, setShowCart] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Derived State
  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Actions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setOrderComplete(false);
      setCart([]);
      setShowCart(false);
    }, 3000);
  };

  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    
    setUser({ id: 'u-1', name, email, role: 'user' });
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('auth');
    setCart([]);
  };

  // Views
  if (view === 'auth') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="absolute top-0 left-0 w-full h-1 premium-gradient" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="text-center">
            <div className="inline-flex p-4 rounded-2xl bg-indigo-50 text-indigo-600 mb-6">
              <ShoppingBag size={40} />
            </div>
            <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2 tracking-tight">NexStore</h1>
            <p className="text-slate-500 font-medium">Pakistan's Premium Marketplace</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <Input name="name" placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <Input type="password" placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full text-lg h-14">
              Enter Dashboard
            </Button>
          </form>

          <p className="text-center text-sm text-slate-400">
            Secure checkout & Premium delivery guaranteed
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-72 bg-white border-r border-slate-100 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 premium-gradient rounded-xl flex items-center justify-center text-white">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-2xl font-serif font-bold tracking-tight">NexStore</h2>
          </div>

          <nav className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-4">Catalog</p>
            {['all', 'Electronics', 'Fashion', 'Home & Living', 'Beauty', 'Sports'].map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setCategoryFilter(cat);
                  setView('dashboard');
                }}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group',
                  categoryFilter === cat 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                )}
              >
                <div className="flex items-center gap-3">
                  <span>{cat === 'all' ? 'Discover All' : cat}</span>
                </div>
                <ChevronRight size={16} className={cn('opacity-0 group-hover:opacity-100', categoryFilter === cat && 'opacity-100')} />
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-50">
          <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-4">
            <Store className="text-indigo-400" size={32} />
            <div>
              <h4 className="font-bold">Grow Your Business</h4>
              <p className="text-xs text-slate-400 mt-1">Open your premium shop today and reach millions.</p>
            </div>
            <button 
              onClick={() => setView('seller')}
              className="w-full bg-white text-slate-900 py-3 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              Start Selling Info
            </button>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 mt-6 text-slate-400 hover:text-red-500 font-semibold transition-colors px-4 py-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <button className="lg:hidden p-2 text-slate-600">
              <Menu size={24} />
            </button>
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search products, brands, collections..." 
                className="w-full h-11 bg-slate-100 rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 border border-transparent focus:border-indigo-200 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                {user?.name.charAt(0)}
              </div>
              <span className="text-sm font-bold text-slate-900">{user?.name}</span>
            </div>
            
            <button 
              onClick={() => setShowCart(true)}
              className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors bg-white border border-slate-200 rounded-xl"
            >
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 premium-gradient text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        {view === 'dashboard' ? (
          <div className="p-6 lg:p-10 space-y-12">
            {/* Hero Banners */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 relative overflow-hidden rounded-[32px] premium-gradient p-12 text-white h-[400px] flex flex-col justify-center">
                <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
                   <TrendingUp size={400} />
                </div>
                <div className="relative z-10 space-y-6 max-w-md">
                   <span className="bg-white/20 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md">Flash Sale</span>
                   <h1 className="text-5xl font-serif font-bold leading-tight tracking-tight">Tech Fest <br/>Pakistan 2026</h1>
                   <p className="text-indigo-50 text-lg">Up to 70% off on all premium electronics. Limited time offer.</p>
                   <Button variant="secondary" className="w-fit h-14 px-10 text-lg">
                      Explore Collection <ArrowRight className="ml-2" size={20} />
                   </Button>
                </div>
              </div>
              
              <div className="bg-indigo-600 rounded-[32px] p-8 flex flex-col justify-between text-white relative overflow-hidden group">
                 <div className="absolute -right-10 -bottom-10 text-white/10 group-hover:scale-110 transition-transform duration-500">
                    <Percent size={200} />
                 </div>
                 <div className="space-y-4">
                    <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">Weekend Offer</p>
                    <h3 className="text-3xl font-serif font-bold leading-snug">New Style <br/>Arrivals</h3>
                 </div>
                 <p className="text-indigo-100 text-sm">Save 30% Extra today.</p>
                 <button className="flex items-center gap-2 font-bold text-sm hover:translate-x-2 transition-transform">
                   Shop Fashion <ArrowRight size={18} />
                 </button>
              </div>
            </div>

            {/* Product Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">Best Sellers</h2>
                  <p className="text-slate-500 font-medium">Curated products based on trending searches</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors">
                     <Filter size={20} />
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={product.id} 
                    className="group bg-white rounded-3xl p-4 border border-transparent hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-100/30 transition-all duration-300"
                  >
                    <div className="relative aspect-square rounded-2xl bg-slate-50 overflow-hidden mb-6">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                      />
                      {product.isOffer && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
                          Sale
                        </div>
                      )}
                      <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <TrendingUp size={18} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                        <span>{product.category}</span>
                        <div className="flex items-center gap-1 text-slate-900">
                          <Star size={12} className="fill-indigo-500 text-indigo-500" />
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xl font-black text-slate-900">${product.price}</span>
                        <button 
                          onClick={() => addToCart(product)}
                          className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg active:scale-90"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="py-20 text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">No products found</h3>
                  <p className="text-slate-500">Try adjusting your filters or search keywords.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Seller View */
          <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-12">
             <div className="space-y-4 text-center">
                <Store size={64} className="mx-auto text-indigo-600" />
                <h1 className="text-5xl font-serif font-bold text-slate-900 tracking-tight">Become a Seller</h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">Open your shop on NexStore and reach customers across Pakistan. Join 50,000+ businesses and start earning today.</p>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                   <h3 className="text-2xl font-bold text-slate-900">NexStore Seller Pro</h3>
                   <ul className="space-y-4">
                      {['0% Listing Fees', 'AI Powered Pricing', 'Premium Support', 'Dedicated Logistics'].map(item => (
                        <li key={item} className="flex items-center gap-3 font-semibold text-slate-600">
                           <CheckCircle2 size={24} className="text-indigo-500" />
                           {item}
                        </li>
                      ))}
                   </ul>
                   <Button className="w-full h-14 text-md mt-6">Apply for Seller Account</Button>
                </div>

                <div className="bg-indigo-50 p-8 rounded-3xl border border-indigo-100 flex flex-col justify-center">
                   <h3 className="text-xl font-bold text-indigo-900 mb-2">Wait Times</h3>
                   <p className="text-indigo-700/70 mb-6">Our verification process currently takes 2-4 business days due to high volume.</p>
                   <div className="w-full bg-indigo-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 w-3/4 h-full" />
                   </div>
                   <p className="text-xs font-bold text-indigo-400 mt-2 uppercase tracking-widest">75% Applications Verified</p>
                </div>
             </div>
          </div>
        )}
      </main>

      {/* Slide-over Cart */}
      <AnimatePresence>
        {showCart && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCart(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[60] flex flex-col px-8 py-10"
            >
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-serif font-bold text-slate-900">Your Cart</h2>
                <button 
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-slate-400">
                    <ShoppingCart size={64} strokeWidth={1.5} />
                    <p className="text-lg font-semibold italic">Cart is feeling a bit empty...</p>
                    <Button variant="outline" onClick={() => setShowCart(false)}>Continue Shopping</Button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={item.id} 
                      className="flex gap-4 p-2"
                    >
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{item.name}</h4>
                        <p className="text-sm text-slate-400 font-semibold">{item.quantity} x ${item.price}</p>
                      </div>
                      <div className="flex flex-col justify-center items-end">
                        <span className="font-black text-slate-900 mb-2">${item.price * item.quantity}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-8 mt-auto space-y-6 border-t border-slate-50">
                   <div className="flex items-center justify-between">
                     <span className="text-slate-500 font-bold">Subtotal</span>
                     <span className="text-3xl font-black text-slate-900">${cartTotal}</span>
                   </div>
                   <p className="text-xs text-slate-400 text-center font-medium">Free premium shipping included over $100</p>
                   
                   {!orderComplete ? (
                     <Button className="w-full h-16 text-lg" onClick={handleCheckout}>
                       Confirm Order
                     </Button>
                   ) : (
                     <div className="w-full h-16 bg-green-500 text-white rounded-xl flex items-center justify-center gap-3">
                       <CheckCircle2 size={24} />
                       <span className="font-bold text-lg">Order Placed!</span>
                     </div>
                   )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
