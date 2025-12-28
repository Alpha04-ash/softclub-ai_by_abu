'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo, useSpring, useTransform, useMotionValue } from 'framer-motion';
import Image from 'next/image';

interface Subject {
  subject: string;
  questions: any[];
}

interface LanguageCarouselProps {
  subjects: Subject[];
  onSelect: (subject: any) => void;
}

const subjectsData = [
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg', color: 'rgba(247, 223, 30, 0.2)' },
  { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', color: 'rgba(0, 122, 204, 0.2)' },
  { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', color: 'rgba(55, 118, 171, 0.2)' },
  { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg', color: 'rgba(155, 79, 150, 0.2)' },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg', color: 'rgba(2, 175, 241, 0.2)' },
  { name: 'C++', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg', color: 'rgba(0, 89, 156, 0.2)' },
];

export default function LanguageCarousel({ subjects, onSelect }: LanguageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentIndex < subjects.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  return (
    <div className="relative w-full h-[550px] flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-5xl h-full flex items-center justify-center">
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          <AnimatePresence mode="popLayout">
            {subjects.map((subject, index) => {
              const offset = index - currentIndex;
              const absOffset = Math.abs(offset);
              
              if (absOffset > 2) return null;

              const data = subjectsData.find(s => s.name === subject.subject);

              return (
                <motion.div
                  key={subject.subject}
                  initial={{ opacity: 0, scale: 0.5, x: offset * 300 }}
                  animate={{
                    opacity: 1 - absOffset * 0.4,
                    scale: 1 - absOffset * 0.18,
                    x: offset * 350, // More spacious horizontal spread
                    y: absOffset * 60, // Refined curve
                    rotateY: offset * -40,
                    z: -absOffset * 150,
                    zIndex: 10 - absOffset,
                  }}
                  exit={{ opacity: 0, scale: 0.5, x: offset * 400 }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                  className="absolute w-80 h-[420px]" // Larger, more balanced card size
                  onClick={() => absOffset === 0 && onSelect(subject.subject)}
                >
                  <div className={`w-full h-full glass rounded-[40px] p-10 flex flex-col items-center justify-center border border-white/10 shadow-2xl transition-all duration-500 ${absOffset === 0 ? 'ring-2 ring-primary/20 bg-white/[0.04]' : 'bg-white/[0.02]'}`}>
                    
                    {/* Glowing background for active card */}
                    {absOffset === 0 && (
                      <div 
                        className="absolute inset-0 rounded-[40px] blur-3xl opacity-20 -z-10 transition-colors duration-500"
                        style={{ backgroundColor: data?.color }}
                      />
                    )}

                    <div className="relative w-36 h-36 mb-10">
                      <Image
                        src={data?.icon || ''}
                        alt={subject.subject}
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                      />
                    </div>
                    
                    <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">
                      {subject.subject}
                    </h2>
                    <p className="text-blue-200/40 font-semibold tracking-wider uppercase text-xs">
                      {subject.questions.length} QUESTIONS
                    </p>
                    
                    {absOffset === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 px-8 py-2.5 bg-primary rounded-full text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                      >
                        SELECT
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation Indicators */}
      <div className="absolute bottom-6 flex gap-3">
        {subjects.map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              width: i === currentIndex ? 32 : 8,
              backgroundColor: i === currentIndex ? '#3b82f6' : 'rgba(255,255,255,0.2)'
            }}
            className="h-2 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
