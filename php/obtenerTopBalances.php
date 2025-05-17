<?php
include 'verificarSesion.php';
include 'conexion.php';

try {
    $stmt = $pdo->prepare("
        SELECT 
            p.id,
            p.nombre,
            p.imagenes,
            SUM(CASE WHEN m.tipo = 'ingreso' THEN m.cantidad ELSE 0 END) AS totalIngresos,
            SUM(CASE WHEN m.tipo = 'gasto' THEN m.cantidad ELSE 0 END) AS totalGastos,
            (SUM(CASE WHEN m.tipo = 'ingreso' THEN m.cantidad ELSE 0 END) - 
            SUM(CASE WHEN m.tipo = 'gasto' THEN m.cantidad ELSE 0 END)) AS balance,
            COUNT(m.id) AS totalMovimientos
        FROM 
            propiedades p
        LEFT JOIN 
            movimientos m ON p.id = m.idPropiedad
        WHERE 
            p.idUsuario = ?
        GROUP BY 
            p.id, p.nombre  
        ORDER BY `balance` DESC
    ");
    $stmt->execute([$_SESSION['usuario_id']]);
    $stmt->execute();
    $movimientos = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    if ($movimientos && count($movimientos) > 0) {
        echo json_encode($movimientos);
    } else {
        echo json_encode(["error" => "No hay movimientos disponibles para este usuario"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Error en la consulta SQL: " . $e->getMessage()]);
}

?>
