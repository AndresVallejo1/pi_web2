"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

type Option = { name: string; price: string };

type Service = {
  id: number;
  title: string;
  image: string;
  details: string;
  options: Option[];
};

const servicios: Service[] = [
    {
      id: 201,
      title: "Corte Premium",
      image: "/images/premium.png",
      details: "Un servicio de Corte Premium con una duración aproximada de 45 minutos.",
      options: [{ name: "Corte Premium", price: "$25.000" }],
    },
    {
      id: 202,
      title: "Afeitado Clásico",
      image: "/images/afeitado.jpg",
      details: "Un servicio de Afeitado Clásico con una duración aproximada de 30 minutos.",
      options: [{ name: "Afeitado Clásico", price: "$18.000" }],
    },
    {
      id: 203,
      title: "Arreglo de Barba",
      image: "/images/barba.jpg",
      details: "Un servicio de Arreglo de Barba con una duración aproximada de 25 minutos.",
      options: [{ name: "Arreglo de Barba", price: "$15.000" }],
    },
    {
      id: 204,
      title: "Ritual Completo (Corte + Barba)",
      image: "/images/completo.jpeg",
      details: "Un servicio de Ritual Completo (Corte + Barba) con una duración aproximada de 70 minutos.",
      options: [{ name: "Ritual Completo", price: "$40.000" }],
    },
    {
      id: 205,
      title: "Corte Clásico",
      image: "/images/corte-clasico.jpg",
      details: "Un servicio de Corte Clásico con una duración aproximada de 40 minutos.",
      options: [{ name: "Corte Clásico", price: "$20.000" }],
    },
    {
      id: 206,
      title: "Corte Infantil",
      image: "/images/infantil.jpg",
      details: "Un servicio de Corte Infantil con una duración aproximada de 30 minutos.",
      options: [{ name: "Corte Infantil", price: "$15.000" }],
    },
    {
      id: 207,
      title: "Perfilado de Cejas",
      image: "/images/perfilado.jpeg",
      details: "Un servicio de Perfilado de Cejas con una duración aproximada de 15 minutos.",
      options: [{ name: "Perfilado de Cejas", price: "$12.000" }],
    },
    {
      id: 208,
      title: "Limpieza Facial Express",
      image: "/images/express.jpg",
      details: "Un servicio de Limpieza Facial Express con una duración aproximada de 25 minutos.",
      options: [{ name: "Limpieza Facial Express", price: "$22.000" }],
    },
    {
      id: 209,
      title: "Limpieza Facial Profunda",
      image: "/images/limpiezap.jpg",
      details: "Un servicio de Limpieza Facial Profunda con una duración aproximada de 50 minutos.",
      options: [{ name: "Limpieza Facial Profunda", price: "$35.000" }],
    },
    {
      id: 210,
      title: "Coloración de Barba",
      image: "/images/colorb.jpg",
      details: "Un servicio de Coloración de Barba con una duración aproximada de 30 minutos.",
      options: [{ name: "Coloración de Barba", price: "$18.000" }],
    },
    {
      id: 211,
      title: "Tinte Capilar",
      image: "/images/color.jpg",
      details: "Un servicio de Tinte Capilar con una duración aproximada de 45 minutos.",
      options: [{ name: "Tinte Capilar", price: "$30.000" }],
    },
    {
      id: 212,
      title: "Masaje Capilar Relajante",
      image: "/images/masajec.jpg",
      details: "Un servicio de Masaje Capilar Relajante con una duración aproximada de 20 minutos.",
      options: [{ name: "Masaje Capilar Relajante", price: "$20.000" }],
    },
    {
      id: 213,
      title: "Exfoliación Facial",
      image: "/images/exfoliacion.jpg",
      details: "Un servicio de Exfoliación Facial con una duración aproximada de 30 minutos.",
      options: [{ name: "Exfoliación Facial", price: "$28.000" }],
    },
    {
      id: 214,
      title: "Tratamiento Capilar Nutritivo",
      image: "/images/tratamiento.jpg",
      details: "Un servicio de Tratamiento Capilar Nutritivo con una duración aproximada de 50 minutos.",
      options: [{ name: "Tratamiento Capilar Nutritivo", price: "$40.000" }],
    },
    {
      id: 215,
      title: "Paquete Ejecutivo (Corte + Barba + Facial)",
      image: "/images/paquete.jpg",
      details: "Un servicio de Paquete Ejecutivo con una duración aproximada de 90 minutos.",
      options: [{ name: "Paquete Ejecutivo", price: "$60.000" }],
    },
];

export default function ServiciosPage() {
  const [detalle, setDetalle] = useState<Service | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetalle(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  return (
    <main id="services" className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-16 md:pt-20">
        <div className="max-w-7xl mx-auto">
          <div className="bg-blue-50 ring-1 ring-blue-100 rounded-2xl p-10 md:p-12 text-center shadow-sm">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-blue-900">
              Nuestros Servicios 💈
            </h1>
            <p className="mt-3 text-blue-900/70 max-w-2xl mx-auto">
              Estilo, precisión y una experiencia premium pensada para ti.
            </p>
          </div>
        </div>
      </section>

      {/* Lista de servicios */}
      <section className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        {servicios.map((servicio: Service) => (
          <div
            key={servicio.id}
            className="group bg-white rounded-2xl shadow-sm ring-1 ring-gray-200 hover:shadow-xl hover:ring-blue-200 transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 p-0 md:p-6 items-stretch">
              {/* Imagen */}
              <div className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden rounded-t-2xl md:rounded-2xl">
                <Image
                  src={servicio.image}
                  alt={servicio.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority={servicio.id === 201}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              {/* Info */}
              <div className="p-6 md:pl-0 flex flex-col">
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
                  {servicio.title}
                </h2>

                <ul className="mt-4 divide-y divide-gray-100">
                  {servicio.options.map((option: Option, idx: number) => (
                    <li key={idx} className="py-3 flex items-center justify-between">
                      <span className="text-gray-700">{option.name}</span>
                      <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-semibold">
                        {option.price}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex items-center gap-3 flex-wrap">
                  <Link
                    href="/#calendario"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                    aria-label={`Ir al calendario para agendar ${servicio.title}`}
                  >
                    Agendar cita
                  </Link>
                  <Link
                    href="/#calendario"
                    className="px-6 py-3 rounded-lg font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200"
                  >
                    Ver disponibilidad
                  </Link>
                  <button
                    onClick={() => setDetalle(servicio)}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
                    aria-haspopup="dialog"
                    aria-expanded={Boolean(detalle && detalle.id === servicio.id)}
                  >
                    Detalles
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Modal Detalles */}
      {detalle && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          aria-labelledby="detalle-title"
          role="dialog"
          aria-modal="true"
          onClick={() => setDetalle(null)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          <div
            className="relative z-10 w-full sm:max-w-lg mx-auto bg-white rounded-2xl shadow-xl ring-1 ring-gray-200 p-6 m-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-gray-200 shrink-0">
                <Image src={detalle.image} alt={detalle.title} fill className="object-cover" />
              </div>
              <div>
                <h4 id="detalle-title" className="text-xl font-semibold text-gray-900">
                  {detalle.title}
                </h4>
                <p className="mt-2 text-gray-700">{detalle.details}</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2">
              {detalle.options.map((op: Option, i: number) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="text-gray-700">{op.name}</span>
                  <span className="text-blue-700 font-semibold">{op.price}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDetalle(null)}
                className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cerrar
              </button>
              <Link
                href="/#calendario"
                onClick={() => setDetalle(null)}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Reservar
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}