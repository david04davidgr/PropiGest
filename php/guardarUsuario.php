<?php
include 'conexion.php';

header('Content-Type: application/json');

$campos_obligatorios = ['nombre', 'apellidos', 'email', 'password', 'telefono', 'direccion'];

foreach ($campos_obligatorios as $campo) {
    if (!isset($_POST[$campo]) || $_POST[$campo] === '') {
        echo json_encode(['success' => false, 'message' => "El campo '$campo' es obligatorio."]);
        exit;
    }
}

$nombre = $_POST['nombre'];
$apellidos = $_POST['apellidos'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);
$telefono = $_POST['telefono'];
$direccion = $_POST['direccion'];

$sql = "INSERT INTO usuarios
        (nombre, apellidos, email, contrasena, telefono, direccion)
        values (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => "Error en prepare: " . $conn->error]);
    exit;
}

$stmt->bind_param("ssssss", 
    $nombre, $apellidos, $email, $password, $telefono, $direccion
);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => "Usuario registrado correctamente"]);
} else {
    echo json_encode(['success' => false, 'message' => "Error al registrar usuario: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>