'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ScrollAnimatedSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, 
    });
  }, []);

  return (
    <div className="p-8 bg-gray-100">
      <h2 data-aos="fade-up" className="text-3xl font-bold">
        I animate on scroll!
      </h2>

      <p data-aos="zoom-in" data-aos-delay="200" className="mt-4 text-lg">
        This paragraph zooms in when you scroll to it.
      </p>

      <div data-aos="flip-left" data-aos-duration="1500" className="mt-6 p-6 bg-white shadow-md">
        Fancy flip-left animation!
      </div>
    </div>
  );
};

export default ScrollAnimatedSection;
