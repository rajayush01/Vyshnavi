import { MapPin, Phone, Mail, Clock, Shield, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#e0f2fe] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Address Section */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm tracking-wide">
              ADDRESS
            </h3>
            <address className="not-italic text-gray-600 text-sm leading-relaxed">
              <p>Konijarla Mandalam,</p>
              <p>Gundarathi Madugu Village,</p>
              <p>Near Ayyappa Swamy Temple.</p>
              <p>Khammam – 507165</p>
              <p>Telangana.</p>
            </address>
          </div>

          {/* Products Section */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm tracking-wide">
              PRODUCTS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Milk
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Curd
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Buttermilk
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Lassi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Ghee
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Paneer
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Sweets
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  View All
                </a>
              </li>
            </ul>
          </div>

          {/* Investors Section */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm tracking-wide">
              INVESTORS
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Listing Information
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Investor Contacts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Quarterly Financials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Share Ownership
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Annual Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Research Reports
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Policies
                </a>
              </li>
            </ul>
          </div>

          {/* Store Location Section */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4 text-sm tracking-wide">
              STORE LOCATION
            </h3>
            <div className="text-gray-600 text-sm leading-relaxed space-y-4">
              <p>Konijarla,Wyra,</p>
              <p>Khammam.</p>
              <div className="mt-4">
                <p className="font-semibold text-gray-800 mb-1">DAIRY LOCATION</p>
                <p>Konijarla (M)</p>
                <p>Wyra,Khammam.</p>
                <p>Telangana.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
          <p>
            Copyright © 2025. Vyshnavi Foods . Designed by Elite8Digital
          </p>
        </div>
      </div>
    </footer>
  );
}
