"use client";
import { useMemo, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Calendar, dateFnsLocalizer, Views, View } from "react-big-calendar";
import { format, parse, startOfWeek as dfStartOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import type { Locale } from "date-fns";
import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// --- Definiciones de tipos para nuestros datos ---
interface Sede {
  ID_Sede: string;
  Nombre_Sede: string;
}
interface Barbero {
  ID_Barbero: string;
  Nombre_Barbero: string;
  Apellido_Barbero: string;
  ID_Sede: string;
}
interface Servicio {
  ID_Servicio: string;
  Nombre_Servicio: string;
  Precio: string;
  Duracion_min: string;
}

// --- Actualizamos el tipo de evento para incluir más detalles ---
type AppointmentEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  userId: string;
  sedeId: string;
  barberoId: string;
  servicioIds: string[];
};

const cn = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");
const locales: Record<string, Locale> = { es };
const localizer = dateFnsLocalizer({
  format, parse,
  startOfWeek: (date: Date) => dfStartOfWeek(date, { weekStartsOn: 1 }),
  getDay, locales,
});

type ToastType = "success" | "error" | "info";

type ToolbarProps = {
  label: string;
  onNavigate: (a: "PREV" | "NEXT" | "TODAY" | "DATE") => void;
  onView: (v: View) => void;
  view: View;
};

