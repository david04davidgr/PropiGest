<?php
include 'verificarSesion.php';
require_once 'conexion.php';

header("Content-Type: application/json");

//Comprueba si se recibió la solicitud correctamente con el id
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['idReserva'])) {
    $idReserva = intval($_POST['idReserva']); //Convertir a entero para mayor seguridad

    try {
        $pdo->beginTransaction();

        //Eliminar el movimiento de la base de datos
        $stmt = $pdo->prepare("DELETE FROM reservas WHERE id = ?");
        $stmt->execute([$idReserva]);

        $pdo->commit(); //Confirmar cambios

        echo json_encode(["success" => true, "message" => "Reserva eliminada correctamente"]);
    } catch (Exception $e) {
        $pdo->rollBack(); //Revertir cambios si hay error
        echo json_encode(["success" => false, "message" => "Error al eliminar: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Solicitud no válida"]);
}
?>
