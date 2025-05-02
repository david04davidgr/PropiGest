<?php
include 'verificarSesion.php';
require_once 'conexion.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se recibieron los datos necesarios
if (isset($data['id'], $data['fechaInicio'], $data['fechaFin'], $data['cobro'], $data['nombreInquilino'], $data['apellidosInquilino'], $data['dniInquilino'], $data['telefonoInquilino'])) {
    $id = intval($data['id']);
    $fechaInicio = $data['fechaInicio'];
    $fechaFin = $data['fechaFin'];
    $cobro = $data['cobro'];
    $nombreInquilino = $data['nombreInquilino'];
    $apellidosInquilino = $data['apellidosInquilino'];
    $dniInquilino = $data['dniInquilino'];
    $telefonoInquilino = $data['telefonoInquilino'];
    $emailInquilino = $data['emailInquilino'];
    $notas = $data['notas'];

    try {
        $stmt = $pdo->prepare("UPDATE reservas SET fechaInicio = ?, fechaFin = ?, cobro = ?, nombreInquilino = ?, apellidosInquilino = ?, dniInquilino = ?, telefonoInquilino = ?, emailInquilino = ?, notas = ? WHERE id = ?");

        $stmt->execute([$fechaInicio, $fechaFin, $cobro, $nombreInquilino, $apellidosInquilino, $dniInquilino, $telefonoInquilino, $emailInquilino, $notas, $id]);

        $stmtIngreso = $pdo->prepare("UPDATE movimientos SET cantidad = ? WHERE idReserva = ?");
        $stmtIngreso->execute([$cobro, $id]);

        echo json_encode(["success" => true, "message" => "Reserva actualizada correctamente"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error al actualizar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
?>