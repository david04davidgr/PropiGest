<?php
session_start();

if (!isset($_SESSION['autenticado']) || $_SESSION['autenticado'] !== true) {
    http_response_code(401); //Respuesta de NO autorizado
    echo json_encode(["error" => "No estás autorizado"]);
    exit();
}
?>