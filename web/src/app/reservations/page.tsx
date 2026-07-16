'use client';

import { type FormEvent, useMemo, useState } from 'react';

const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromDateKey(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(value: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(
    'es-CL',
    options ?? { day: '2-digit', month: 'short', year: 'numeric' },
  ).format(fromDateKey(value));
}

function createCalendarDays(month: Date): Array<Date | null> {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
  const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const mondayOffset = (firstDay.getDay() + 6) % 7;
  const result: Array<Date | null> = Array.from({ length: mondayOffset }, () => null);
  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    result.push(new Date(month.getFullYear(), month.getMonth(), day));
  }
  while (result.length % 7 !== 0) result.push(null);
  return result;
}

export default function ReservationsPage() {
  const today = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }, []);
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(() => toDateKey(today));
  const [selectedTime, setSelectedTime] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const calendarDays = useMemo(() => createCalendarDays(month), [month]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedTime) return;
    setLoading(true);
    setError('');
    const form = event.currentTarget;
    const payload = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      requestedFor: new Date(`${selectedDate}T${selectedTime}:00`).toISOString(),
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value || undefined,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error((body as { message?: string }).message ?? 'No fue posible confirmar la reserva.');
      }
      setNotice(`Reserva confirmada para el ${formatDate(selectedDate)} a las ${selectedTime}.`);
      setDialogOpen(false);
      setSelectedTime('');
      form.reset();
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 text-foreground sm:px-6 lg:py-12">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="surface-card overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">Reservas online</span>
              <span className="text-xs text-muted-foreground">Confirmación inmediata</span>
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">Agenda de reservas</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Selecciona una fecha y uno de los horarios disponibles para solicitar tu atención.
            </p>
          </div>
          <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-3xl text-primary-foreground shadow-lg sm:mt-0">
            📅
          </div>
        </header>

        {notice && <div className="rounded-2xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm"><strong>Cambio guardado.</strong> {notice}</div>}
        {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
          <article className="surface-card rounded-3xl border border-border">
            <div className="flex flex-col gap-4 border-b border-border p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold">Elige una fecha</h2>
                <p className="mt-1 text-sm text-muted-foreground">Los días anteriores a hoy están bloqueados.</p>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Mes anterior" disabled={month <= new Date(today.getFullYear(), today.getMonth(), 1)} onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="h-10 w-10 rounded-xl border border-border bg-card disabled:opacity-30">‹</button>
                <p className="min-w-36 text-center text-sm font-semibold capitalize">{new Intl.DateTimeFormat('es-CL', { month: 'long', year: 'numeric' }).format(month)}</p>
                <button type="button" aria-label="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="h-10 w-10 rounded-xl border border-border bg-card">›</button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {WEEK_DAYS.map((day) => <div key={day} className="py-2 text-center text-xs font-semibold uppercase text-muted-foreground">{day}</div>)}
                {calendarDays.map((date, index) => {
                  if (!date) return <div key={`empty-${index}`} />;
                  const dateKey = toDateKey(date);
                  const selected = dateKey === selectedDate;
                  const past = date < today;
                  return (
                    <button key={dateKey} type="button" disabled={past} onClick={() => setSelectedDate(dateKey)} className={`aspect-square min-h-11 rounded-xl border text-sm transition-colors ${selected ? 'border-primary bg-primary font-semibold text-primary-foreground' : 'border-transparent hover:border-border hover:bg-accent'} ${past ? 'cursor-not-allowed opacity-30' : ''}`}>
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          <article className="surface-card rounded-3xl border border-border p-6">
            <h2 className="text-xl font-bold">🕒 Horarios</h2>
            <p className="mt-1 text-sm capitalize text-muted-foreground">{formatDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {TIME_SLOTS.map((time) => (
                <button key={time} type="button" onClick={() => { setSelectedTime(time); setDialogOpen(true); setError(''); }} className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:border-primary hover:bg-primary/5">
                  {time}<span className="text-[10px] font-normal text-muted-foreground">Libre</span>
                </button>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm text-muted-foreground">Duración estimada: 45 minutos por sesión.</div>
          </article>
        </div>

        <article className="surface-card rounded-3xl border border-border p-6">
          <h2 className="text-xl font-bold">👥 Tu próxima reserva</h2>
          <p className="mt-2 text-sm text-muted-foreground">{notice || 'Aún no has realizado una reserva. Selecciona un horario para comenzar.'}</p>
        </article>
      </section>

      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm">
          <div className="surface-elevated max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-border bg-background p-6">
            <h2 className="text-2xl font-bold">Confirmar reserva</h2>
            <p className="mt-2 text-sm capitalize text-muted-foreground">{formatDate(selectedDate, { weekday: 'long', day: 'numeric', month: 'long' })} a las {selectedTime}</p>
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
              <label className="grid gap-2 text-sm font-semibold">Nombre completo<input name="name" required minLength={2} maxLength={120} className="rounded-xl border border-input bg-card px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring" placeholder="Ana Pérez" /></label>
              <label className="grid gap-2 text-sm font-semibold">Correo electrónico<input name="email" required type="email" maxLength={190} className="rounded-xl border border-input bg-card px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring" placeholder="ana@empresa.cl" /></label>
              <label className="grid gap-2 text-sm font-semibold">Tipo de atención<select name="service" className="rounded-xl border border-input bg-card px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring"><option>Consultoría inicial</option><option>Sesión de seguimiento</option><option>Soporte técnico</option></select></label>
              <label className="grid gap-2 text-sm font-semibold">Notas adicionales<textarea name="notes" rows={3} maxLength={500} className="rounded-xl border border-input bg-card px-4 py-3 font-normal outline-none focus:ring-2 focus:ring-ring" placeholder="Cuéntanos brevemente qué necesitas" /></label>
              <div className="mt-2 flex justify-end gap-3">
                <button type="button" onClick={() => setDialogOpen(false)} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold">Volver</button>
                <button type="submit" disabled={loading} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">{loading ? 'Confirmando...' : 'Confirmar reserva'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
