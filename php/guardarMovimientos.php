<?php

include 'verificarSesion.php';
include 'conexion.php';

$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['idPropiedad'], $inputData['concepto'], $inputData['cantidad'], $inputData['tipo'])) {
    echo json_encode(['success' => false, 'error' => 'Faltan datos obligatorios']);
    exit;
}

// Recoger los datos
$idPropiedad = $inputData['idPropiedad'];
$concepto = $inputData['concepto'];
$cantidad = $inputData['cantidad'];
$tipo = $inputData['tipo']; // 'Ingreso' o 'Gasto'
$comentarios = isset($inputData['comentarios']) ? $inputData['comentarios'] : '';
$fecha = isset($inputData['fecha']) && !empty($inputData['fecha']) ? $inputData['fecha'] : date('Y-m-d H:i:s');

// Preparar la consulta
$sql = "INSERT INTO movimientos (idPropiedad, concepto, cantidad, tipo, comentarios, fecha)
        VALUES (:idPropiedad, :concepto, :cantidad, :tipo, :comentarios, :fecha)";

try {
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':idPropiedad' => $idPropiedad,
        ':concepto' => $concepto,
        ':cantidad' => $cantidad,
        ':tipo' => $tipo,
        ':comentarios' => $comentarios,
        ':fecha' => $fecha
    ]);

    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Error en la base de datos: ' . $e->getMessage()]);
}

?>