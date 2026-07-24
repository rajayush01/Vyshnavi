import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation, Variants, TargetAndTransition } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Milk,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Twitter,
} from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  service?: string;
  message?: string;
}

const ContactUs: React.FC = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Refs for animations
  const heroRef = useRef(null);
  const infoRef = useRef(null);
  const formRef = useRef(null);
  const mapRef = useRef(null);

  // Animation controls
  const heroControls = useAnimation();
  const infoControls = useAnimation();
  const formControls = useAnimation();
  const mapControls = useAnimation();

  // InView hooks
  const heroInView = useInView(heroRef, { once: true, amount: 0.1 });
  const infoInView = useInView(infoRef, { once: true, amount: 0.1 });
  const formInView = useInView(formRef, { once: true, amount: 0.1 });
  const mapInView = useInView(mapRef, { once: true, amount: 0.1 });

  useEffect(() => {
    if (heroInView) heroControls.start('visible');
    if (infoInView) infoControls.start('visible');
    if (formInView) formControls.start('visible');
    if (mapInView) mapControls.start('visible');
  }, [heroInView, infoInView, formInView, mapInView, heroControls, infoControls, formControls, mapControls]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const staggerItem: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: [0.25, 0.25, 0.25, 0.75],
      },
    },
  };

  const floatingAnimation: TargetAndTransition = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  // Validation functions
  const validateName = (value: string) => {
    if (!value.trim()) return "Name is required";
    if (/\d/.test(value)) return "Name should not contain numbers";
    if (value.length < 2) return "Name should be at least 2 characters long";
    if (value.length > 50) return "Name should not exceed 50 characters";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (value: string) => {
    if (!value) return "Phone number is required";
    if (!/^\d+$/.test(value)) return "Phone number should contain only digits";
    if (value.length !== 10) return "Phone number should be exactly 10 digits";
    return "";
  };

  const validateMessage = (value: string) => {
    if (!value.trim()) return "Message is required";
    if (value.length < 5) return "Message should be at least 5 characters long";
    if (value.length > 500) return "Message should not exceed 500 characters";
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      message: validateMessage(message),
      service: !service ? "Please select what you're reaching out about" : "",
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setFeedback("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setFeedback("");

    const formData = { name, email, phone, service, message };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/contact/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        setFeedback("Message sent! Our team will get back to you within 24 hours.");
        setName("");
        setEmail("");
        setPhone("");
        setService("");
        setMessage("");
        setErrors({});
      } else {
        setFeedback(
          data.message || "Couldn't send your message. Please try again."
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setFeedback("Something went wrong. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-sky-50 to-white min-h-screen">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-60 h-60 bg-sky-300 rounded-full mix-blend-multiply filter blur-xl opacity-10"
          animate={{
            x: [0, 100, -100, 0],
            y: [0, -100, 100, 0],
            scale: [1, 1.3, 0.8, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Mouse Follower Effect */}
      <motion.div
        className="fixed w-6 h-6 bg-cyan-400 rounded-full mix-blend-difference pointer-events-none z-50"
        animate={{
          x: mousePosition.x - 12,
          y: mousePosition.y - 12,
        }}
        transition={{
          type: 'spring',
          damping: 30,
          stiffness: 400,
        }}
      />

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={heroControls}
        variants={fadeInUp}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-slate-900/70 to-slate-950/90" />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
            animate={{
              backgroundPosition: ['0px 0px', '50px 50px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>

        {/* Decorative milk-drop ripple SVG layer */}
        <svg
          className="absolute bottom-0 left-0 w-full opacity-30 pointer-events-none"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C240,110 480,20 720,50 C960,80 1200,20 1440,60 L1440,120 L0,120 Z"
            fill="url(#milkWave)"
          />
          <defs>
            <linearGradient id="milkWave" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
          </defs>
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 mt-20">
          <motion.div
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.div className="flex justify-center mb-8" animate={floatingAnimation}>
              <div className="relative">
                <Milk className="h-16 w-16 text-cyan-300" strokeWidth={1.5} />
                <motion.div
                  className="absolute inset-0 rounded-full bg-cyan-400/30"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl md:text-6xl font-black text-white mb-6 bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Get in Touch with Vyshnavi Dairy
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-sky-100 max-w-3xl mx-auto leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Farm-fresh milk, A2 ghee, and dairy products delivered with care. Whether it's a
              bulk order, a subscription, or just a question — we'd love to hear from you.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{
                opacity: [1, 0, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div ref={infoRef} initial="hidden" animate={infoControls} variants={staggerContainer}>
            <motion.div variants={staggerItem}>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Vyshnavi Dairy</h2>
              <h3 className="text-2xl font-semibold text-sky-600 mb-4">
                Pure & Fresh, Straight From the Farm
              </h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                We're a family-run dairy bringing farm-fresh milk, A2 ghee, paneer, and curd to
                homes and businesses. Every batch is sourced daily, processed hygienically, and
                delivered with the same care we'd want for our own family.
              </p>
              <div className="bg-sky-50 border-l-4 border-cyan-500 p-4 mb-8 rounded-r-lg">
                <p className="text-sky-900 font-medium">
                  We treat every drop of milk the way it deserves to be treated — with patience,
                  cleanliness, and respect for where it came from.
                </p>
              </div>
            </motion.div>

            <div className="space-y-8">
              {[
                {
                  icon: MapPin,
                  title: 'Visit Our Farm & Store',
                  details: ['Vyshnavi Dairy Farm', 'Main Road, [Village/Town], [District]', '[State] — [PIN Code], India'],
                  color: 'bg-cyan-500',
                },
                {
                  icon: Phone,
                  title: 'Call Us',
                  details: ['+91 [XXXXX XXXXX]', 'Daily, 6:00 AM – 8:00 PM'],
                  color: 'bg-sky-500',
                },
                {
                  icon: Mail,
                  title: 'Email Us',
                  details: ['hello@vyshnavidairy.com', 'orders@vyshnavidairy.com'],
                  color: 'bg-blue-600',
                },
                {
                  icon: Clock,
                  title: 'Delivery Hours',
                  details: ['Morning delivery: 5:30 AM – 8:00 AM', 'Evening delivery: 5:00 PM – 7:00 PM'],
                  color: 'bg-slate-600',
                },
              ].map((item, index) => (
                <motion.div key={index} variants={staggerItem} className="group" whileHover={{ x: 10 }}>
                  <div className="flex items-start space-x-4 p-6 rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100">
                    <motion.div
                      className={`flex-shrink-0 p-3 rounded-xl ${item.color} text-white`}
                      whileHover={{
                        rotate: 360,
                        scale: 1.1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      <item.icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                      <div className="space-y-1">
                        {item.details.map((detail, idx) => (
                          <p key={idx} className="text-slate-600 text-sm md:text-base">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Social Media */}
            <motion.div variants={staggerItem} className="mt-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Connect & Follow</h3>
              <div className="flex space-x-4">
                {[
                  {
                    Icon: Facebook,
                    color: 'bg-blue-600',
                    hoverColor: 'hover:bg-blue-700',
                    href: 'https://facebook.com/vyshnavidairy',
                    label: 'Facebook',
                  },
                  {
                    Icon: Twitter,
                    color: 'bg-sky-500',
                    hoverColor: 'hover:bg-sky-600',
                    href: 'https://twitter.com/vyshnavidairy',
                    label: 'Twitter',
                  },
                  {
                    Icon: Instagram,
                    color: 'bg-pink-600',
                    hoverColor: 'hover:bg-pink-700',
                    href: 'https://instagram.com/vyshnavidairy',
                    label: 'Instagram',
                  },
                  {
                    Icon: Youtube,
                    color: 'bg-red-600',
                    hoverColor: 'hover:bg-red-700',
                    href: 'https://youtube.com/@vyshnavidairy',
                    label: 'YouTube',
                  },
                  {
                    Icon: Linkedin,
                    color: 'bg-blue-700',
                    hoverColor: 'hover:bg-blue-800',
                    href: 'https://linkedin.com/company/vyshnavi-dairy',
                    label: 'LinkedIn',
                  },
                ].map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className={`flex items-center justify-center w-14 h-14 rounded-full ${social.color} ${social.hoverColor} text-white transition-all duration-300`}
                    whileHover={{
                      y: -8,
                      scale: 1.2,
                      rotate: [0, -10, 10, 0],
                    }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <social.Icon className="h-6 w-6" strokeWidth={1.75} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div ref={formRef} initial="hidden" animate={formControls} variants={fadeInUp}>
            <div className="relative">
              {/* Glassmorphism Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-sky-50/80 backdrop-blur-sm rounded-3xl"></div>
              <div className="absolute inset-0 border border-white/20 rounded-3xl"></div>

              <div className="relative p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">
                    Let's Talk Dairy
                  </h2>
                  <p className="text-slate-600 mb-8">
                    Placing a bulk order, starting a subscription, or just have a question about
                    our products? Fill this in and our team will reach out.
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name / Business Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={name}
                      onChange={(e) => {
                        const value = e.target.value;
                        setName(value);
                        setErrors({
                          ...errors,
                          name: validateName(value),
                        });
                      }}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                      placeholder="Enter your name or business name"
                      disabled={isSubmitting}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => {
                          const value = e.target.value;
                          setEmail(value);
                          setErrors({
                            ...errors,
                            email: validateEmail(value),
                          });
                        }}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        placeholder="you@email.com"
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-slate-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setPhone(value);
                          setErrors({
                            ...errors,
                            phone: validatePhone(value),
                          });
                        }}
                        required
                        disabled={isSubmitting}
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                        placeholder="98765 43210"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                      )}
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label
                      htmlFor="service"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      What's This About?
                    </label>
                    <select
                      name="service"
                      id="service"
                      required
                      value={service}
                      onChange={(e) => {
                        setService(e.target.value);
                        setErrors({
                          ...errors,
                          service: !e.target.value ? "Please select what you're reaching out about" : '',
                        });
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    >
                      <option value="">Select an option</option>
                      <option value="A2 Ghee & Product Inquiry">A2 Ghee & Product Inquiry</option>
                      <option value="Milk Subscription">Milk Subscription / Home Delivery</option>
                      <option value="Bulk & Wholesale Orders">Bulk & Wholesale Orders</option>
                      <option value="Retail Store Inquiry">Retail Store Inquiry</option>
                      <option value="Corporate & Festival Gifting">Corporate & Festival Gifting</option>
                      <option value="Franchise & Distributorship">Franchise & Distributorship</option>
                      <option value="Quality Feedback">Quality Feedback</option>
                      <option value="Careers">Careers</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.service && (
                      <p className="mt-1 text-sm text-red-600">{errors.service}</p>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700 mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      name="message"
                      id="message"
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => {
                        const value = e.target.value;
                        setMessage(value);
                        setErrors({
                          ...errors,
                          message: validateMessage(value),
                        });
                      }}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
                      placeholder="Tell us what you need — order size, delivery area, or any questions about our products..."
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                    )}
                  </motion.div>

                  {feedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`p-4 rounded-xl ${
                        feedback.includes("sent")
                          ? "bg-green-50 text-green-800 border border-green-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {feedback}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg disabled:opacity-50 group"
                      whileHover={{
                        scale: 1.02,
                        boxShadow: '0 20px 40px rgba(6, 182, 212, 0.35)',
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <motion.div
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            />
                            <span>Sending...</span>
                          </div>
                        ) : (
                          'Send Message'
                        )}
                      </span>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500"
                        initial={{ x: '100%' }}
                        whileHover={{ x: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.button>
                  </motion.div>
                </form>

                {/* Additional Info */}
                <motion.div
                  className="mt-8 p-6 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-xl border border-sky-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Why Vyshnavi Dairy?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                      <span>Farm-fresh sourcing, daily</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                      <span>Hygienic, traditional processing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Reliable doorstep delivery</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-cyan-600 rounded-full"></div>
                      <span>No preservatives, ever</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map Section */}
      <motion.div
        ref={mapRef}
        initial="hidden"
        animate={mapControls}
        variants={fadeInUp}
        className="w-full h-96 bg-slate-100"
      >
        {/* Replace the src below with an embed URL for Vyshnavi Dairy's actual farm/store location */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3213.7516666666665!2d-86.8633333!3d35.9250000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDU1JzMwLjAiTiA4NsKwNTEnNDguMCJX!5e0!3m2!1sen!2sus!4v1699876543210!5m2!1sen!2sus"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Vyshnavi Dairy — Farm & Store Location"
        ></iframe>
      </motion.div>

      {/* Footer Section */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h3
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Taste the Purity, Every Single Day
          </motion.h3>
          <motion.p
            className="text-slate-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            From our farm to your family's table — join the Vyshnavi Dairy family today.
          </motion.p>
          <motion.div
            className="flex justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <motion.button
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start a Subscription
            </motion.button>
            <motion.button
              className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold py-3 px-8 rounded-full transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Browse Our Products
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;