<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    $stmt = $pdo->prepare("
        SELECT r.*, p.nombre
        FROM reservas r
        JOIN propiedades p ON r.idPropiedad = p.id
        WHERE p.idUsuario = ?
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $stmt->execute();
    $reservas = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($reservas && count($reservas) > 0) {
        echo json_encode($reservas);
    } else {
        echo json_encode(["error" => "No hay reservas disponibles para este usuario"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}

?>
