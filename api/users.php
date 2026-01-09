<?php
// api/users.php
// Gestión de usuarios y autenticación

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

try {
    switch ($method) {
        case 'GET':
            handleGetUser();
            break;
        case 'POST':
            handleCreateUser();
            break;
        case 'PUT':
            handleUpdateUser();
            break;
        case 'DELETE':
            handleDeleteUser();
            break;
        default:
            throw new Exception('Método no permitido');
    }
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}

function handleGetUser() {
    global $db;
    
    $userId = $_GET['id'] ?? null;
    
    if (!$userId) {
        throw new Exception('ID de usuario requerido');
    }
    
    $stmt = $db->prepare('SELECT id, email, username, dogName, subscription, createdAt FROM users WHERE id = ?');
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Usuario no encontrado');
    }
    
    echo json_encode($result->fetch_assoc());
    $stmt->close();
}

function handleCreateUser() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = $input['email'] ?? null;
    $username = $input['username'] ?? null;
    $password = $input['password'] ?? null;
    $dogName = $input['dogName'] ?? null;
    
    if (!$email || !$username || !$password) {
        throw new Exception('Faltan datos requeridos');
    }
    
    // Hash de contraseña
    $passwordHash = password_hash($password, PASSWORD_BCRYPT);
    
    $stmt = $db->prepare('INSERT INTO users (email, username, password, dogName, subscription) VALUES (?, ?, ?, ?, "basic")');
    $stmt->bind_param('ssss', $email, $username, $passwordHash, $dogName);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al crear usuario: ' . $stmt->error);
    }
    
    $userId = $db->lastInsertId();
    
    echo json_encode([
        'id' => $userId,
        'email' => $email,
        'username' => $username,
        'dogName' => $dogName,
        'subscription' => 'basic',
        'message' => 'Usuario creado exitosamente'
    ]);
    
    $stmt->close();
}

function handleUpdateUser() {
    global $db;
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $userId = $input['id'] ?? null;
    $subscription = $input['subscription'] ?? null;
    
    if (!$userId || !$subscription) {
        throw new Exception('Faltan datos requeridos');
    }
    
    $stmt = $db->prepare('UPDATE users SET subscription = ? WHERE id = ?');
    $stmt->bind_param('si', $subscription, $userId);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al actualizar usuario');
    }
    
    echo json_encode(['message' => 'Usuario actualizado', 'subscription' => $subscription]);
    $stmt->close();
}

function handleDeleteUser() {
    global $db;
    
    $userId = $_GET['id'] ?? null;
    
    if (!$userId) {
        throw new Exception('ID de usuario requerido');
    }
    
    $stmt = $db->prepare('DELETE FROM users WHERE id = ?');
    $stmt->bind_param('i', $userId);
    
    if (!$stmt->execute()) {
        throw new Exception('Error al eliminar usuario');
    }
    
    echo json_encode(['message' => 'Usuario eliminado']);
    $stmt->close();
}
?>
