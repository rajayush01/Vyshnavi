import { MapPin, Phone, Mail, Clock, Shield, Award } from 'lucide-react';
import logo from "../../assets/logo.png";

const productLinks = ["Milk", "Curd", "Buttermilk", "Lassi", "Ghee", "Paneer", "Sweets", "View All"];
const investorLinks = [
  "Listing Information",
  "Investor Contacts",
  "Quarterly Financials",
  "Share Ownership",
  "Annual Reports",
  "Research Reports",
  "Policies",
];

export default function Footer() {
  return (
    <footer className="relative bg-[#e0f2fe] pt-0 overflow-hidden">
      {/* Wave transition from the section above */}
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-12 block -mb-px" aria-hidden="true">
        <path d="M0,32 Q360,72 720,32 T1440,32 L1440,0 L0,0 Z" fill="#ffffff" />
      </svg>

      {/* Decorative ambient glow */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <img src={logo} alt="Vyshnavi Dairy" className="h-12 mb-5" />
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
              Pure, farm-fresh dairy delivered daily — crafted for households who
              taste the difference.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>Konijarla Mandalam, Khammam – 507165, Telangana</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <a href="tel:+910000000000" className="hover:text-blue-600 transition-colors">+91 00000 00000</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <a href="mailto:hello@vyshnavidairy.com" className="hover:text-blue-600 transition-colors">hello@vyshnavidairy.com</a>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-slate-900 font-bold mb-5 text-xs tracking-[0.2em] uppercase">
              Products
            </h3>
            <ul className="space-y-2.5 text-sm">
              {productLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Investors */}
          <div>
            <h3 className="text-slate-900 font-bold mb-5 text-xs tracking-[0.2em] uppercase">
              Investors
            </h3>
            <ul className="space-y-2.5 text-sm">
              {investorLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Location */}
          <div>
            <h3 className="text-slate-900 font-bold mb-5 text-xs tracking-[0.2em] uppercase">
              Store Location
            </h3>
            <div className="text-slate-500 text-sm leading-relaxed space-y-4">
              <p>Konijarla, Wyra,<br />Khammam.</p>
              <div className="pt-1 border-t border-blue-100/70">
                <p className="font-semibold text-slate-800 mt-4 mb-1">Dairy Location</p>
                <p>Konijarla (M)<br />Wyra, Khammam.<br />Telangana.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-blue-100/70">
            <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">Lab-Tested Purity</p>
              <p className="text-xs text-slate-500">Every batch, every time</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-blue-100/70">
            <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">Delivered Fresh Daily</p>
              <p className="text-xs text-slate-500">Farm to doorstep in 6 hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl px-5 py-4 border border-blue-100/70">
            <span className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Award className="w-5 h-5" />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-800">Trusted Quality</p>
              <p className="text-xs text-slate-500">Certified & family-approved</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-100/70 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-sm text-slate-500">
            Copyright © 2025 Vyshnavi Foods. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Designed by <span className="font-semibold text-slate-500">Elite8Digital</span>
          </p>
        </div>
      </div>
    </footer>
  );
}