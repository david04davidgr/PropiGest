# 🏠 PropiGest

**PropiGest** es una aplicación web de gestión de propiedades en alquiler, diseñada para propietarios e inmobiliarias que desean organizar y controlar sus viviendas, reservas, mantenimientos y movimientos económicos de forma sencilla e intuitiva.

## 🚀 Características principales

- Gestión de propiedades con imágenes y detalles técnicos.
- Calendario de reservas interactivo.
- Gestión de mantenimientos e incidencias.
- Control de ingresos y gastos por propiedad.
- Vista en mapa para localizar propiedades fácilmente.
- Interfaz adaptable (responsive) y fácil de usar.

## 🧰 Tecnologías utilizadas

- **Frontend:** HTML5, CSS3, JavaScript, Bootstrap
- **Backend:** PHP 7.4+
- **Base de datos:** MySQL
- **Entorno de desarrollo:** XAMPP
- **Control de versiones:** Git
- **Servidor recomendado:** Apache

## 🛠️ Instalación local (XAMPP)

1. Clona este repositorio o descarga el ZIP.
2. Copia el proyecto en `C:\xampp\htdocs\propiGest`.
3. Inicia Apache y MySQL desde XAMPP.
4. Accede a [http://localhost/phpmyadmin](http://localhost/phpmyadmin) y crea una base de datos `propiGest`.
5. Importa el script `BBDD/propigest.sql`.
6. Configura el archivo `php/conexion.php` con tus credenciales locales.
7. Accede a la app en [http://localhost/propiGest/public](http://localhost/propiGest).

## 🌐 Despliegue en servidor web

1. Sube los archivos al servidor (vía FTP o panel).
2. Crea una base de datos y sube el esquema.
3. Edita el archivo `php/conexion.php` con los datos de tu hosting.

## 🔐 Seguridad

- Prevención de SQL Injection, XSS y navegación no autorizada.
- Gestión segura de sesiones.
- Separación de carpetas públicas y privadas.
- Recomendado usar HTTPS en entornos productivos.

## 📄 Documentación

- [Aviso Legal](./Documentacion/avisoLegal.pdf)
- [Manual Técnico](./Documentacion/manualTecnico.pdf)
- [Manual de Usuario](./Documentacion/manualUsuario.pdf)
- [Memoria de proyecto + visto bueno](./Documentacion/MemoriaProyectoPropiGestSigned.pdf)

## ⚖️ Licencia y derechos

Este proyecto se encuentra protegido por los derechos de autor. No se permite su reproducción, distribución o modificación sin consentimiento del autor. Todos los derechos reservados © 2025.

---

**Desarrollado por:** *David García Rodríguez*  
**Fecha:** Junio de 2025  
