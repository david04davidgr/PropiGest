<?php

include 'verificarSesion.php';
include 'conexion.php';

$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['idPropiedad'], $inputData['fechaInicio'], $inputData['fechaFin'], $inputData['nombreInquilino'], $inputData['apellidosInquilino'], $inputData['dniInquilino'], $inputData['telefonoInquilino'], $inputData['emailInquilino'], $inputData['cobro'])) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios']);
    exit;
}

// Recoger los datos
$idPropiedad = $inputData['idPropiedad'];
$fechaIni = $inputData['fechaInicio'];
$fechaFin = $inputData['fechaFin'];
$nombreInquilino = $inputData['nombreInquilino'];
$apellidosInquilino = $inputData['apellidosInquilino'];
$dniInquilino = $inputData['dniInquilino'];
$telefonoInquilino = $inputData['telefonoInquilino'];
$emailInquilino = $inputData['emailInquilino'];
$cobro = $inputData['cobro'];
$notasReserva = $inputData['notasReserva'];

// Preparar la consulta
$sql = "INSERT INTO reservas (idPropiedad, nombreInquilino, apellidosInquilino, dniInquilino, fechaInicio, fechaFin, emailInquilino, telefonoInquilino, cobro, notas)
        VALUES (:idPropiedad, :nombreInquilino, :apellidosInquilino, :dniInquilino, :fechaInicio, :fechaFin, :emailInquilino, :telefonoInquilino, :cobro, :notasReserva)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPropiedad' => $idPropiedad,
        ':fechaInicio' => $fechaIni,
        ':fechaFin' => $fechaFin,
        ':nombreInquilino' => $nombreInquilino,
        ':apellidosInquilino' => $apellidosInquilino,
        ':dniInquilino' => $dniInquilino,
        ':telefonoInquilino' => $telefonoInquilino,
        ':emailInquilino' => $emailInquilino,
        ':cobro' => $cobro,
        ':notasReserva' => $notasReserva,
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}

?>