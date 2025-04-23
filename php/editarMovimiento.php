<?php
include 'verificarSesion.php';
require_once 'conexion.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se recibieron los datos necesarios
if (isset($data['id'], $data['concepto'], $data['tipo'], $data['cantidad'], $data['idPropiedad'])) {
    $id = intval($data['id']);
    $concepto = $data['concepto'];
    $tipo = $data['tipo'];
    $cantidad = $data['cantidad'];
    $comentario = $data['comentario'] ?? null;
    $idPropiedad = $data['idPropiedad'];

    try {
        $stmt = $pdo->prepare("UPDATE movimientos SET concepto = ?, tipo = ?, cantidad = ?, comentarios = ?, idPropiedad = ? WHERE id = ?");

        $stmt->execute([$concepto, $tipo, $cantidad, $comentario, $idPropiedad, $id]);

        echo json_encode(["success" => true, "message" => "Movimiento actualizada correctamente"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error al actualizar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
?>