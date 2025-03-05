<?php
$servername = "localhost";
$username = "root";
$password = ""; // Sin contraseña por defecto en XAMPP
$dbname = "alquiler_propiedades";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
    // echo('conexion exitosa');

try {
    $pdo = new PDO("mysql:serverName=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error al conectar a la base de datos: " . $e->getMessage());
}
?>
