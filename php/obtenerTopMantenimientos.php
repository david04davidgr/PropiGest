<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    // Obtener todos los mantenimientos de las propiedades del usuario logueado
    $stmt = $pdo->prepare("
            SELECT 
                COUNT(m.id) as nMantenimientos,
                p.nombre,
                p.imagenes
            FROM 
                propiedades p
            INNER JOIN 
                mantenimientos m ON p.id = m.idPropiedad
            WHERE 
                p.idUsuario = ?
                AND m.fechaProgramada >= DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')
                AND m.fechaProgramada < DATE_FORMAT(CURRENT_DATE + INTERVAL 1 MONTH, '%Y-%m-01')
            GROUP BY 
                p.id
            ORDER BY 
                nMantenimientos DESC
            LIMIT 1
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $mantenimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($mantenimientos && count($mantenimientos) > 0) {
        echo json_encode($mantenimientos);
    } else {
        echo json_encode(["error" => "No hay mantenimientos disponibles para este usuario"]);
    }

} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}
?>