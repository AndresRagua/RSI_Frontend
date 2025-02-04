# 🎨 RSI Frontend  

🚀 **Frontend en React con Tailwind CSS** para la plataforma RSI, estructurado con rutas públicas y administrativas.  

## ✨ Características  
✅ **Desarrollado con React** y estructura modular  
✅ **Tailwind CSS** para estilos responsivos y modernos  
✅ **Manejo de rutas** con `react-router-dom`  
✅ **Componentes reutilizables** (`NavBar`, `Footer`, etc.)  
✅ **División entre vistas públicas y administrativas**  
✅ **Optimización con PostCSS y Tailwind**  

## 📂 Estructura del Proyecto  
```bash
Frontend_RSI-main/
│── public/                   # Archivos estáticos y de configuración
│   ├── index.html            # Archivo base HTML
│   ├── logo_rs.svg           # Logo del proyecto
│   ├── manifest.json         # Configuración de PWA
│   ├── robots.txt            # Reglas para indexación de buscadores
│── src/                      # Código fuente principal
│   ├── components/           # Componentes reutilizables
│   │   ├── AdminNavBar.js
│   │   ├── PublicNavBar.js
│   │   ├── Footer.js
│   ├── pages/admin/          # Páginas del panel de administración
│   ├── pages/public/         # Páginas de acceso público
│   ├── App.jsx               # Componente principal
│   ├── index.js              # Punto de entrada
│   ├── index.css             # Estilos globales
│── package.json              # Configuración de dependencias y scripts
│── package-lock.json         # Bloqueo de versiones de dependencias
│── tailwind.config.js        # Configuración de Tailwind CSS
│── postcss.config.js         # Configuración de PostCSS
│── .gitignore                # Archivos a ignorar en Git
│── README.md                 # Documentación del proyecto
```

## ⚡ Instalación y Uso  
### 1️⃣ Clonar el repositorio  
```bash
git clone https://github.com/tu-usuario/frontend-rsi.git
cd frontend-rsi
```

### 2️⃣ Instalar las dependencias  
```bash
npm install
```

### 3️⃣ Ejecutar el proyecto  
```bash
npm run dev
```

🔹 Abre `http://localhost:5173/` en tu navegador para ver la aplicación.  

## 🔥 Contribuciones  
Las contribuciones son bienvenidas. Si encuentras un error o deseas mejorar la app, abre un **issue** o envía un **pull request**. 🚀  
