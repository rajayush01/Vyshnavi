import { useState } from 'react';
import { Milk, Lock, Mail, User, Eye, EyeOff } from 'lucide-react';

export default function DairyAuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    if (isLogin) {
      console.log('Login:', { email: formData.email, password: formData.password });
      alert('Login submitted! Check console for details.');
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      console.log('Signup:', formData);
      alert('Signup submitted! Check console for details.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4 mt-20">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col items-center justify-center p-8">
          <div className="bg-white p-8 rounded-full shadow-2xl mb-6">
            <Milk className="w-24 h-24 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            Vyshnavi Dairy
          </h1>
          <p className="text-gray-600 text-center text-lg">
            Quality dairy products delivered fresh to your doorstep
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-2xl font-bold text-blue-600">100%</p>
              <p className="text-sm text-gray-600">Pure</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-2xl font-bold text-blue-600">24/7</p>
              <p className="text-sm text-gray-600">Fresh</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <p className="text-2xl font-bold text-blue-600">5★</p>
              <p className="text-sm text-gray-600">Rated</p>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="md:hidden flex justify-center mb-6">
            <Milk className="w-16 h-16 text-blue-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isLogin ? 'Welcome Back!' : 'Join Us Today'}
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>

          <div className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={toggleForm}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

    
        </div>
      </div>
    </div>
  );
}