import { useState, useRef } from 'react';
import { ShoppingCart, Plus, Minus, X, Check, Upload, Coffee, Home, Clock, Phone, MapPin } from 'lucide-react';

const GoffeeCoffeeApp = () => {
  type CartItem = any;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [orderType, setOrderType] = useState('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [itemImage, setItemImage] = useState<any>(null);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const menu = [
    {
      id: 1,
      category: 'Classic Coffee',
      items: [
        { id: 101, name: 'Espresso', priceHot: 4000, description: 'Rich and bold shot of pure coffee' },
        { id: 102, name: 'Flat White', priceHot: 6000, description: 'Smooth microfoam with double shot' },
        { id: 103, name: 'Latte', priceHot: 6000, priceIced: 6000, description: 'Espresso with velvety steamed milk' },
        { id: 104, name: 'Spanish Latte', priceHot: 6000, priceIced: 6000, description: 'Sweet creamy latte with condensed milk' },
        { id: 105, name: 'Americano', priceHot: 6000, priceIced: 6000, description: 'Espresso diluted with hot water' },
        { id: 106, name: 'Cappuccino', priceHot: 6000, priceIced: 6000, description: 'Espresso with steamed milk and foam' },
        { id: 107, name: 'Mocha', priceHot: 6000, priceIced: 6000, description: 'Espresso with chocolate and steamed milk' },
      ]
    },
    {
      id: 2,
      category: 'Special Coffee',
      items: [
        { id: 201, name: 'Dirty Latte', priceIced: 6000, description: 'Espresso shots over cold milk' },
        { id: 202, name: 'Sicily', priceIced: 6000, description: 'Refreshing citrus coffee blend' },
        { id: 203, name: 'Tonpresso', priceIced: 6000, description: 'Espresso with tonic water' },
        { id: 204, name: 'Cold Brew', priceIced: 6000, description: 'Smooth slow-steeped coffee' },
        { id: 205, name: 'Ice Drip', priceIced: 6000, description: 'Slow-dripped concentrated coffee' },
      ]
    },
    {
      id: 3,
      category: 'Hand Drip Coffee',
      items: [
        { id: 301, name: 'Wash Process', priceHot: 8000, description: 'Clean and bright flavor profile' },
        { id: 302, name: 'Honey Process', priceHot: 8000, description: 'Sweet and fruity notes' },
        { id: 303, name: 'Natural Process', priceHot: 8000, description: 'Bold and complex flavors' },
        { id: 304, name: 'Special Process', priceHot: 10000, description: 'Exclusive processing method' },
      ]
    },
    {
      id: 4,
      category: 'Non Coffee',
      items: [
        { id: 401, name: 'Lemonade Sparkling', priceIced: 6000, description: 'Refreshing fizzy lemonade' },
        { id: 402, name: 'Matcha', priceHot: 6000, priceIced: 6000, description: 'Premium Japanese green tea' },
        { id: 403, name: 'Chocolate', priceHot: 6000, priceIced: 6000, description: 'Rich hot chocolate' },
        { id: 404, name: 'Milk', priceHot: 4000, priceIced: 4000, description: 'Fresh steamed or iced milk' },
      ]
    }
  ];

  const addToCart = (item: any) => {
    setSelectedItem(item);
  };

  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setItemImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmAddToCart = (temperature: string) => {
    if (!selectedItem) return;
    
    const price = temperature === 'hot' ? selectedItem.priceHot : selectedItem.priceIced;
    const itemWithDetails = { 
      ...selectedItem, 
      temperature,
      price,
      uploadedImage: itemImage,
      specialInstructions 
    };
    
    const existing = cart.find((i: any) => 
      i.id === selectedItem.id && 
      i.temperature === temperature &&
      i.specialInstructions === specialInstructions
    );
    
    if (existing) {
      setCart(cart.map((i: any) => 
        i.id === selectedItem.id && i.temperature === temperature && i.specialInstructions === specialInstructions
          ? { ...i, quantity: i.quantity + 1, uploadedImage: itemImage || i.uploadedImage }
          : i
      ));
    } else {
      setCart([...cart, { ...itemWithDetails, quantity: 1 }]);
    }
    
    setSelectedItem(null);
    setItemImage(null);
    setSpecialInstructions('');
  };

  const cancelAddToCart = () => {
    setSelectedItem(null);
    setItemImage(null);
    setSpecialInstructions('');
  };

  const updateQuantity = (id: number, temperature: string, change: number) => {
    setCart(cart.map((item: any) => {
      if (item.id === id && item.temperature === temperature) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }).filter((item: any) => item.quantity > 0));
  };

  const removeFromCart = (id: number, temperature: string) => {
    setCart(cart.filter((item: any) => !(item.id === id && item.temperature === temperature)));
  };

  const getTotal = () => {
    return cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (customerName.trim() && phoneNumber.trim()) {
      if (orderType === 'dine-in' && !tableNumber.trim()) return;
      if (orderType === 'pickup' && !pickupTime.trim()) return;
      
      setOrderPlaced(true);
      setTimeout(() => {
        setOrderPlaced(false);
        setCart([]);
        setCustomerName('');
        setPhoneNumber('');
        setTableNumber('');
        setPickupTime('');
        setShowCart(false);
      }, 4000);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-200">
          <div className="w-20 h-20 bg-black rounded-full mx-auto mb-6 flex items-center justify-center">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold italic mb-2" style={{ fontFamily: 'Georgia, serif' }}>ORDER CONFIRMED</h2>
          <p className="text-gray-600 mb-4">Thank you, {customerName}</p>
          {orderType === 'dine-in' ? (
            <p className="text-lg">Table #{tableNumber}</p>
          ) : (
            <p className="text-lg">Pickup Time: {pickupTime}</p>
          )}
          <p className="text-sm text-gray-500 mt-4">Your order will be ready soon</p>
          <p className="text-2xl font-bold mt-6">{getTotal().toLocaleString()} MMK</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-black text-white p-6 sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold italic mb-1" style={{ fontFamily: 'Georgia, serif' }}>GOFFEE</h1>
            <h1 className="text-3xl font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>COFFEE</h1>
            <p className="text-gray-300 text-sm mt-2">Always Good Coffee</p>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative bg-white text-black p-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setOrderType('dine-in')}
            className={`p-4 rounded-xl font-bold transition shadow-md ${
              orderType === 'dine-in' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            <Home className="w-6 h-6 mx-auto mb-2" />
            DINE IN
          </button>
          <button
            onClick={() => setOrderType('pickup')}
            className={`p-4 rounded-xl font-bold transition shadow-md ${
              orderType === 'pickup' 
                ? 'bg-black text-white' 
                : 'bg-gray-100 text-black hover:bg-gray-200'
            }`}
          >
            <Coffee className="w-6 h-6 mx-auto mb-2" />
            PICKUP
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-24">
        {menu.map(category => (
          <div key={category.id} className="mb-8">
            <h2 className="text-2xl font-bold italic mb-4 px-2 pb-2" style={{ fontFamily: 'Georgia, serif' }}>
              {category.category}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {category.items.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-2xl shadow-md p-4 hover:shadow-xl transition border border-gray-200">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="flex-1">
                        <h3 className="font-bold text-black text-lg" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</h3>
                        <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.description}</p>
                        <div className="mt-2">
                          {item.priceHot && (
                            <span className="text-black font-bold text-sm mr-3">
                              Hot: {item.priceHot} MMK
                            </span>
                          )}
                          {item.priceIced && (
                            <span className="text-black font-bold text-sm">
                              Iced: {item.priceIced} MMK
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="bg-black hover:bg-gray-800 text-white p-2 rounded-full transition shadow-md flex-shrink-0 mt-1"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="bg-black text-white p-6 sm:rounded-t-3xl rounded-t-3xl flex justify-between items-center">
              <h2 className="text-2xl font-bold italic" style={{ fontFamily: 'Georgia, serif' }}>YOUR ORDER</h2>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-800 rounded-lg transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <p className="text-center text-gray-600 py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item: any, index: number) => (
                    <div key={`${item.id}-${item.temperature}-${index}`} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-start gap-3 mb-3">
                        {item.uploadedImage ? (
                          <img src={item.uploadedImage} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">☕</div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-bold text-black" style={{ fontFamily: 'Georgia, serif' }}>{item.name}</h3>
                          <p className="text-sm text-gray-600 uppercase">{item.temperature}</p>
                          {item.specialInstructions && (
                            <p className="text-xs text-gray-500 italic mt-1">Note: {item.specialInstructions}</p>
                          )}
                          <p className="text-black font-bold mt-1">{item.price.toLocaleString()} MMK</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id, item.temperature)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 justify-end">
                        <button 
                          onClick={() => updateQuantity(item.id, item.temperature, -1)} 
                          className="bg-gray-200 hover:bg-gray-300 text-black p-1 rounded-lg transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.temperature, 1)}
                          className="bg-black hover:bg-gray-800 text-white p-1 rounded-lg transition"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {cart.length > 0 && (
                <div className="mt-6 space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white text-black rounded-xl focus:border-black focus:outline-none placeholder-gray-400"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-3 border border-gray-300 bg-white text-black rounded-xl focus:border-black focus:outline-none placeholder-gray-400"
                  />
                  {orderType === 'dine-in' ? (
                    <input
                      type="text"
                      placeholder="Table Number *"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      className="w-full p-3 border border-gray-300 bg-white text-black rounded-xl focus:border-black focus:outline-none placeholder-gray-400"
                    />
                  ) : (
                    <input
                      type="time"
                      placeholder="Pickup Time *"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-3 border border-gray-300 bg-white text-black rounded-xl focus:border-black focus:outline-none placeholder-gray-400"
                    />
                  )}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50 sm:rounded-b-3xl rounded-b-3xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold italic text-black" style={{ fontFamily: 'Georgia, serif' }}>TOTAL:</span>
                  <span className="text-2xl font-bold text-black">{getTotal().toLocaleString()} MMK</span>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={!customerName.trim() || !phoneNumber.trim() || (orderType === 'dine-in' && !tableNumber.trim()) || (orderType === 'pickup' && !pickupTime.trim())}
                  className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold py-4 rounded-xl transition shadow-lg disabled:cursor-not-allowed"
                >
                  PLACE ORDER
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold text-black mb-2 italic" style={{ fontFamily: 'Georgia, serif' }}>{selectedItem.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{selectedItem.description}</p>
            
            <div className="mb-4">
              <p className="text-sm font-bold mb-2">SELECT TEMPERATURE</p>
              <div className="grid grid-cols-2 gap-3">
                {selectedItem.priceHot && (
                  <button
                    onClick={() => confirmAddToCart('hot')}
                    className="p-3 border border-gray-300 rounded-xl hover:bg-black hover:text-white transition font-bold"
                  >
                    HOT
                    <div className="text-sm mt-1">{selectedItem.priceHot} MMK</div>
                  </button>
                )}
                {selectedItem.priceIced && (
                  <button
                    onClick={() => confirmAddToCart('iced')}
                    className="p-3 border border-gray-300 rounded-xl hover:bg-black hover:text-white transition font-bold"
                  >
                    ICED
                    <div className="text-sm mt-1">{selectedItem.priceIced} MMK</div>
                  </button>
                )}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-bold mb-2">SPECIAL INSTRUCTIONS (OPTIONAL)</p>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="Extra hot, less sugar, etc."
                className="w-full p-3 border border-gray-300 rounded-xl focus:border-black focus:outline-none placeholder-gray-400 resize-none"
                rows={3}
              />
            </div>

            <div className="mb-6">
              <p className="text-sm font-bold mb-2">ADD REFERENCE IMAGE (OPTIONAL)</p>
              
              {itemImage ? (
                <div className="relative">
                  <img src={itemImage} alt="Preview" className="w-full h-48 object-cover rounded-xl mb-3" />
                  <button
                    onClick={() => setItemImage(null)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm mb-4">Upload reference image</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition"
                  >
                    CHOOSE IMAGE
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={cancelAddToCart}
              className="w-full bg-gray-200 hover:bg-gray-300 text-black font-bold py-3 rounded-xl transition"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      <div className="bg-black text-white p-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>GOFFEE COFFEE</h2>
          <p className="text-gray-300 mb-6">Always Good Coffee</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <MapPin className="w-5 h-5 mx-auto mb-2" />
              <p>Mandalay, Myanmar</p>
            </div>
            <div>
              <Phone className="w-5 h-5 mx-auto mb-2" />
              <p>09981249663</p>
            </div>
            <div>
              <Clock className="w-5 h-5 mx-auto mb-2" />
              <p>7:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoffeeCoffeeApp;
