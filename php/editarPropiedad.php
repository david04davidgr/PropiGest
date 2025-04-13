<?php
include 'verificarSesion.php';
require_once 'conexion.php';

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Verificar si se recibieron los datos necesarios
if (isset($data['id'], $data['nombre'], $data['tipo'], $data['precio'], $data['direccion'])) {
    $id = intval($data['id']);
    $nombre = $data['nombre'];
    $tipo = $data['tipo'];
    $precio = $data['precio'];
    $direccion = $data['direccion'];
    $frecuencia_pago = $data['frecuencia_pago'] ?? null;
    $disponibilidad = $data['disponibilidad'] ?? null;
    $ciudad = $data['ciudad'] ?? null;
    $codigo_postal = $data['codigo_postal'] ?? null;
    // $latitud = $data['latitud'] ?? null;
    // $longitud = $data['longitud'] ?? null;
    $tamanio = $data['tamanio'] ?? null;
    $planta = $data['planta'] ?? null;
    $habitaciones = $data['habitaciones'] ?? null;
    $banios = $data['banios'] ?? null;
    $anioConstruccion = $data['anioConstruccion'] ?? null;

    try {
        $stmt = $pdo->prepare("UPDATE propiedades SET nombre = ?, tipo = ?, precio = ?, direccion = ?, frecuencia_pago = ?, disponibilidad = ?, ciudad = ?, codigo_postal = ?, tamanio = ?, planta = ?, numeroHabitaciones = ?, numeroBanios = ?, anioConstruccion = ? WHERE id = ?");
        // latitud = ?, longitud = ?, AÑADIR CUANDO SE PUEDA ACTUALIZAR CON MAPA

        $stmt->execute([$nombre, $tipo, $precio, $direccion, $frecuencia_pago, $disponibilidad, $ciudad, $codigo_postal, $tamanio, $planta, $habitaciones, $banios, $anioConstruccion, $id]);
        // $latitud, $longitud, LO MISMO

        echo json_encode(["success" => true, "message" => "Propiedad actualizada correctamente"]);
    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => "Error al actualizar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
?>
