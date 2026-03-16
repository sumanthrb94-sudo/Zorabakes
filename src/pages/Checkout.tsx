import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, MapPin, CreditCard, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import { createDocument } from '../services/firestore';
import { Order } from '../types';

export const Checkout = () => {
  const { cart, clearCart, cartTotal } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    email: profile?.email || '',
    address: '',
    instructions: '',
    paymentMethod: 'upi'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.address) {
        toast.error('Please fill in all required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setIsProcessing(true);
      
      try {
        const newOrderId = `ZB${Math.floor(Math.random() * 10000)}`;
        const orderData: any = {
          id: newOrderId,
          userId: user?.uid || 'guest',
          items: cart.map(item => ({
            productId: item.product.id,
            productName: item.product.name,
            variant: item.variant.flavor,
            quantity: item.quantity,
            price: item.product.price + item.variant.priceModifier
          })),
          customer: {
            name: formData.name,
            phone: formData.phone,
            email: formData.email
          },
          address: {
            street: formData.address,
            instructions: formData.instructions
          },
          total: cartTotal + 50,
          status: 'received',
          paymentMethod: formData.paymentMethod,
          createdAt: new Date().toISOString(),
          deliveryDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          deliverySlot: '10:00 AM - 01:00 PM'
        };

        await createDocument('orders', orderData, newOrderId);
        setOrderId(newOrderId);
        
        setIsProcessing(false);
        setStep(3);
        clearCart();
        toast.success('Your treats are ordered!');
      } catch (error) {
        console.error("Error placing order:", error);
        toast.error('Failed to place order. Please try again.');
        setIsProcessing(false);
      }
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-[var(--color-beige)] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h2 className="font-script text-5xl text-[var(--color-chocolate)] mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-8 max-w-xs mx-auto">
          Zora is baking something special! Your artisanal goodies will be prepared with love. Order #{orderId} has been confirmed. We've sent a confirmation to your WhatsApp.
        </p>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm w-full max-w-sm mb-8">
          <h3 className="font-bold text-[var(--color-chocolate)] mb-4">Order Details</h3>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold text-[var(--color-terracotta)]">Fresh in the Oven</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total Paid</span>
            <span className="font-bold text-[var(--color-chocolate)]">₹{cartTotal + 50}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/track')}
          className="bg-[var(--color-terracotta)] text-white w-full max-w-sm py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-opacity-90 transition-all mb-4"
        >
          Track Order
        </button>
        <button 
          onClick={() => navigate('/')}
          className="text-[var(--color-chocolate)] font-semibold"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-beige)] pb-32">
      {/* Header */}
      <div className="bg-white sticky top-0 z-30 shadow-sm px-4 py-4 flex items-center gap-4">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(1)} className="p-2 bg-gray-50 rounded-full text-[var(--color-chocolate)]">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-script text-3xl text-[var(--color-terracotta)]">Checkout</h1>
      </div>

      {/* Step Indicator */}
      <div className="px-6 py-4 flex items-center justify-center">
        <div className="flex items-center w-full max-w-xs">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-[var(--color-terracotta)] text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 2 ? 'bg-[var(--color-terracotta)]' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-[var(--color-terracotta)] text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <div className={`flex-1 h-1 mx-2 rounded-full ${step >= 3 ? 'bg-[var(--color-terracotta)]' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 3 ? 'bg-[var(--color-terracotta)] text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
        </div>
      </div>

      <div className="p-4">
        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-[var(--color-chocolate)] flex items-center gap-2 mb-4">
                <Phone size={18} className="text-[var(--color-terracotta)]" />
                Contact Info
              </h3>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Full Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">WhatsApp Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]"
                  placeholder="+91 98765 43210"
                />
                <p className="text-[10px] text-gray-400 mt-1">We'll send order updates here.</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-[var(--color-chocolate)] flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-[var(--color-terracotta)]" />
                Delivery Address
              </h3>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Complete Address *</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)] resize-none h-24"
                  placeholder="House/Flat No., Building Name, Street, Area, Landmark"
                />
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Delivery Instructions (Optional)</label>
                <input 
                  type="text" 
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta)]"
                  placeholder="E.g., Leave at security, call before arriving"
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-bold text-[var(--color-chocolate)] flex items-center gap-2 mb-4">
                <CreditCard size={18} className="text-[var(--color-terracotta)]" />
                Payment Method
              </h3>
              
              <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'upi' ? 'border-[var(--color-terracotta)] bg-[var(--color-beige)]' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'upi' ? 'border-[var(--color-terracotta)]' : 'border-gray-300'}`}>
                      {formData.paymentMethod === 'upi' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />}
                    </div>
                    <span className="font-semibold text-[var(--color-chocolate)]">UPI (GPay, PhonePe, Paytm)</span>
                  </div>
                </label>
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'card' ? 'border-[var(--color-terracotta)] bg-[var(--color-beige)]' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'card' ? 'border-[var(--color-terracotta)]' : 'border-gray-300'}`}>
                      {formData.paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />}
                    </div>
                    <span className="font-semibold text-[var(--color-chocolate)]">Credit / Debit Card</span>
                  </div>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'cod' ? 'border-[var(--color-terracotta)] bg-[var(--color-beige)]' : 'border-gray-100'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'border-[var(--color-terracotta)]' : 'border-gray-300'}`}>
                      {formData.paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-terracotta)]" />}
                    </div>
                    <span className="font-semibold text-[var(--color-chocolate)]">Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[428px] mx-auto bg-white border-t border-gray-100 p-4 z-30 pb-safe">
        <button 
          onClick={handleNext}
          disabled={isProcessing}
          className="w-full bg-[var(--color-chocolate)] text-[var(--color-cream)] py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-[var(--color-cream)] border-t-transparent rounded-full animate-spin" />
          ) : (
            step === 1 ? 'Continue to Payment' : `Pay ₹${cartTotal + 50}`
          )}
        </button>
      </div>
    </div>
  );
};
