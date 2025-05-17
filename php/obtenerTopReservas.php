<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            COUNT(r.id) as nReservas,
            p.*
        FROM 
            propiedades p
        INNER JOIN 
            reservas r ON p.id = r.idPropiedad
        WHERE 
            p.idUsuario = ?
            AND r.fechaInicio >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
            AND r.fechaInicio < DATE_FORMAT(CURRENT_DATE + INTERVAL 1 MONTH, '%Y-%m-01')
        GROUP BY 
            p.id
        ORDER BY 
            nReservas DESC
        LIMIT 1
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