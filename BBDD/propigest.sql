-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: sql208.infinityfree.com
-- Tiempo de generación: 04-06-2025 a las 18:49:25
-- Versión del servidor: 10.6.19-MariaDB
-- Versión de PHP: 7.2.22

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `if0_38425600_propigest`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

CREATE TABLE `documentos` (
  `id` int(11) NOT NULL,
  `idPropiedad` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `ruta` varchar(500) NOT NULL,
  `tipo` varchar(100) DEFAULT NULL,
  `subidoEn` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`id`, `idPropiedad`, `titulo`, `ruta`, `tipo`, `subidoEn`) VALUES
(28, 41, 'Factura de mantenimiento', '../uploads/archivos/681bbd8732048_esquemaBDPropiGest.jpg', 'factura', '2025-05-07 20:07:35'),
(34, 37, 'Factura de mantenimiento', '../uploads/archivos/68262d93195c9_20250401_204831 (1).jpg', 'factura', '2025-05-15 18:08:19'),
(35, 47, 'Factura de mantenimiento', '../uploads/archivos/68309d87e169c_EJ2_Weather_ApiCalls_Angular.pdf', 'factura', '2025-05-23 16:08:40');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mantenimientos`
--

CREATE TABLE `mantenimientos` (
  `id` int(11) NOT NULL,
  `idPropiedad` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` enum('preventivo','correctivo') DEFAULT 'correctivo',
  `fechaProgramada` datetime NOT NULL,
  `fechaRealizacion` datetime DEFAULT NULL,
  `empresa` varchar(255) DEFAULT NULL,
  `estado` enum('pendiente','en proceso','completado') DEFAULT 'pendiente',
  `coste` decimal(10,2) NOT NULL,
  `creadoEn` timestamp NOT NULL DEFAULT current_timestamp(),
  `idDocumento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mantenimientos`
--

