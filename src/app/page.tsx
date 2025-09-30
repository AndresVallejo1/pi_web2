"use client";
import Image from "next/image";
import ContactSection from "@/components/contactform/ContactForm";
import AppointmentsCalendar from "@/components/appointment/AppointmentCalendar";
import ServicesAccordion from "@/components/services/services";
export default function HomePage() {
  return (
    <main>
      {/* HERO full-screen con imagen */}
      <section id="hero" className="relative isolate w-full min-h-screen flex items-center pt-24">
        <Image
          src="/Images/fondo-barberia.jpg"
          alt="Barbería"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/60" />
        <div className="relative z-10 mx-auto max-w-screen-xl px-6 text-center text-white">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm backdrop-blur ring-3 ring-white/20">
            💈 Kingdom Barber
          </span>
          <h1 className="mt-6 text-4xl sm:text-6xl font-extrabold leading-tight tracking-tight drop-shadow">
            Eleva tu estilo, gobierna tu imagen
          </h1>
          <p className="mt-4 text-base sm:text-lg text-white/85">
            Un espacio donde tradición, excelencia y modernidad se unen para que vivas una experiencia única.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="#citas" className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30">
              Agendar cita
            </a>
            <a href="#servicios" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white ring-1 ring-white/30 backdrop-blur">
              Ver servicios
            </a>
          </div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm animate-bounce">
          Desliza para ver más
        </div>
      </section>
      {/* Servicios */}
      <section id="servicios" className="scroll-mt-24 py-16">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <div className="w-full rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
            <ServicesAccordion />
          </div>
        </div>
      </section>

      {/* Citas */}
      <section id="calendario" className="scroll-mt-24 py-16">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Reserva tu cita</h2>
          <div className="w-full rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
            <AppointmentsCalendar />
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="scroll-mt-24 py-16">
        <div className="mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Contáctanos</h2>
          <div className="w-full rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-4 sm:p-6">
            <ContactSection />
          </div>
        </div>
      </section>
    </main>
  );
}