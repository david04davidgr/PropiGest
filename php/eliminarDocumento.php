<?php
include 'verificarSesion.php';
require_once 'conexion.php';

header('Content-Type: application/json');

// Recibe y decodifica JSON
$input = json_decode(file_get_contents('php://input'), true);
$idDocumento = isset($input['idDocumento']) ? intval($input['idDocumento']) : 0;

if ($idDocumento <= 0) {
    echo json_encode(['success' => false, 'error' => 'ID no válido']);
    exit;
}

// Elimina el documento
try {
    // Inicia la transacción
    $conn->begin_transaction();

    // 1. Eliminar documento de la tabla 'documentos'
    $stmt = $conn->prepare("DELETE FROM documentos WHERE id = ?");
    $stmt->bind_param("i", $idDocumento);
    $stmt->execute();
    
    if ($stmt->affected_rows > 0) {
        // 2. Actualizar la tabla 'mantenimientos' para poner idDocumento a NULL
        $stmt = $conn->prepare("UPDATE mantenimientos SET idDocumento = NULL WHERE idDocumento = ?");
        $stmt->bind_param("i", $idDocumento);
        $stmt->execute();

        if ($stmt->affected_rows >= 0) {
            // Todo fue bien, confirmar la transacción
            $conn->commit();
            echo json_encode(['success' => true]);
        } else {
            // Si hubo un problema al actualizar mantenimientos, revertir la transacción
            $conn->rollback();
            echo json_encode(['success' => false, 'error' => 'No se pudo actualizar la tabla de mantenimientos']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'No se encontró el documento o ya fue eliminado']);
    }

    // Cerrar conexiones
    $stmt->close();
    $conn->close();

} catch (mysqli_sql_exception $e) {
    // Si algo falla, revertir la transacción
    $conn->rollback();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
