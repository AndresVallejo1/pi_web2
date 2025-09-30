import Image from 'next/image';
import React from 'react';

// Interface para las sedes
interface Sede {
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
}

export default function Footer() {
  // Datos de las sedes correctos
  const sedes: Sede[] = [
    {
      nombre: "Sede C.C Puerta del Norte",
      direccion: "Autopista Nte. #34-67, Bello, Antioquia",
      telefono: "+57 300 123 4567",
      horario: "Lun-Sab: 9:00 AM - 8:00 PM"
    },
    {
      nombre: "Sede C.C Parque Fabricato",
      direccion: "Cra. 50 #38a-185, Bello, Antioquia",
      telefono: "+57 300 123 4568",
      horario: "Lun-Sab: 9:00 AM - 8:00 PM"
    },
    {
      nombre: "Sede C.C La Central",
      direccion: "Cl. 49B #21-38, Medellín, Antioquia",
      telefono: "+57 300 123 4569",
      horario: "Lun-Sab: 9:00 AM - 8:00 PM"
    },
    {
      nombre: "Sede C.C Los Molinos",
      direccion: "Cl. 30A #82A-26, Medellín, Antioquia",
      telefono: "+57 300 123 4570",
      horario: "Lun-Sab: 9:00 AM - 8:00 PM"
    },
    {
      nombre: "Sede C.C Santafé",
      direccion: "Carrera 43A, Cl. 7 Sur #170, Medellín",
      telefono: "+57 300 123 4571",
      horario: "Lun-Sab: 9:00 AM - 8:00 PM"
    },
    {
      nombre: "Sede C.C Premium Plaza",
      direccion: "Cra. 43A #30-25, Medellín, Antioquia",
      telefono: "+57 300 123 4572",
      horario: "Lun-Sab: 9:00 AM - 8:00 PM"
    }
  ];

  return (
    // El contenedor principal del footer mantiene el fondo azul oscuro por defecto
    <footer className="bg-blue-950 text-white">
      {/* Sección del Mapa */}
      <section id="mapa" className="content mapa scroll-mt-24">
        <iframe
          title="Sedes Kingdom Barber"
          src="https://www.google.com/maps/d/embed?mid=1AQAwtmEsO5XweBQcXXGe7A5l-frhDpA&ehbc=2E312F"
          width="100%"
          height="300"
          loading="lazy"
          className="w-full border-0"
        />
      </section>

      {/* --- SECCIÓN DE SEDES CON TEMA CLARO --- */}
      <section className="py-8 px-4 bg-white text-gray-800 border-t border-b border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Nuestras Sedes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
            {sedes.map((sede, index) => (
              <div 
                key={index} 
                className="bg-gray-100 p-4 rounded-lg hover:bg-gray-200 transition-colors duration-300 border border-gray-200"
              >
                <h4 className="font-bold text-lg mb-2 text-gray-900">
                  {sede.nombre}
                </h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-start">
                    <span className="mr-2">📍</span>
                    {sede.direccion}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📞</span>
                    {sede.telefono}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">🕒</span>
                    {sede.horario}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- INFORMACIÓN DE CONTACTO CON TEMA OSCURO --- */}
      <section className="py-6 bg-blue-950 border-t border-blue-700">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <h4 className="font-bold text-lg mb-2">Kingdom Barber</h4>
              <p className="text-blue-200">Tu estilo, nuestra pasión</p>
            </div>
            <div className="text-center">
              <p className="text-blue-200">📧 info@kingdombarber.com</p>
              <p className="text-blue-200">🌐 www.kingdombarber.com</p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-blue-200">Síguenos en redes sociales</p>
              <div className="flex justify-center md:justify-end gap-4 mt-2">
                <a 
                  href="https://wa.me/573001234567" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
                >
                  <Image 
                    src="/Images/logowpp.png"
                    alt="WhatsApp Kingdom Barber"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
                <a 
                  href="https://instagram.com/kingdombarber" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
                >
                  <Image 
                    src="/images/logoigg.png"
                    alt="Instagram Kingdom Barber"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
                <a 
                  href="https://github.com/kingdombarber" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:opacity-80 transition-opacity duration-300"
                >
                  <Image 
                    src="/images/logogit.png"
                    alt="GitHub Kingdom Barber"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copyright */}
      <div className="text-center py-4 bg-blue-950 border-t border-blue-800">
        <p className="text-blue-300">
          Kingdom Barber ® {new Date().getFullYear()} | Todos los derechos reservados
        </p>
      </div>
    </footer>
  );
}