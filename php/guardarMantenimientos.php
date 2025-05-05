<?php
include 'verificarSesion.php';
include 'conexion.php';

$campos_obligatorios = ['titulo', 'descripcion', 'tipo', 'estado', 'fechaProgramada'];
foreach ($campos_obligatorios as $campo) {
    if (empty($_POST[$campo])) {
        echo json_encode(["error" => true, "message" => "Error: El campo '$campo' es obligatorio."]);
        exit;
    }
}

$titulo = $_POST['titulo'];
$descripcion = $_POST['descripcion'];
$tipo = $_POST['tipo'];
$estado = $_POST['estado'];
$fechaProgramada = $_POST['fechaProgramada'];
$fechaRealizacion = $_POST['fechaRealizacion'] ?? null;
$coste = $_POST['coste'];
$empresa = $_POST['empresa'] ?? null;
$idPropiedad = $_POST['idPropiedad'];

$stmt = $conn->prepare("INSERT INTO mantenimientos (titulo, descripcion, tipo, estado, fechaProgramada, fechaRealizacion, coste, empresa, idPropiedad) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssssdsi", 
    $titulo, $descripcion, $tipo, $estado, $fechaProgramada, $fechaRealizacion, $coste, $empresa, $idPropiedad);

if (!$stmt->execute()) {
    echo json_encode(["error" => true, "message" => "Error al insertar mantenimiento: " . $stmt->error]);
    exit;
}
$idMantenimiento = $stmt->insert_id;
$stmt->close();

if (isset($_FILES['factura']) && $_FILES['factura']['error'] === UPLOAD_ERR_OK) {
    $factura = $_FILES['factura'];
    $nombre_original = $factura['name'];
    $tmp_name = $factura['tmp_name'];
    $tipo_archivo = mime_content_type($tmp_name);

    $directorio = '../uploads/archivos/';
    if (!is_dir($directorio)) {
        mkdir($directorio, 0777, true);
    }

    $ruta_destino = $directorio . basename($nombre_original);
    if (move_uploaded_file($tmp_name, $ruta_destino)) {
        $stmtDoc = $conn->prepare("INSERT INTO documentos (ruta, titulo, tipo, idPropiedad) VALUES (?, ?, ?, ?)");
        $rutaRelativa = '../uploads/archivos/' . basename($nombre_original);
        $stmtDoc->bind_param("sssi", $rutaRelativa, $nombre_original, $tipo_archivo, $idPropiedad);
        
        if ($stmtDoc->execute()) {
            $idDocumento = $stmtDoc->insert_id;
            $stmtDoc->close();

            $stmtUpdate = $conn->prepare("UPDATE mantenimientos SET idDocumento = ? WHERE id = ?");
            $stmtUpdate->bind_param("ii", $idDocumento, $idMantenimiento);
            if (!$stmtUpdate->execute()) {
                echo json_encode(["error" => true, "message" => "Error al actualizar mantenimiento con documento: " . $stmtUpdate->error]);
                exit;
            }
            $stmtUpdate->close();
        } else {
            echo json_encode(["error" => true, "message" => "Error al insertar documento: " . $stmtDoc->error]);
            exit;
        }
    } else {
        echo json_encode(["error" => true, "message" => "Error al mover el archivo."]);
        exit;
    }
}

$conn->close();
echo json_encode(["success" => true, "message" => "Mantenimiento registrado correctamente."]);
?>