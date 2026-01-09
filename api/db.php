<?php
// api/db.php
// Conexión a MariaDB y funciones auxiliares

class Database {
    private $host = 'localhost';
    private $db = 'qqxbjuzr_vip';
    private $user = 'qqxbjuzr_soletevip';
    private $password = 'Ev3nt0s+Guau';
    private $conn;
    
    public function connect() {
        try {
            $this->conn = new mysqli($this->host, $this->user, $this->password, $this->db);
            
            // Verificar conexión
            if ($this->conn->connect_error) {
                throw new Exception('Error de conexión: ' . $this->conn->connect_error);
            }
            
            // Establecer charset UTF-8
            $this->conn->set_charset('utf8mb4');
            
            return $this->conn;
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Error de base de datos']);
            die();
        }
    }
    
    public function getConnection() {
        if (!$this->conn) {
            $this->connect();
        }
        return $this->conn;
    }
    
    public function close() {
        if ($this->conn) {
            $this->conn->close();
        }
    }
    
    // Función auxiliar para queries preparadas (seguridad)
    public function prepare($query) {
        return $this->getConnection()->prepare($query);
    }
    
    // Obtener último ID insertado
    public function lastInsertId() {
        return $this->getConnection()->insert_id;
    }
    
    // Ejecutar query y obtener resultados
    public function query($query) {
        return $this->getConnection()->query($query);
    }
}

// Crear instancia global
$db = new Database();
?>