const Toolbar = ({ label, onNavigate, onView, view }: ToolbarProps) => {
  const btn = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  return (
    <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        <button onClick={() => onNavigate("PREV")} className={cn(btn, "bg-blue-50 text-blue-700 hover:bg-blue-100")}>← Anterior</button>
        <button onClick={() => onNavigate("TODAY")} className={cn(btn, "bg-blue-600 text-white hover:bg-blue-700")}>Hoy</button>
        <button onClick={() => onNavigate("NEXT")} className={cn(btn, "bg-blue-50 text-blue-700 hover:bg-blue-100")}>Siguiente →</button>
      </div>
      <div className="text-center text-lg font-semibold text-gray-800">{label}</div>
      <div className="flex items-center gap-2">
        <button onClick={() => onView(Views.DAY)} className={cn(btn, view === Views.DAY ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>Día</button>
        <button onClick={() => onView(Views.WEEK)} className={cn(btn, view === Views.WEEK ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>Semana</button>
        <button onClick={() => onView(Views.MONTH)} className={cn(btn, view === Views.MONTH ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200")}>Mes</button>
      </div>
    </div>
  );
};

const generateEventTitle = (cita: any, barberos: Barbero[], userId: string | undefined): string => {
  // Adaptado para funcionar con ambos formatos de datos (del frontend y del backend)
  const barberoId = cita.ID_Barbero || cita.barberoId || cita.barberId;
  const clienteId = cita.ID_Cliente || cita.userId || cita.clienteId;
  
  const barbero = barberos.find(b => b.ID_Barbero === barberoId);
  const nombreBarbero = barbero ? `${barbero.Nombre_Barbero}` : "Barbero desconocido";

  if (userId === clienteId) {
    return `Tu cita con ${nombreBarbero} 💈`;
  }
  return `Reservado con ${nombreBarbero}`;
};


export default function AppointmentCalendar() {
  const { user } = useUser();
  const [events, setEvents] = useState<AppointmentEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingEvent, setEditingEvent] = useState<AppointmentEvent | null>(null);
  const [view, setView] = useState<View>(Views.WEEK);
  const [date, setDate] = useState<Date>(new Date());
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const [sedes, setSedes] = useState<Sede[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSede, setSelectedSede] = useState<string>("");
  const [selectedBarbero, setSelectedBarbero] = useState<string>("");
  const [selectedServicios, setSelectedServicios] = useState<string[]>([]);
  const [selectedHour, setSelectedHour] = useState<number>(10);

  useEffect(() => {
    async function fetchData() {
      try {
        const [sedesRes, barberosRes, serviciosRes, citasRes] = await Promise.all([
          fetch('/api/sedes'),
          fetch('/api/barberos'),
          fetch('/api/servicios'),
          fetch('/api/citas')
        ]);
        const sedesData = await sedesRes.json();
        const barberosData = await barberosRes.json();
        const serviciosData = await serviciosRes.json();
        const citasData = await citasRes.json();

        setSedes(sedesData);
        setBarberos(barberosData);
        setServicios(serviciosData);

        // El mapeo inicial debe ser compatible con la estructura que devuelve tu API al cargar todas las citas
        const citasFormateadas = citasData.map((cita: any) => ({
          ...cita,
          id: cita.id || cita.ID_Cita,
          start: new Date(cita.start || cita.Fecha_Hora_Inicio),
          end: new Date(cita.end || cita.Fecha_Hora_Fin),
          userId: cita.clienteId || cita.ID_Cliente,
          sedeId: cita.sedeId || cita.ID_Sede,
          barberoId: cita.barberId || cita.ID_Barbero,
          servicioIds: Array.isArray(cita.services) ? cita.services : (typeof cita.services === 'string' && cita.services.startsWith('[')) ? JSON.parse(cita.services) : (cita.Servicios ? cita.Servicios.split(',') : []),
          title: generateEventTitle(cita, barberosData, user?.id)
        }));
        setEvents(citasFormateadas);

      } catch (error) {
        console.error("Error cargando datos:", error);
        showToast("Error al cargar datos del sistema", "error");
      } finally {
        setIsLoading(false);
      }
    }
    if (user) {
        fetchData();
    }
  }, [user]);

  const filteredBarberos = useMemo(() => {
    if (!selectedSede) return [];
    return barberos.filter(barbero => barbero.ID_Sede === selectedSede);
  }, [selectedSede, barberos]);

  useEffect(() => {
    setSelectedBarbero("");
  }, [selectedSede]);

  const hours = useMemo(() => Array.from({ length: 13 }, (_, i) => i + 10), []);
  const minTime = useMemo(() => new Date(1970, 0, 1, 10, 0, 0), []);
  const maxTime = useMemo(() => new Date(1970, 0, 1, 22, 0, 0), []);

  const { subtotal, totalDuration } = useMemo(() => {
    return selectedServicios.reduce(
      (acc, currId) => {
        const servicio = servicios.find(s => s.ID_Servicio === currId);
        if (servicio) {
          acc.subtotal += parseInt(servicio.Precio);
          acc.totalDuration += parseInt(servicio.Duracion_min);
        }
        return acc;
      },
      { subtotal: 0, totalDuration: 0 }
    );
  }, [selectedServicios, servicios]);

  const showToast = (m: string, type: ToastType = "info") => {
    setToast({ message: m, type });
    setTimeout(() => setToast(null), 2600);
  };

  if (!user) {
    return (
      <div id="citas" className="scroll-mt-24">
        <p className="text-center py-10 text-lg font-semibold text-gray-700">
          🔒 Debes iniciar sesión para agendar citas.
        </p>
      </div>
    );
  }

  const handleSelectSlot = (slot: { start: Date; end: Date }) => {
    const now = new Date();
    if (slot.start < now) {
      showToast("No puedes agendar en el pasado", "error");
      return;
    }
    setSelectedDate(slot.start);
    setEditingEvent(null);
    setSelectedSede("");
    setSelectedBarbero("");
    setSelectedServicios([]);
    setSelectedHour(10);
  };

  const handleServicioChange = (servicioId: string) => {
    setSelectedServicios(prev =>
      prev.includes(servicioId)
        ? prev.filter(id => id !== servicioId)
        : [...prev, servicioId]
    );
  };
  
  // --- INICIO DEL CÓDIGO CORREGIDO ---
  const handleSaveAppointment = async () => {
    // 1. Validaciones iniciales
    if (!user) {
        showToast("Error de autenticación.", "error");
        return;
    }
    if (!selectedDate || !selectedSede || !selectedBarbero || selectedServicios.length === 0) {
      showToast("Por favor, completa todos los campos.", "error");
      return;
    }
  
    // 2. Cálculo de las fechas de inicio y fin
    const start = new Date(selectedDate);
    start.setHours(selectedHour, 0, 0, 0);
  
    const end = new Date(start);
    end.setMinutes(start.getMinutes() + totalDuration);
  
    // 3. Verificación de citas existentes
    const clash = events.some(
      (e) => e.start < end && e.end > start && e.barberoId === selectedBarbero && (!editingEvent || e.id !== editingEvent.id)
    );
  
    if (clash) {
      showToast("Ese barbero ya tiene una cita en ese horario. Elige otra hora o barbero.", "error");
      return;
    }
    
    // 4. Creación del objeto de datos para la API (AQUÍ ESTÁ LA CORRECCIÓN)
    // Nos aseguramos de que los nombres de las claves coincidan con lo que el backend espera.
    const appointmentData = {
      // Para la edición, nos aseguramos de enviar el ID de la cita
      id: editingEvent ? editingEvent.id : undefined, 
      
      // Datos del formulario con los nombres CORRECTOS
      sedeId: selectedSede,
      barberId: selectedBarbero, // ¡Corregido! 
      clienteId: user.id,       // ¡Corregido! 
      services: JSON.stringify(selectedServicios), // ¡Corregido! El backend espera un string JSON de los IDs.
      totalCost: subtotal.toString(), // ¡Corregido! Enviamos el subtotal calculado.
      
      // Las fechas en formato estándar ISO
      start: start.toISOString(),
      end: end.toISOString(),
      
      // El título se genera y se envía
      title: generateEventTitle({ ID_Barbero: selectedBarbero, ID_Cliente: user.id }, barberos, user.id),
    };
  
    try {
      // 5. Petición a la API (POST para crear, PUT para editar)
      const response = await fetch('/api/citas', {
        method: editingEvent ? 'PUT' : 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        // Mostramos el mensaje de error específico que envía el backend
        throw new Error(errorData.message || 'Error al guardar la cita.');
      }
  
      const savedAppointment = await response.json();
      const citaGuardada = savedAppointment.data; // La cita está dentro de la propiedad 'data'
  
      // 6. Creación del nuevo evento para actualizar el calendario visualmente
      const newEvent: AppointmentEvent = {
        id: citaGuardada.id,
        title: generateEventTitle({ barberId: citaGuardada.barberId, clienteId: citaGuardada.clienteId }, barberos, user.id),
        start: new Date(citaGuardada.start),
        end: new Date(citaGuardada.end),
        userId: citaGuardada.clienteId,
        sedeId: citaGuardada.sedeId,
        barberoId: citaGuardada.barberId,
        servicioIds: JSON.parse(citaGuardada.services),
      };
      
      // 7. Actualización del estado local y feedback al usuario
      if (editingEvent) {
        setEvents(prev => prev.map(ev => ev.id === newEvent.id ? newEvent : ev));
        showToast("Cita actualizada exitosamente", "success");
      } else {
        setEvents(prev => [...prev, newEvent]);
        showToast("Cita creada exitosamente", "success");
      }
  
      // Limpiamos el formulario
      setSelectedDate(null);
      setEditingEvent(null);
  
    } catch (error: any) {
      console.error("Error en handleSaveAppointment:", error);
      showToast(error.message || "No se pudo guardar la cita.", "error");
    }
  };
  // --- FIN DEL CÓDIGO CORREGIDO ---


  const handleDeleteAppointment = async () => {
    if (!editingEvent || !user) return;

    if (editingEvent.userId !== user.id) {
      showToast("Solo puedes eliminar tus propias citas", "error");
      return;
    }

    if (!window.confirm("¿Estás seguro de que quieres eliminar esta cita?")) {
        return;
    }

    try {
        const response = await fetch('/api/citas', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            // Asegúrate que tu API de DELETE espera `id` o `ID_Cita`
            body: JSON.stringify({ id: editingEvent.id }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al eliminar la cita.');
        }

        setEvents(prev => prev.filter(e => e.id !== editingEvent.id));
        showToast("Cita eliminada correctamente", "success");

        setEditingEvent(null);
        setSelectedDate(null);

    } catch (error: any) {
        console.error("Error en handleDeleteAppointment:", error);
        showToast(error.message || "No se pudo eliminar la cita.", "error");
    }
  };

  return (
    <div id="citas" className="w-full max-w-6xl mx-auto p-6 scroll-mt-24">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Agenda tu cita 💈</h2>
        <p className="text-gray-600 mt-2">Horario: <b>10:00 am - 10:00 pm</b></p>
      </div>

      <div className="bg-white shadow-sm ring-1 ring-gray-200 rounded-2xl p-4 md:p-6">
        <Calendar
          culture="es"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(ev) => {
            const e = ev as AppointmentEvent;
            if (e.userId === user.id) {
              setEditingEvent(e);
              setSelectedDate(e.start);
              setSelectedSede(e.sedeId);
              setSelectedBarbero(e.barberoId);
              setSelectedServicios(e.servicioIds);
              setSelectedHour(e.start.getHours());
            } else {
              showToast("Este horario ya está ocupado.", "info");
            }
          }}
          style={{ height: 600 }}
          step={60}
          timeslots={1}
          defaultView={Views.WEEK}
          view={view}
          onView={(v) => setView(v)}
          min={minTime}
          max={maxTime}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          components={{ toolbar: Toolbar }}
          messages={{
            next: "Siguiente", previous: "Anterior", today: "Hoy", month: "Mes",
            week: "Semana", day: "Día", agenda: "Agenda", date: "Fecha",
            time: "Hora", event: "Evento", noEventsInRange: "No hay eventos en este rango",
            showMore: (c: number) => `+ Ver ${c} más`,
          }}
          eventPropGetter={(event) => {
            const isUserEvent = event.userId === user.id;
            const backgroundColor = isUserEvent ? '#2563eb' : '#6b7280';
            const borderColor = isUserEvent ? '#1d4ed8' : '#4b5563';
            return {
              style: { backgroundColor, borderRadius: "8px", color: "white", padding: "4px 6px", border: `1px solid ${borderColor}` },
            }
          }}
        />
      </div>

      {selectedDate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative my-8">
            <button
              onClick={() => {setSelectedDate(null); setEditingEvent(null);}}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <h3 className="text-2xl font-semibold text-gray-900 text-center mb-1">
              {editingEvent ? "Editar cita" : "Nueva cita"}
            </h3>
            <p className="text-center text-sm text-gray-500 mb-6">
              {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </p>

            <div className="space-y-4">
              <div>
                <label htmlFor="sede" className="block mb-2 font-medium text-gray-700">1. Selecciona la Sede</label>
                <select
                  id="sede"
                  value={selectedSede}
                  onChange={(e) => setSelectedSede(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="" disabled>-- Elige una sede --</option>
                  {sedes.map((sede) => (
                    <option key={sede.ID_Sede} value={sede.ID_Sede}>{sede.Nombre_Sede}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="barbero" className="block mb-2 font-medium text-gray-700">2. Selecciona tu Barbero</label>
                <Listbox
                  value={selectedBarbero}
                  onChange={setSelectedBarbero}
                  disabled={!selectedSede || filteredBarberos.length === 0}
                >
                  <div className="relative mt-1">
                    <Listbox.Button
                      id="barbero"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100 relative cursor-default text-left bg-white"
                    >
                      <span className="block truncate text-black">
                        {(() => {
                          const barberoSeleccionado = barberos.find(b => b && b.ID_Barbero === selectedBarbero);
                          if (barberoSeleccionado && barberoSeleccionado.Nombre_Barbero) {
                            return `${barberoSeleccionado.Nombre_Barbero} ${barberoSeleccionado.Apellido_Barbero || ''}`;
                          }
                          return selectedSede ? "-- Elige un barbero --" : "-- Primero selecciona una sede --";
                        })()}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-400" aria-hidden="true">
                          <path fillRule="evenodd" d="M10 3a.75.75 0 01.53.22l3.5 3.5a.75.75 0 01-1.06 1.06L10 4.81 6.03 8.78a.75.75 0 01-1.06-1.06l3.5-3.5A.75.75 0 0110 3z" clipRule="rotate(180 10 10)" />
                        </svg>
                      </span>
                    </Listbox.Button>
                    <Transition
                      as={Fragment}
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-10">
                        {filteredBarberos.map((barbero, index) => (
                          <Listbox.Option
                            key={barbero.ID_Barbero || `barbero-${index}`}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                              }`
                            }
                            value={barbero.ID_Barbero}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                                    }`}
                                >
                                  {barbero.Nombre_Barbero} {barbero.Apellido_Barbero || ''}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    </Transition>
                  </div>
                </Listbox>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">3. Elige los Servicios</label>
                <div className="w-full border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 bg-white">
                  {servicios.length > 0 ? (
                    servicios.map((servicio) => (
                      <label key={servicio.ID_Servicio} className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedServicios.includes(servicio.ID_Servicio)}
                          onChange={() => handleServicioChange(servicio.ID_Servicio)}
                          disabled={!selectedBarbero}
                          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <span className="flex-1 text-gray-800">{servicio.Nombre_Servicio}</span>
                        <span className="font-semibold text-gray-600">${parseInt(servicio.Precio).toLocaleString('es-CO')}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No hay servicios disponibles.</p>
                  )}
                </div>
                {subtotal > 0 && (
                  <div className="text-right mt-2 pr-2">
                    <p className="text-md font-bold text-gray-800">
                      Subtotal: <span className="text-blue-600">${subtotal.toLocaleString('es-CO')}</span>
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="hora" className="block mb-2 font-medium text-gray-700">4. Selecciona la Hora</label>
                <select
                  id="hora"
                  value={selectedHour}
                  onChange={(e) => setSelectedHour(Number(e.target.value))}
                  disabled={selectedServicios.length === 0}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                >
                  {hours.map((hour) => {
                    const now = new Date();
                    const isToday = selectedDate.toDateString() === now.toDateString();

                    const isPastHour = isToday && hour < now.getHours();
                    if (isPastHour) {
                      return null;
                    }

                    const start = new Date(selectedDate);
                    start.setHours(hour, 0, 0, 0);
                    const end = new Date(start);
                    end.setMinutes(start.getMinutes() + totalDuration);

                    const taken = events.some(
                      (e) => e.barberoId === selectedBarbero && e.start < end && e.end > start && (!editingEvent || e.id !== editingEvent.id)
                    );

                    return (
                      <option key={hour} value={hour} disabled={taken} className="text-black">
                        {hour}:00 {taken ? "(Ocupado)" : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

            </div>

            <div className="flex justify-between mt-6 gap-2">
              {editingEvent && (
                <button onClick={handleDeleteAppointment} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                  Eliminar
                </button>
              )}
              <button
                onClick={() => {setSelectedDate(null); setEditingEvent(null);}}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancelar
              </button>
              <button onClick={handleSaveAppointment} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                {editingEvent ? "Guardar Cambios" : "Confirmar Cita"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[70]">
          <div className={cn("rounded-lg shadow-lg px-4 py-3 text-white", toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : "bg-blue-600")}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}