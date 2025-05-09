<?php
include 'verificarSesion.php';
require_once 'conexion.php';

$hoy = date('Y-m-d');

// Marcar como 'no disponible' propiedades con una reserva activa HOY
$sql1 = "
    UPDATE propiedades
    SET disponibilidad = 0
    WHERE id IN (
        SELECT DISTINCT idPropiedad FROM reservas
        WHERE fechaInicio <= ? AND fechaFin >= ?
    )
";
$stmt1 = $pdo->prepare($sql1);
$stmt1->execute([$hoy, $hoy]);

// Marcar como 'disponible' propiedades sin reservas activas HOY
$sql2 = "
    UPDATE propiedades
    SET disponibilidad = 1
    WHERE id NOT IN (
        SELECT DISTINCT idPropiedad FROM reservas
        WHERE fechaInicio <= ? AND fechaFin >= ?
    )
";
$stmt2 = $pdo->prepare($sql2);
$stmt2->execute([$hoy, $hoy]);

echo "Disponibilidad actualizada correctamente.";