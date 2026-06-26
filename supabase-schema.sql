-- =============================================
-- SCHEMA: Centro de Acopio Venezuela
-- Ejecutar en: Supabase → SQL Editor
-- =============================================

create table if not exists centros (
  id          bigserial primary key,
  nombre      text not null,
  estado      text not null,
  ciudad      text not null,
  direccion   text not null,
  responsable text not null,
  telefono    text not null,
  dias        text not null,
  hora_inicio text not null,
  hora_fin    text not null,
  items       text[] default '{}',
  info        text,
  activo      boolean default true,
  created_at  timestamptz default now()
);

-- Índices para búsquedas rápidas
create index if not exists centros_estado_idx on centros(estado);
create index if not exists centros_created_idx on centros(created_at desc);

-- Row Level Security: lectura pública, escritura pública (sin auth)
alter table centros enable row level security;

create policy "Lectura pública"
  on centros for select using (true);

create policy "Escritura pública"
  on centros for insert with check (true);

-- Datos de ejemplo para probar
insert into centros (nombre, estado, ciudad, direccion, responsable, telefono, dias, hora_inicio, hora_fin, items, info)
values
  ('Centro Comunitario Simón Bolívar', 'La Guaira', 'Maiquetía', 'Av. La Armada, frente a la Cruz Roja', 'Luis Hernández', '0412-3456789', 'Lun–Dom', '07:00', '18:00', ARRAY['Agua','Medicamentos','Comida','Pañales'], 'Coordinado por Cruz Roja Venezuela'),
  ('Escuela Básica Andrés Bello',      'La Guaira', 'La Guaira',  'Calle Bolívar, sector El Vigía',         'Carmen López',    '0424-7654321', 'Lun–Vie', '08:00', '16:00', ARRAY['Ropa','Comida','Colchonetas'], 'Coordina la directora Carmen López'),
  ('Polideportivo Municipal Baruta',   'Miranda',   'Baruta',     'Urb. Las Mercedes, entrada principal',   'Ing. Pedro Martínez','0416-9988776','Lun–Dom','06:00','20:00',ARRAY['Agua','Comida','Higiene','Medicamentos','Equipo de rescate','Herramientas'], 'Gran capacidad. Aceptan vehículos de carga y equipos pesados.'),
  ('Iglesia Parroquial Nuestra Señora','Aragua',    'Maracay',    'Av. Bolívar Norte, Palacio Municipal',   'Padre Miguel Torres','0243-5556677','Mar–Dom','09:00','17:00',ARRAY['Comida','Ropa','Pañales','Higiene'], 'Especialmente necesitan pañales talla M y L');
