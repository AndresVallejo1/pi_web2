"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// --- LISTA DE SERVICIOS RELEVANTES ACTUALIZADA ---
const services = [
  { 
    id: 201, 
    title: "Corte Premium", 
    description: "Asesoría de estilo para un look impecable y de alta calidad.", 
    image: "/images/premium.png" 
  },
  { 
    id: 204, 
    title: "Ritual Completo", 
    description: "La experiencia completa: un corte preciso y un arreglo de barba profesional.", 
    image: "/images/completo.jpeg" 
  },
  { 
    id: 202, 
    title: "Afeitado Clásico", 
    description: "Relájate con el ritual de toalla caliente, navaja y productos de primera.", 
    image: "/images/afeitado.jpg" 
  },
  { 
    id: 209, 
    title: "Limpieza Facial", 
    description: "Revitaliza tu piel con una limpieza profunda y productos especializados.", 
    image: "/images/limpiezap.jpg" 
  },
  { 
    id: 215, 
    title: "Paquete Ejecutivo", 
    description: "El paquete definitivo: corte, barba y tratamiento facial para un look renovado.", 
    image: "/images/paquete.jpg" 
  },
];

export default function ServicesAccordion() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="servicios" className="w-full bg-gradient-to-b from-gray-50 via-gray-50 to-gray-100 text-neutral-900 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-neutral-900">Nuestros Servicios</h2>
          <p className="text-neutral-600 mt-2">Calidad premium, estilo y detalle en cada atención.</p>
        </header>
        
        {/* --- VISTA PARA ESCRITORIO (ANIMADA) --- */}
        <div className="hidden md:flex w-full h-[420px] gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="relative flex-1 rounded-2xl overflow-hidden cursor-pointer shadow-lg ring-1 ring-gray-200/80 bg-white"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => setActive(null)}
              role="button"
              tabIndex={0}
              aria-label={service.title}
              aria-expanded={active === index}
              animate={{ flex: active === index ? 3 : 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform" }}
            >
              <Image src={service.image} alt={service.title} fill className="object-cover" sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" priority={index === 0} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-xl font-bold text-white drop-shadow">{service.title}</h3>
              </div>

              <AnimatePresence>
                {active === index && (
                  <motion.div
                    key="overlay"
                    className="absolute inset-0 flex items-end p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="w-full bg-black/35 backdrop-blur-sm rounded-xl p-5 ring-1 ring-white/20">
                      <h3 className="text-2xl md:text-3xl font-extrabold mb-2 text-white">{service.title}</h3>
                      <p className="text-sm md:text-base text-white/80 max-w-lg">{service.description}</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link href="/#calendario" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                          Reservar ahora
                        </Link>
                        <Link href="/services" className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2 rounded-lg transition">
                          Ver detalles
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        {/* --- VISTA PARA MÓVIL --- */}
        <div className="md:hidden space-y-5">
          {services.map((service, index) => (
            <div key={service.id} className="relative h-72 rounded-2xl overflow-hidden shadow-md ring-1 ring-gray-200 bg-white">
              <Image src={service.image} alt={service.title} fill className="object-cover" sizes="100vw" priority={index === 0} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
                <p className="text-sm text-white/80 mt-1">{service.description}</p>
                <div className="mt-3 flex gap-3">
                  <Link href="/#calendario" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition">
                    Reservar
                  </Link>
                  <Link href="/services" className="bg-white/15 hover:bg-white/25 text-white font-semibold px-4 py-2 rounded-lg transition">
                    Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Link href="/services" className="inline-flex items-center bg-blue-600 text-white hover:bg-blue-700 font-semibold px-6 py-3 rounded-xl shadow-md transition ring-1 ring-blue-600/10">
            Todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}