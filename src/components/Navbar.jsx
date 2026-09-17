import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  Sparkles, 
  Shirt, 
  Compass, 
  User, 
  UserCheck,
  ShoppingBag, 
  Bell, 
  LogOut, 
  Settings, 
  Menu, 
  X,
  Home,
  SlidersHorizontal,
  Sun,
  CloudRain,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isLandingPage = location.pathname === '/';

  const navLinks = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'OOTD', path: '/ootd', icon: Sparkles, badge: 'AI' },
    { name: 'Wardrobe', path: '/wardrobe', icon: Shirt },
    { name: 'Discover', path: '/discover', icon: Compass },
    { name: 'Recommendations', path: '/recommendations', icon: SlidersHorizontal },
    { name: 'Book Stylist', path: '/stylist', icon: UserCheck, badge: 'Stylist' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-fitted-border/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <NavLink to={isAuthenticated ? '/home' : '/'} className="flex items-center gap-3 group">
            <div className="relative h-12 px-3 py-1.5 flex items-center justify-center rounded-2xl bg-[#FAF6ED] border border-fitted-border group-hover:border-fitted-brown transition-all duration-300 shadow-xs">
              <img src="/fitted-emblem-logo.jpg" alt="Fitted Emblem" className="h-9 w-9 object-contain rounded-xl" />
              <span className="font-display text-xl font-bold tracking-tight text-fitted-charcoal ml-2">
                FITTED <span className="w-1.5 h-1.5 rounded-full bg-fitted-brown inline-block"></span>
              </span>
            </div>
          </NavLink>

          {/* Desktop Main Navigation */}
          {isAuthenticated && !isLandingPage && (
            <nav className="hidden md:flex items-center gap-1 bg-white p-1.5 rounded-full border border-fitted-border shadow-xs">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `relative px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-2 ${
                        isActive
                          ? 'bg-fitted-brown text-white shadow-sm'
                          : 'text-fitted-muted hover:text-fitted-charcoal hover:bg-fitted-bg'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded-full bg-fitted-rose text-white shadow-xs">
                        {link.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-3">
            
            {/* Landing Page Action Buttons */}
            {isLandingPage && (
              <div className="hidden sm:flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-5 py-2.5 text-xs font-semibold tracking-wide text-fitted-muted hover:text-fitted-charcoal transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-5 py-2.5 text-xs font-bold tracking-wide rounded-full bg-fitted-brown text-white hover:bg-fitted-brownDark transition-all shadow-glow-brown flex items-center gap-2"
                >
                  <span>Get Started</span>
                  <Sparkles className="w-3.5 h-3.5 fill-white" />
                </NavLink>
              </div>
            )}

            {/* Authenticated Controls */}
            {isAuthenticated && (
              <>
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      if (!notificationsOpen) markAllAsRead();
                    }}
                    className="p-2.5 rounded-full bg-white text-fitted-charcoal hover:bg-fitted-bg border border-fitted-border transition-all relative shadow-xs"
                    aria-label="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-fitted-brown text-white shadow-xs animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Popover */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-3 w-84 sm:w-96 rounded-3xl bg-white border border-fitted-border p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 text-left">
                      <div className="flex items-center justify-between border-b border-fitted-border pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-fitted-charcoal uppercase tracking-wider">Style & Climate Alerts</span>
                          {unreadCount > 0 && (
                            <span className="text-[10px] bg-fitted-brown text-white px-2 py-0.5 rounded-full font-bold">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        {notifications.length > 0 && (
                          <button
                            onClick={markAllAsRead}
                            className="text-[10px] text-fitted-muted hover:text-fitted-brown font-semibold transition-colors"
                          >
                            Clear Badges
                          </button>
                        )}
                      </div>

                      <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-3 rounded-2xl border transition-all text-xs ${
                              notif.type === 'weather_outfit'
                                ? 'bg-amber-50/50 border-amber-200'
                                : 'bg-fitted-bg/60 border-fitted-border'
                            }`}
                          >
                            <div className="flex items-start gap-2.5">
                              {notif.type === 'weather_outfit' ? (
                                <div className="p-1.5 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                                  {notif.condition?.toLowerCase().includes('rain') ? (
                                    <CloudRain className="w-3.5 h-3.5" />
                                  ) : (
                                    <Sun className="w-3.5 h-3.5" />
                                  )}
                                </div>
                              ) : (
                                <div className="p-1.5 rounded-xl bg-fitted-brown/10 text-fitted-brown shrink-0 mt-0.5">
                                  <Sparkles className="w-3.5 h-3.5" />
                                </div>
                              )}

                              <div className="space-y-1 w-full">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-fitted-charcoal text-[11px] line-clamp-1">
                                    {notif.title}
                                  </span>
                                  <span className="text-[9px] text-fitted-muted shrink-0 ml-1 font-mono">
                                    {notif.timestamp}
                                  </span>
                                </div>

                                <p className="text-fitted-muted text-[11px] leading-relaxed">
                                  {notif.message}
                                </p>

                                {notif.pieces && notif.pieces.length > 0 && (
                                  <div className="mt-2 pt-2 border-t border-amber-200/60 space-y-1.5">
                                    <p className="text-[10px] font-bold text-fitted-brown flex items-center gap-1">
                                      <Shirt className="w-3 h-3" />
                                      <span>Matched Clothes:</span>
                                    </p>
                                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                                      {notif.pieces.map((piece, pIdx) => (
                                        <div key={pIdx} className="flex items-center gap-1 bg-white p-1 rounded-lg border border-amber-200 shrink-0">
                                          <img 
                                            src={piece.image} 
                                            alt={piece.name} 
                                            className="w-6 h-6 rounded-md object-cover" 
                                          />
                                          <span className="text-[9px] font-medium text-fitted-charcoal max-w-[70px] truncate">
                                            {piece.name}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                    <button
                                      onClick={() => {
                                        setNotificationsOpen(false);
                                        navigate('/wardrobe');
                                      }}
                                      className="text-[10px] font-bold text-fitted-brown hover:underline flex items-center gap-1 pt-0.5"
                                    >
                                      <span>Open Wardrobe</span>
                                      <ArrowRight className="w-2.5 h-2.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Shopping Bag Button */}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="p-2.5 rounded-full bg-white text-fitted-charcoal hover:bg-fitted-bg border border-fitted-border transition-all relative flex items-center gap-2 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  {totalCartItems > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-fitted-brown text-white shadow-xs">
                      {totalCartItems}
                    </span>
                  )}
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-1 pr-3 rounded-full bg-white border border-fitted-border hover:border-fitted-brown transition-all shadow-xs"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                      alt={user?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border border-fitted-brown"
                    />
                    <span className="hidden lg:inline text-xs font-semibold text-fitted-charcoal max-w-[100px] truncate">
                      {user?.name || 'Account'}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white p-2 shadow-2xl border border-fitted-border z-50">
                      <div className="px-3 py-2 border-b border-fitted-border mb-1">
                        <p className="text-xs font-bold text-fitted-charcoal truncate">{user?.name}</p>
                        <p className="text-[10px] text-fitted-muted truncate">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => { navigate('/profile'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-fitted-charcoal hover:bg-fitted-bg flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-fitted-brown" />
                        <span>Style Passport</span>
                      </button>
                      <button
                        onClick={() => { navigate('/settings'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-fitted-charcoal hover:bg-fitted-bg flex items-center gap-2"
                      >
                        <Settings className="w-3.5 h-3.5 text-fitted-brown" />
                        <span>Settings</span>
                      </button>
                      <div className="border-t border-fitted-border my-1"></div>
                      <button
                        onClick={() => { logout(); navigate('/'); setUserMenuOpen(false); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-fitted-charcoal hover:bg-fitted-bg bg-white border border-fitted-border"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-fitted-border p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
          {isAuthenticated ? (
            navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-fitted-brown text-white' : 'text-fitted-charcoal hover:bg-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.name}</span>
                </NavLink>
              );
            })
          ) : (
            <div className="flex flex-col gap-2 pt-2">
              <NavLink
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-sm font-semibold text-fitted-charcoal bg-white rounded-xl border border-fitted-border"
              >
                Sign In
              </NavLink>
              <NavLink
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-3 text-center text-sm font-bold text-white bg-fitted-brown rounded-xl"
              >
                Get Started
              </NavLink>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
