<?php
session_start();
include 'conexion.php'; // Asegúrate de que este archivo contiene la conexión a la base de datos

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    if (empty($email) || empty($password)) {
        $_SESSION['error'] = "Todos los campos son obligatorios";
        header("Location: ../index.php?error=Todos los campos son obligatorios");
        exit();
    }

    $sql = "SELECT id, nombre, apellidos, email, contrasena FROM usuarios WHERE email = ? LIMIT 1";
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
            header("Location: ./../html/inicio.html");
            exit();
        } else {
            $_SESSION['error'] = "Credenciales incorrectas";
            header("Location: ../index.php?error=Credenciales incorrectas");
            exit();
        }
    } else {
        $_SESSION['error'] = "El usuario no existe";
        header("Location: ../index.php?error=El usuario no existe");
        exit();
    }

    $stmt->close();
    $conn->close();
} else {
    header("Location: ../index.php");
    exit();
}
?>
