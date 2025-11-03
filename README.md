# Proyecto Gestión Crediticia – Frontend

Este repositorio contiene la base del frontend para la Plataforma de Evaluación Crediticia. Está construido con **React + TypeScript + Vite** e implementa el módulo de autenticación, dejando preparada la estructura para que el resto del equipo desarrolle los módulos siguientes.

---

## 🗂️ Estructura de carpetas

```
src/
├── assets/
├── components/
├── context/
├── data/
├── hooks/
├── pages/
├── styles/
├── types/
├── App.tsx
├── App.css
├── index.css
└── main.tsx
```

### `src/assets/`
Contiene recursos estáticos (imágenes, íconos, etc.). Actualmente solo se incluye `react.svg`, pero aquí deben colocarse los assets que cualquiera de los módulos necesite.

### `src/components/`
Componentes reutilizables y desacoplados del resto de la aplicación. El archivo `ProtectedRoute.tsx` encapsula la lógica para proteger rutas según el estado de autenticación. El archivo `index.ts` exporta los componentes públicos, lo que facilita importar desde `./components` sin rutas largas.

### `src/context/`
Contextos de React que manejan estado global. `AuthContext.tsx` resuelve la autenticación (login, registro, logout) y expone `useAuth()` para que cualquier página o componente pueda consumir el contexto sin prop drilling.

### `src/data/`
Datos mock y cualquier fuente de información temporal usada durante el desarrollo sin backend. `mockData.ts` define usuarios, clientes, solicitudes y evaluaciones para simular la lógica de negocio.

### `src/hooks/`
Espacio reservado para **custom hooks** compartidos entre módulos. Actualmente está vacío; el equipo puede agregar aquí hooks como `useSolicitudes`, `useClientes`, etc., cuando los implementen.

### `src/pages/`
Componentes de página que representan cada ruta de la aplicación: `Login`, `Register`, `RecoverPassword` y `Dashboard`. El archivo `index.ts` centraliza las exportaciones de todas las páginas.

### `src/styles/`
Estilos globales y específicos. Dentro de `styles/pages/` se encuentran `Auth.css` y `Dashboard.css`, responsables de los estilos de las páginas de autenticación y del dashboard. Si se agregan nuevos módulos, es recomendable crear sus estilos aquí o migrar a un framework como Tailwind si el equipo lo requiere.

### `src/types/`
Definiciones de tipos e interfaces en TypeScript (`index.ts`). Aquí se modelan las entidades del dominio (Usuarios, Clientes, Solicitudes, Evaluaciones) y los contratos del AuthContext y formularios.

### Archivos raíz
- **`App.tsx`**: Configura el router, las rutas públicas y protegidas, y envuelve la aplicación con `AuthProvider`.
- **`App.css` / `index.css`**: Estilos globales básicos (reset y tipografía).
- **`main.tsx`**: Punto de entrada que monta la aplicación en el DOM.

---

## 📦 Dependencias clave

- **React 19** y **React DOM**
- **TypeScript**
- **Vite** (bundler y dev server)
- **react-router-dom** para enrutamiento


## 🚀 Scripts disponibles

```bash
npm install        # Instala dependencias
npm run dev        # Inicia el servidor de desarrollo (http://localhost:5173)
npm run build      # Genera build de producción
npm run preview    # Previsualiza el build generado
```

---

## 🔐 Módulo de autenticación (implementado)

- Login con verificación de credenciales mock
- Registro de nuevos asesores (autologin después del registro)
- Recuperación de contraseña (simulada)
- Dashboard protegido y control de sesión con `localStorage`
- Manejo de roles (Analista / Asesor) listo para expandirse

Referencias útiles:
- **`CREDENCIALES.md`**: Credenciales de prueba y notas rápidas para QA.
---

## ✅ Próximos pasos

1. **Agregar nuevos contextos/data** para módulos de solicitudes, clientes y evaluaciones según el diagrama ER.
2. **Mover la lógica compartida** a hooks reutilizables (`src/hooks/`).
3. **Crear nuevas páginas** dentro de `src/pages/` y sus estilos correspondientes en `src/styles/`.
4. **Reemplazar los datos mock** por peticiones reales cuando esté listo el backend.

