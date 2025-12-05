import React from 'react';
import { motion } from 'framer-motion';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "SecureVoteX ensures complete electoral transparency with its immutable blockchain ledger and real-time audit trails.",
      author: "Dr. Gyanesh Kumar",
      role: "Chief Election Commission ",
      rating: 5,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      quote: "Ideal for universities, corporates, and digital governance. The AI-powered face verification eliminates identity fraud completely.",
      author: "Mrs. Dimpy Singh",
      role: "Assistant Professor, JECRC University ",
      rating: 5,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      quote: "The fusion of biometric authentication and blockchain technology makes electoral fraud virtually impossible. A game-changer for democracy.",
      author: "Mr. Tushar Vyas",
      role: "Cybersecurity Consultant",
      rating: 5,
      gradient: 'from-green-500 to-teal-500'
    },
    {
      quote: "Exceptional user experience combined with enterprise-grade security. The cryptographic receipts provide voters with complete confidence.",
      author: "Dr. Gajanand Sharma",
      role: "HOD(CSE), JECRC University",
      rating: 5,
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="relative py-24 px-6 bg-gradient-to-b from-navy-900 to-navy-800">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-neon-aqua via-neon-blue to-neon-purple bg-clip-text text-transparent">
            Trusted by Leaders
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hear what industry experts say about SecureVoteX
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              whileHover={{ y: -10 }}
            >
              <div className="backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-300 h-full relative overflow-hidden">
                {/* Background Glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${testimonial.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Quote Icon */}
                <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4 relative">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      className="text-yellow-400 text-xl"
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.15 + i * 0.1 }}
                    >
                      ⭐
                    </motion.span>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6 relative italic">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-xl font-bold">
                      {testimonial.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className={`absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl ${testimonial.gradient} opacity-10 rounded-tl-full`}></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div
          className="mt-16 flex flex-wrap justify-center gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          {['🔒 ISO 27001 Compliant', '✅ SOC 2 Certified', '🛡️ GDPR Ready', '⚡ 99.9% Uptime'].map((badge, index) => (
            <motion.div
              key={index}
              className="backdrop-blur-sm bg-white/5 px-6 py-3 rounded-full border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-white text-sm font-semibold">{badge}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
