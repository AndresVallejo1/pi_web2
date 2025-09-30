"use client";

import Link from "next/link";
import { FC, useState, useEffect, Fragment } from "react";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import { Menu, Transition } from "@headlessui/react";
import { Link as ScrollLink } from "react-scroll";

// Importamos TODOS los formularios que usaremos en los modales
import LoginForm from "@/components/auth/LoginForm";
import BarberLoginForm from "@/components/auth/BarberLoginForm"; // <-- El nuevo

const Navbar: FC = () => {
  // Un estado más descriptivo para saber qué modal abrir
  const [modalView, setModalView] = useState<"client-login" | "client-register" | "barber-login" | null>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      setModalView(null); // Cierra cualquier modal si el usuario ya inició sesión
    }
  }, [isSignedIn]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-blue-900 shadow-md px-6 py-4 flex justify-between items-center z-50">
      <Link href="/"><img src="/Images/Logo.png" alt="Logo de la página" className="h-10 w-auto" /></Link>

      <ul className="flex space-x-6 text-white/90 font-medium items-center">
        {/* ... tus links de navegación ... */}
        <li><Link href="/" className="hover:text-white transition-colors">Nosotros</Link></li>
        <li><Link href="/services" className="hover:text-white transition-colors">Servicios</Link></li>
        <li><Link href="/#calendario" className="hover:text-white transition-colors">Citas</Link></li>
        <li><Link href="#mapa" className="hover:text-white transition-colors">Sedes</Link></li>
        <li><ScrollLink to="contacto" smooth duration={600} offset={-50} className="hover:text-white transition-colors cursor-pointer">Contacto</ScrollLink></li>

        <SignedOut>
          <Menu as="li" className="relative">
            <div>
              <Menu.Button className="bg-blue-300 text-blue-900 px-4 py-2 rounded-lg hover:bg-blue-200">Ingresar</Menu.Button>
            </div>
            <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
              <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={() => setModalView("client-login")} className={`${active ? "bg-gray-100" : ""} text-gray-700 block w-full text-left px-4 py-2 text-sm`}>
                        Soy Cliente
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      // CAMBIO IMPORTANTE: Ahora abre el modal del barbero
                      <button onClick={() => setModalView("barber-login")} className={`${active ? "bg-gray-100" : ""} text-gray-700 block w-full text-left px-4 py-2 text-sm`}>
                        Soy Barbero
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </SignedOut>

        <SignedIn>
          <li><UserButton afterSignOutUrl="/" /></li>
        </SignedIn>
      </ul>

      {/* --- MODALES --- */}
      <SignedOut>
        {modalView && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[60]">
            <div className="relative bg-white rounded-lg shadow-lg">
              <button onClick={() => setModalView(null)} className="absolute top-2 right-2 text-gray-500 hover:text-black text-2xl">✕</button>

              {/* Muestra el formulario correcto según el estado */}
              {modalView === "client-login" && (
                <div className="p-8">
                  <LoginForm />
                  <p className="text-center text-sm mt-4">¿No tienes cuenta? <button onClick={() => setModalView("client-register")} className="font-semibold text-blue-600 hover:underline">Regístrate</button></p>
                </div>
              )}
              {modalView === "client-register" && (
                <div className="p-8">
                  <LoginForm />
                  <p className="text-center text-sm mt-4">¿Ya tienes cuenta? <button onClick={() => setModalView("client-login")} className="font-semibold text-blue-600 hover:underline">Inicia Sesión</button></p>
                </div>
              )}
              {modalView === "barber-login" && <BarberLoginForm />}
            </div>
          </div>
        )}
      </SignedOut>
    </nav>
  );
};

export default Navbar;