INSERT INTO `mantenimientos` (`id`, `idPropiedad`, `titulo`, `descripcion`, `tipo`, `fechaProgramada`, `fechaRealizacion`, `empresa`, `estado`, `coste`, `creadoEn`, `idDocumento`) VALUES
(15, 41, 'cambio bombilla', 'cambio de una bombilla de la sala de estar', 'correctivo', '2025-05-07 17:15:00', '2025-05-07 17:15:00', 'bombillita S.L', 'completado', '5.00', '2025-05-07 19:49:27', 28),
(30, 37, 'cambio bomba de agua', 'Cambio de bomba de agua eléctrica del pozo', 'correctivo', '2025-05-10 10:00:00', '2025-05-10 10:00:00', 'fontanerias paco S.L', 'en proceso', '75.00', '2025-05-08 22:49:11', 34),
(31, 39, 'Impermeabilización Baño', 'Impermeabilización de la ducha para evitar fugas y humedad en la pared colindante', 'correctivo', '2025-05-16 20:37:00', '2025-05-16 20:37:00', 'impermeabilizaciones extremeñas SL', 'completado', '120.00', '2025-05-15 18:38:07', NULL),
(32, 38, 'Costura de sillón', 'Coser la raja que se hizo en el sillón', 'correctivo', '2025-05-18 20:40:00', '0000-00-00 00:00:00', 'Yo', 'pendiente', '0.00', '2025-05-15 18:40:43', NULL),
(33, 38, 'hola soy nuevo', 'prueba', 'correctivo', '2025-05-17 21:09:00', '0000-00-00 00:00:00', 'sabadell', 'en proceso', '5.00', '2025-05-15 19:09:31', NULL),
(34, 37, 'bombilla', 'cambiar bombilla', 'correctivo', '2025-05-15 21:10:00', '2025-05-15 21:10:00', 'luminus CB', 'completado', '10.00', '2025-05-15 19:10:20', NULL),
(40, 47, 'Manteni', 'Tuercad2', 'preventivo', '2025-06-07 18:06:00', '2025-06-21 18:06:00', 'Tuercas', 'en proceso', '60.00', '2025-05-23 16:07:11', 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int(11) NOT NULL,
  `concepto` text NOT NULL,
  `tipo` text NOT NULL,
  `cantidad` decimal(10,2) NOT NULL,
  `fecha` datetime NOT NULL,
  `comentarios` text NOT NULL,
  `idPropiedad` int(11) NOT NULL,
  `idReserva` int(11) DEFAULT NULL,
  `idMantenimiento` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos`
--

INSERT INTO `movimientos` (`id`, `concepto`, `tipo`, `cantidad`, `fecha`, `comentarios`, `idPropiedad`, `idReserva`, `idMantenimiento`) VALUES
(48, 'Reserva Jesus 2025-05-16T12:00/2025-05-18T12:00', 'Ingreso', '300.00', '2025-05-05 01:58:53', '', 37, 25, NULL),
(49, 'Factura luz Abril', 'Gasto', '153.68', '2025-05-05 02:00:23', '', 37, NULL, NULL),
(50, 'Rotura ventana - Chalet calamonte', 'Gasto', '58.76', '2025-05-05 02:09:07', 'Sustitución del cristal', 37, NULL, NULL),
(51, 'Reserva Maria 2025-05-12T11:00/2025-05-18T12:00', 'Ingreso', '510.00', '2025-05-05 02:15:49', '', 38, 26, NULL),
(52, 'Revisión eléctrica - casa rural \"El Roble\"', 'Gasto', '110.00', '2025-05-05 02:18:05', '', 38, NULL, NULL),
(53, 'Reserva Manuel 2024-09-01T00:00/2025-06-30T23:59', 'Ingreso', '5850.00', '2025-05-05 02:27:13', '', 39, 27, NULL),
(58, 'Mantenimiento: cambio bomba de agua', 'Gasto', '75.00', '2025-05-09 00:49:11', '', 37, NULL, 30),
(59, 'Reserva paconi 2025-05-10T00:01/2025-05-11T21:21', 'Ingreso', '200.00', '2025-05-09 21:22:46', '', 38, 28, NULL),
(60, 'Mantenimiento: Impermeabilización Baño', 'Gasto', '120.00', '2025-05-15 20:38:07', '', 39, NULL, 31),
(61, 'Mantenimiento: Costura de sillón', 'Gasto', '0.00', '2025-05-15 20:40:43', '', 38, NULL, 32),
(62, 'Mantenimiento: hola soy nuevo', 'Gasto', '5.00', '2025-05-15 21:09:31', '', 38, NULL, 33),
(63, 'Mantenimiento: bombilla', 'Gasto', '10.00', '2025-05-15 21:10:20', '', 37, NULL, 34),
(67, 'Reserva pedro 2025-05-19T00:00/2025-05-25T23:59', 'Ingreso', '250.00', '2025-05-17 01:47:03', '', 41, 29, NULL),
(72, 'Reserva Pacote 2025-05-24T18:02/2025-06-01T18:02', 'Ingreso', '1000.00', '2025-05-23 12:03:50', '', 47, 31, NULL),
(73, 'Mantenimiento: Manteni', 'Gasto', '40.00', '2025-05-23 12:07:11', '', 47, NULL, 40);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `propiedades`
--

CREATE TABLE `propiedades` (
  `id` int(11) NOT NULL,
  `imagenes` text NOT NULL DEFAULT '\'../uploads/imagenes/default.png\'',
  `nombre` varchar(30) NOT NULL,
  `direccion` text NOT NULL,
  `ciudad` text NOT NULL,
  `codigo_postal` varchar(12) NOT NULL,
  `tipo` text NOT NULL,
  `latitud` float(10,6) NOT NULL,
  `longitud` float(10,6) NOT NULL,
  `precio` float NOT NULL,
  `frecuencia_pago` text NOT NULL,
  `disponibilidad` tinyint(1) NOT NULL DEFAULT 1,
  `tamanio` float NOT NULL,
  `numeroHabitaciones` int(11) NOT NULL,
  `numeroBanios` int(11) NOT NULL,
  `planta` int(11) DEFAULT NULL,
  `anioConstruccion` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `propiedades`
--

INSERT INTO `propiedades` (`id`, `imagenes`, `nombre`, `direccion`, `ciudad`, `codigo_postal`, `tipo`, `latitud`, `longitud`, `precio`, `frecuencia_pago`, `disponibilidad`, `tamanio`, `numeroHabitaciones`, `numeroBanios`, `planta`, `anioConstruccion`, `idUsuario`) VALUES
(37, '../uploads/imagenes/house-1477041_1280.jpg', 'chalet Calamonte', 'calle Dolores Ibarruri, 35', 'Calamonte', '06810', 'Chalet', 38.894890, -6.389776, 150, 'noche', 1, 300, 4, 2, 0, 2011, 2),
(38, '../uploads/imagenes/home-1622401_1280.jpg,../uploads/imagenes/house-2469067_1280.jpg', 'Casa rural \"El Roble\"', 'calle roble, 3', 'Trujillo', '10200', 'Chalet', 39.469898, -5.876300, 90, 'noche', 1, 120, 2, 1, 3, 2002, 2),
(39, '../uploads/imagenes/default.png', 'Apartamento Centro', 'Av. Libertad 45', 'Badajoz', '6005', 'Apartamento', 38.877869, -6.970314, 650, 'mes', 0, 80, 3, 1, 2, 2004, 2),
(41, '../uploads/imagenes/mcs.jpg', 'Local comercial Barcelona', 'calle Barcelona, 56', 'Barcelona', '58494', 'Otro', 41.383327, 2.183661, 500, 'mes', 1, 110, 0, 2, 0, 1998, 1),
(47, '../uploads/imagenes/default.png', 'Pacote CASA', 'Aqui nÂº 2', 'alli', '6450', 'Casa', 40.543587, -4.784546, 59990, 'semana', 1, 2000, 100, 50, 4, 2035, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `idPropiedad` int(11) NOT NULL,
  `nombreInquilino` text NOT NULL,
  `apellidosInquilino` text NOT NULL,
  `dniInquilino` varchar(9) NOT NULL,
  `fechaInicio` datetime NOT NULL,
  `fechaFin` datetime NOT NULL,
  `emailInquilino` text NOT NULL,
  `telefonoInquilino` varchar(9) NOT NULL,
  `cobro` decimal(10,2) NOT NULL,
  `notas` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reservas`
--

INSERT INTO `reservas` (`id`, `idPropiedad`, `nombreInquilino`, `apellidosInquilino`, `dniInquilino`, `fechaInicio`, `fechaFin`, `emailInquilino`, `telefonoInquilino`, `cobro`, `notas`) VALUES
(25, 37, 'Jesus', 'Navas Salomon', '65984525I', '2025-05-16 12:00:00', '2025-05-18 12:00:00', 'jesusNS@gmail.com', '625845984', '300.00', 'Paga en efectivo a la llegada lo restante, reserva de 50e por bizum'),
(26, 38, 'Maria', 'Pino Tejeda', '84598562L', '2025-05-12 11:00:00', '2025-05-18 12:00:00', 'mariaaptejeda@hotmail.com', '695845789', '510.00', 'Paga todo por adelantado por transferencia bancaria'),
(27, 39, 'Manuel', 'Quesada Ruiz', '84596215P', '2024-09-01 00:00:00', '2025-06-30 23:59:00', 'manuqr@gmail.com', '521458595', '5850.00', 'Pago mensual por banco'),
(28, 38, 'paconi', 'tecoha', '51845515L', '2025-05-10 10:00:00', '2025-05-11 21:21:00', 'paconijuan@gmail.com', '365148956', '200.00', ''),
(29, 41, 'pedro', 'gonzalez ruiz', '49591624l', '2025-05-19 00:00:00', '2025-05-25 23:59:00', 'pedroGR@gmail.com', '584595362', '250.00', ''),
(31, 47, 'Pacote', 'Pajote', '987654321', '2025-05-24 18:02:00', '2025-06-01 18:02:00', 'admin@admin.inc', '654545454', '1000.00', 'Hola');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(15) DEFAULT NULL,
  `direccion` text DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellidos`, `email`, `contrasena`, `telefono`, `direccion`, `fecha_registro`) VALUES
(1, 'David', 'García Rodríguez', 'david@propigest.es', '$2y$10$BK4MfqYzNgcz2kq6PUi6V.cSmfqDzR9jeE/71K1.Sjwy0DrWyxjSm', '600123456', 'Calle Falsa 123, Ciudad X', '2025-01-16 23:18:20'),
(2, 'Raquel', 'Portugal Iglesias', 'raquel@prueba.com', '$2a$12$MEVVDWzSjfXorlLXd87d2eADgxf0b0RnIYsH7XOKlwLEcs77Ze.ia', '600654321', 'Avenida Siempre Viva 456, Ciudad Y', '2025-01-16 23:18:20'),
(4, 'paco', 'gonzalez gonzalez', 'pacogonz@gmail.com', '$2y$10$2W8fPkO.FSX9ykXWc0dd6u3Kyxw1JVecPWGs.k0pMD8HcsTLjLhCO', '698475849', 'calle don pepito 28 1ºC, Mérida, Badajoz', '2025-05-17 23:26:36'),
(5, 'Pacote', 'Palotes', 'Pacote@gmail.com', '$2y$10$Rd2JDRNDrB2079NuBip04Oex8EIMkfOQUHJw2YF2JpThV..Wgk5Be', '623456789', 'Aqui nÂº 2', '2025-05-23 15:54:40');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPropiedad` (`idPropiedad`);

--
-- Indices de la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPropiedad` (`idPropiedad`),
  ADD KEY `idDocumento` (`idDocumento`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPropiedad` (`idPropiedad`),
  ADD KEY `idMantenimiento` (`idMantenimiento`),
  ADD KEY `idReserva` (`idReserva`) USING BTREE;

--
-- Indices de la tabla `propiedades`
--
ALTER TABLE `propiedades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`idUsuario`) USING BTREE;

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idPropiedad` (`idPropiedad`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `documentos`
--
ALTER TABLE `documentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `propiedades`
--
ALTER TABLE `propiedades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`idPropiedad`) REFERENCES `propiedades` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `mantenimientos`
--
ALTER TABLE `mantenimientos`
  ADD CONSTRAINT `mantenimientos_ibfk_1` FOREIGN KEY (`idPropiedad`) REFERENCES `propiedades` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mantenimientos_ibfk_2` FOREIGN KEY (`idDocumento`) REFERENCES `documentos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`idPropiedad`) REFERENCES `propiedades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`idReserva`) REFERENCES `reservas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movimientos_ibfk_3` FOREIGN KEY (`idMantenimiento`) REFERENCES `mantenimientos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `propiedades`
--
ALTER TABLE `propiedades`
  ADD CONSTRAINT `propiedades_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`idPropiedad`) REFERENCES `propiedades` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
