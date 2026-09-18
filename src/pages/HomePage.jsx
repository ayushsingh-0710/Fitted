import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWardrobe } from '../context/WardrobeContext';
import { useNotifications } from '../context/NotificationContext';
import { MOCK_RECOMMENDATIONS } from '../data/mockData';
import { fetchRealtimeWeather } from '../services/weatherService';
import { 
  Sparkles, 
  Shirt, 
  ArrowRight, 
  Sun, 
  CheckCircle2, 
  TrendingUp, 
  Upload, 
  Plus, 
  MapPin, 
  RefreshCw, 
  Bell 
} from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();
  const { items } = useWardrobe();
  const { sendWeatherNotification } = useNotifications();
  const navigate = useNavigate();

  const [notificationSent, setNotificationSent] = useState(false);

  // Real-time Weather State
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [weatherData, setWeatherData] = useState(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(true);

  const loadWeather = useCallback(async (cityToFetch) => {
    setIsWeatherLoading(true);
    try {
      const data = await fetchRealtimeWeather(cityToFetch || selectedCity);
      setWeatherData(data);
    } finally {
      setIsWeatherLoading(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    loadWeather('New Delhi');
  }, [loadWeather]);

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);
    loadWeather(newCity);
  };

  const handleUseLiveLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsWeatherLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Step 1: Reverse geocode coordinates to get city name
          let cityName = `${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`;
          try {
            const reverseGeoRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
            );
            if (reverseGeoRes.ok) {
              const geoData = await reverseGeoRes.json();
              const addr = geoData.address || {};
              const city = addr.city || addr.town || addr.village || addr.state_district || addr.state || '';
              const country = addr.country_code ? addr.country_code.toUpperCase() : '';
              if (city) {
                cityName = country ? `${city}, ${country}` : city;
              }
            }
          } catch (geoErr) {
            console.warn('[GPS] Reverse geocoding failed, using coordinates:', geoErr);
          }

          // Step 2: Fetch full weather data from Open-Meteo
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`
          );
          if (!weatherRes.ok) throw new Error(`Weather API HTTP ${weatherRes.status}`);

          const data = await weatherRes.json();
          const current = data.current_weather || {};
          const temp = Math.round(current.temperature ?? 24);
          const code = current.weathercode ?? 0;
          const wind = Math.round(current.windspeed ?? 12);

          // Step 3: Map weather code to condition
          const WEATHER_CODE_MAP = {
            0: 'Clear & Sunny', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
            45: 'Foggy & Misty', 48: 'Rime Fog',
            51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
            61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
            80: 'Rain Showers', 95: 'Thunderstorm'
          };
          const condition = WEATHER_CODE_MAP[code] || 'Clear & Mild';

          // Step 4: Generate climate-tailored fashion advice
          let advice = '';
          let outfitCombo = '';
          if (code >= 51 && code <= 95) {
            advice = 'Rainy & damp conditions. Opt for water-resistant outerwear and weather-sealed footwear.';
            outfitCombo = 'Weatherproof Tech Jacket + Tapered Denim + Gore-Tex Loafers';
          } else if (temp >= 30) {
            advice = 'Hot & humid climate. Wear breathable hand-loomed linen and moisture-wicking organic cotton.';
            outfitCombo = 'Khadi Linen Cuban Shirt + Lightweight Chino Shorts';
          } else if (temp >= 22) {
            advice = 'Pleasant & mild climate. Ideal for effortless light layering with unstructured blazers.';
            outfitCombo = 'Structured Charcoal Blazer + Off-White Oversized Tee';
          } else if (temp >= 15) {
            advice = 'Breezy & cool temperature. Layer crisp outerwear over soft knit bases.';
            outfitCombo = 'Raw Denim Jacket + Heavyweight Cotton Crew + Pleated Trousers';
          } else {
            advice = 'Chilly & cold climate. Heavy wool layering and structured thermal outerwear recommended.';
            outfitCombo = 'Velvet Luxe Overcoat + Cashmere Sweater + Leather Boots';
          }

          // Step 5: Update state with complete weather data
          setSelectedCity(cityName);
          setWeatherData({
            success: true,
            city: cityName,
            temperature: temp,
            windspeed: wind,
            condition,
            advice,
            outfitCombo,
            fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        } catch (err) {
          console.error('[GPS Weather] Failed:', err);
          loadWeather(selectedCity);
        } finally {
          setIsWeatherLoading(false);
        }
      },
      (error) => {
        setIsWeatherLoading(false);
        if (error.code === error.PERMISSION_DENIED) {
          alert('Location access denied. Please enable location permissions in your browser settings and try again.');
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          alert('Unable to determine your location. Please try again or select a city manually.');
        } else {
          alert('Location request timed out. Please try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSendClimateNotification = () => {
    if (weatherData) {
      sendWeatherNotification(weatherData, items);
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 3000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 bg-[#FAF6ED]">
      
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-8 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-fitted-border shadow-cream-card">
        <div className="space-y-2 max-w-xl z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-fitted-brown/10 text-fitted-brown text-[10px] font-bold uppercase tracking-wider">
              Fashion Intelligence Active
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-fitted-charcoal">
            Good afternoon, <span className="brown-gradient-text">{user?.name || 'Dixita'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-fitted-muted">
            Your style score is performing at <span className="text-fitted-brown font-bold">{user?.styleScore || 88}% harmony</span> with your current wardrobe rotation.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => navigate('/ootd')}
            className="px-5 py-3 rounded-2xl bg-fitted-brown text-white font-bold text-xs uppercase tracking-wider hover:bg-fitted-brownDark transition-all flex items-center gap-2 shadow-glow-brown"
          >
            <Upload className="w-4 h-4" />
            <span>Analyze Today's OOTD</span>
          </button>

          <button
            onClick={() => navigate('/wardrobe')}
            className="px-5 py-3 rounded-2xl bg-fitted-bg text-fitted-charcoal border border-fitted-border hover:border-fitted-brown text-xs font-semibold transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-fitted-brown" />
            <span>Add Clothes</span>
          </button>
        </div>

        {/* Ambient Decorative Blur */}
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-fitted-sand/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Grid Stats & Weather Forecast */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Style Score Gauge Card */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-fitted-muted uppercase tracking-wider">Style Passport Metric</span>
            <Sparkles className="w-4 h-4 text-fitted-brown" />
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-display font-bold text-fitted-charcoal">88</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4 pts this week
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-fitted-charcoal">Body Profile: {user?.bodyType || 'Athletic Trapezoid'}</p>
            <p className="text-[11px] text-fitted-muted">Undertone: {user?.undertone || 'Warm Golden'}</p>
          </div>
          <div className="w-full bg-fitted-bg h-2 rounded-full overflow-hidden border border-fitted-border">
            <div className="bg-fitted-brown h-full w-[88%] rounded-full"></div>
          </div>
        </div>

        {/* Daily Outfit Weather & Climate Forecast Card */}
        <div className="glass-card rounded-3xl p-6 space-y-4 flex flex-col justify-between border border-fitted-border">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-fitted-muted uppercase tracking-wider flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-amber-500 animate-spin-slow" />
              <span>Real-Time Climate AI</span>
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => loadWeather(selectedCity)}
                disabled={isWeatherLoading}
                className="p-1.5 rounded-full hover:bg-fitted-bg text-fitted-muted hover:text-fitted-brown transition-colors"
                title="Refresh Weather API"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isWeatherLoading ? 'animate-spin text-fitted-brown' : ''}`} />
              </button>
            </div>
          </div>

          {/* Location Picker & Live Coordinates */}
          <div className="flex items-center justify-between bg-fitted-bg p-2 rounded-xl border border-fitted-border">
            <div className="flex items-center gap-1.5 text-xs text-fitted-charcoal font-semibold">
              <MapPin className="w-3.5 h-3.5 text-fitted-brown shrink-0" />
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="bg-transparent font-bold text-fitted-charcoal focus:outline-none cursor-pointer text-xs"
              >
                <option value="New Delhi">New Delhi, IN</option>
                <option value="Mumbai">Mumbai, IN</option>
                <option value="Bengaluru">Bengaluru, IN</option>
                <option value="Kolkata">Kolkata, IN</option>
                <option value="Jaipur">Jaipur, IN</option>
                <option value="London">London, UK</option>
                <option value="New York">New York, US</option>
              </select>
            </div>
            <button
              onClick={handleUseLiveLocation}
              className="text-[10px] text-fitted-brown hover:underline font-bold"
              title="Use GPS Location"
            >
              GPS Location
            </button>
          </div>

          {/* Temperature & Condition Display */}
          {isWeatherLoading ? (
            <div className="py-3 text-center space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin text-fitted-brown mx-auto" />
              <p className="text-xs text-fitted-muted">Fetching live weather data...</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-fitted-charcoal">
                  {weatherData?.temperature ?? 24}°C
                </span>
                <span className="text-xs font-bold text-fitted-brown">
                  {weatherData?.condition || 'Clear & Sunny'}
                </span>
              </div>
              <p className="text-[11px] text-fitted-muted line-clamp-2">
                {weatherData?.advice || 'Ideal climate for light layering with structured blazers.'}
              </p>
            </div>
          )}

          {/* Dynamic Outfit Recommendation Combo */}
          <div className="p-3 rounded-2xl bg-white border border-fitted-border text-xs space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-fitted-brown font-bold text-[10px] uppercase tracking-wider">Climate-Tailored Fit</span>
              <span className="text-[9px] text-fitted-muted">{weatherData?.fetchedAt ? `Updated ${weatherData.fetchedAt}` : 'Live'}</span>
            </div>
            <p className="text-fitted-charcoal font-bold line-clamp-1 text-[11px]">
              {weatherData?.outfitCombo || 'Structured Charcoal Blazer + Off-White Tee'}
            </p>
          </div>

          {/* Send Climate Outfit Notification Button */}
          <button
            onClick={handleSendClimateNotification}
            disabled={isWeatherLoading || !weatherData}
            className={`w-full py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs ${
              notificationSent
                ? 'bg-emerald-600 text-white'
                : 'bg-fitted-brown hover:bg-fitted-dark-brown text-white'
            }`}
          >
            {notificationSent ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Outfit Alert Sent to Bell & Toast!</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Notify Suitable Clothes</span>
              </>
            )}
          </button>
        </div>

        {/* Digitized Wardrobe Quick Stat */}
        <div className="glass-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-fitted-muted uppercase tracking-wider">Digital Closet</span>
            <Shirt className="w-4 h-4 text-fitted-brown" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-display font-bold text-fitted-charcoal">{items.length || 32}</span>
            <span className="text-xs text-fitted-muted">Cataloged Items</span>
          </div>
          <p className="text-xs text-fitted-muted">
            Active Rotation: <span className="text-fitted-charcoal font-semibold">82% utilization rate</span>
          </p>
          <button
            onClick={() => navigate('/wardrobe')}
            className="w-full py-2.5 rounded-xl bg-fitted-bg hover:bg-white text-fitted-charcoal text-xs font-semibold border border-fitted-border transition-all flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>Manage Wardrobe</span>
            <ArrowRight className="w-3.5 h-3.5 text-fitted-brown" />
          </button>
        </div>

      </div>

      {/* Recommended Products (Wardrobe Gap Shopping) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-fitted-charcoal">Recommended For Your Closet</h2>
            <p className="text-xs text-fitted-muted">Products selected based on your wardrobe gap analysis</p>
          </div>
          <NavLink to="/recommendations" className="text-xs font-bold text-fitted-brown hover:underline flex items-center gap-1">
            <span>View All Recommendations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_RECOMMENDATIONS.slice(0, 3).map((prod) => (
            <div
              key={prod.id}
              onClick={() => navigate(`/product/${prod.id}`)}
              className="glass-card rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden bg-fitted-bg">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-fitted-border text-fitted-brown text-[10px] font-bold flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-3 h-3 text-fitted-sand" />
                  <span>{prod.matchScore}% Match Confidence</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-fitted-muted">{prod.brand}</span>
                    <h3 className="text-sm font-bold text-fitted-charcoal group-hover:text-fitted-brown transition-colors">{prod.name}</h3>
                  </div>
                  <span className="text-base font-bold text-fitted-charcoal">${prod.price}</span>
                </div>

                <p className="text-[11px] text-fitted-muted line-clamp-2 leading-relaxed">
                  {prod.matchReason}
                </p>

                <div className="pt-2 border-t border-fitted-border flex items-center justify-between text-[11px]">
                  <span className="text-fitted-brown font-medium truncate max-w-[180px]">
                    Pairs with: {prod.pairedItemName}
                  </span>
                  <span className="text-fitted-brown font-bold group-hover:translate-x-1 transition-transform">
                    Explore &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
