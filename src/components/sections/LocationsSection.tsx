"use client";

import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface LocationsSectionProps {
  lang: string;
}

export default function LocationsSection({ lang }: LocationsSectionProps) {
  const isJapanese = lang === 'ja';
  
  // Location data
  const locations = [
    {
      name: isJapanese ? '東京本社' : 'Tokyo Headquarters',
      address: isJapanese ? '〒123-4567 東京都新宿区西新宿1-1-1' : '1-1-1 Nishi-Shinjuku, Shinjuku-ku, Tokyo 123-4567, Japan',
      phone: '+81-3-1234-5678',
      email: 'tokyo@ajwa.co.jp',
      hours: isJapanese ? '平日 9:00〜17:00' : 'Mon-Fri 9:00-17:00',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.828030384253!2d139.6917!3d35.689506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60188cd4b71a37a1%3A0xf1665c37f38661e8!2sShinjuku%20Station!5e0!3m2!1sen!2sjp!4v1635000000000!5m2!1sen!2sjp"
    },
    {
      name: isJapanese ? '大阪支店' : 'Osaka Branch',
      address: isJapanese ? '〒530-0001 大阪府大阪市北区梅田2-2-2' : '2-2-2 Umeda, Kita-ku, Osaka 530-0001, Japan',
      phone: '+81-6-1234-5678',
      email: 'osaka@ajwa.co.jp',
      hours: isJapanese ? '平日 9:00〜17:00' : 'Mon-Fri 9:00-17:00',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.2997346964195!2d135.4937!3d34.702485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e68d95e3a70b%3A0x1baec822e859c84a!2sOsaka%20Station!5e0!3m2!1sen!2sjp!4v1635000000000!5m2!1sen!2sjp"
    },
    {
      name: isJapanese ? '名古屋支店' : 'Nagoya Branch',
      address: isJapanese ? '〒450-0002 愛知県名古屋市中村区名駅3-3-3' : '3-3-3 Meieki, Nakamura-ku, Nagoya 450-0002, Japan',
      phone: '+81-52-1234-5678',
      email: 'nagoya@ajwa.co.jp',
      hours: isJapanese ? '平日 9:00〜17:00' : 'Mon-Fri 9:00-17:00',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.7613126767324!2d136.8815!3d35.170915!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x600376e794d78b89%3A0x81f7204bf8261663!2sNagoya%20Station!5e0!3m2!1sen!2sjp!4v1635000000000!5m2!1sen!2sjp"
    },
    {
      name: isJapanese ? '福岡支店' : 'Fukuoka Branch',
      address: isJapanese ? '〒812-0012 福岡県福岡市博多区博多駅中央街4-4-4' : '4-4-4 Hakata-ekichuogai, Hakata-ku, Fukuoka 812-0012, Japan',
      phone: '+81-92-1234-5678',
      email: 'fukuoka@ajwa.co.jp',
      hours: isJapanese ? '平日 9:00〜17:00' : 'Mon-Fri 9:00-17:00',
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.706443073624!2d130.4183!3d33.590034!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x354191c73622ce65%3A0x47c72b2e22f0c974!2sHakata%20Station!5e0!3m2!1sen!2sjp!4v1635000000000!5m2!1sen!2sjp"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            {isJapanese ? '拠点一覧' : 'Our Locations'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {isJapanese 
              ? '日本全国に広がる拠点ネットワークを通じて、お客様に最適なサービスを提供しています。' 
              : 'We provide optimal services to our customers through our nationwide network of locations.'}
          </p>
        </div>

        {/* Maps Row - All maps in one row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {locations.map((location, index) => (
            <motion.div 
              key={`map-${index}`}
              className="bg-white shadow-sm rounded-lg overflow-hidden h-40"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <iframe 
                src={location.mapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title={location.name}
              ></iframe>
            </motion.div>
          ))}
        </div>
        
        {/* Information Row - Location details underneath */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {locations.map((location, index) => (
            <motion.div 
              key={`info-${index}`}
              className="bg-white shadow-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
              viewport={{ once: true }}
            >
              <h3 className="text-base font-bold text-gray-800 mb-3 border-b pb-2">{location.name}</h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0 mr-2" />
                  <span className="text-gray-700">{location.address}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="h-4 w-4 text-blue-600 flex-shrink-0 mr-2" />
                  <a href={`tel:${location.phone}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                    {location.phone}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-blue-600 flex-shrink-0 mr-2" />
                  <a href={`mailto:${location.email}`} className="text-gray-700 hover:text-blue-600 transition-colors">
                    {location.email}
                  </a>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 flex-shrink-0 mr-2" />
                  <span className="text-gray-700">{location.hours}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
