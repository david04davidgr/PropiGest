<?php
session_start();
header('Content-Type: application/json');
include 'conexion.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios"]);
        exit();
    }

    $sql = "SELECT * FROM usuarios WHERE email = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['contrasena'])) {
            $_SESSION['usuario_id'] = $user['id'];
            $_SESSION['usuario_nombre'] = $user['nombre'];
            $_SESSION['usuario_apellidos'] = $user['apellidos'];
            $_SESSION['autenticado'] = true;

            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Usuario/contraseña incorrecta"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Usuario/contraseña incorrecta"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Método no permitido"]);
}
