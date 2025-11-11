# Plataforma de Evaluación Crediticia

## 🚀 Módulo de Autenticación

Este repositorio contiene la implementación base del módulo de autenticación de la plataforma de gestión crediticia. La aplicación está construida con **React + TypeScript + Vite** y sirve como punto de partida para el resto de módulos funcionales.

## 📋 Alcance Actual

- ✅ Inicio de sesión con validación de credenciales mock
- ✅ Registro de nuevos asesores con inicio de sesión automático
- ✅ Recuperación de contraseña (flujo simulado)
- ✅ Contexto global de autenticación con persistencia en `localStorage`
- ✅ Rutas protegidas y renderizado condicional por rol
- ✅ Dashboard base diferenciado por tipo de usuario

## 🔑 Credenciales de Prueba

| Rol | Email | Contraseña |
| --- | --- | --- |
| Analista | `admin@crediticia.com` | `admin123` |
| Asesor 1 | `asesor1@crediticia.com` | `password123` |
| Asesor 2 | `asesor2@crediticia.com` | `password123` |

> Nota: Las contraseñas se guardan en texto plano solo para propósitos demostrativos. No usar esta aproximación en producción.

## 📂 Estructura del Proyecto

```
src/
├── assets/                # Recursos estáticos
├── components/            # Componentes compartidos (ej. ProtectedRoute)
├── context/               # Contextos globales (AuthProvider y hook useAuth)
├── data/                  # Datos mock para usuarios, clientes y solicitudes
├── hooks/                 # Reservado para custom hooks futuros
├── pages/                 # Vistas completas: Login, Registro, Recuperar, Dashboard
├── styles/
│   └── pages/             # Estilos específicos de vistas (Auth.css, Dashboard.css)
├── types/                 # Tipos e interfaces compartidos
├── App.tsx                # Configuración de rutas y layout principal
├── App.css                # Estilos globales (background, tipografía)
├── index.css              # Reset y utilidades globales
└── main.tsx               # Punto de entrada de React + Vite
```

## 🛠️ Stack Tecnológico

- React 19.1.1
- TypeScript 5.9.x
- React Router DOM 7.1.x
- Vite 7.1.x

## 🚀 Ejecución del Proyecto

```bash
npm install      # Instala dependencias
npm run dev      # Servidor de desarrollo en http://localhost:5173
npm run build    # Build para producción
npm run preview  # Previsualización del build
```

## 🔐 Rutas Habilitadas

- `/login`: Formulario de acceso
- `/registro`: Alta de nuevos asesores
- `/recuperar`: Flujo de recuperación de contraseña
- `/dashboard`: Panel protegido con información resumen

## 💾 Persistencia y Datos Mock

- **AuthContext** guarda la sesión en `localStorage` (`auth_user`).
- El archivo `src/data/mockData.ts` contiene usuarios, clientes, solicitudes y evaluaciones de ejemplo para pruebas.
- El registro de usuarios añade nuevos asesores al arreglo `usersMock` en tiempo de ejecución.

## 🎨 UI / Experiencia de Usuario

- Diseño limpio basado en tarjetas sobre fondo claro
- Botón primario oscuro y campos de formulario con acento gris, acorde a los mockups compartidos
- Mensajes de error y éxito consistentes en formularios
- Layout responsive con flexbox

## 📝 Próximos Pasos Sugeridos

1. Conectar el módulo de autenticación al backend real (API de login/registro).
2. Sustituir los datos mock por peticiones a servicios de clientes, solicitudes y evaluaciones.
3. Completar la carpeta `hooks/` con lógica compartida (ej. `useClientes`, `useSolicitudes`).
4. Implementar dashboards específicos por rol y módulos de gestión crediticia.
5. Añadir pruebas unitarias y de integración para AuthContext y vistas principales.
- `/dashboard` - Dashboard principal (protegido)
