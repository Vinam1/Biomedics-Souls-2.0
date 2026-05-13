<?php
/**
 * Biomedics Souls API (PHP Implementation)
 * Use this file on your remote server (proyectosva.com.mx)
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Database Configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'biomedics_souls');
define('DB_USER', 'root'); 
define('DB_PASS', '');

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'getProducts':
        $stmt = $pdo->query("SELECT * FROM productos WHERE deleted_at IS NULL");
        echo json_encode($stmt->fetchAll());
        break;

    case 'getProduct':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE (id = ? OR slug = ?) AND deleted_at IS NULL");
        $stmt->execute([$id, $id]);
        echo json_encode($stmt->fetch() ?: ["error" => "Not found"]);
        break;

    case 'getCategories':
        $stmt = $pdo->query("SELECT * FROM categorias WHERE deleted_at IS NULL");
        echo json_encode($stmt->fetchAll());
        break;

    case 'getUser':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE (firebase_uid = ? OR email = ?) AND deleted_at IS NULL");
        $stmt->execute([$id, $id]);
        echo json_encode($stmt->fetch() ?: ["error" => "Not found"]);
        break;

    case 'saveUser':
        $sql = "INSERT INTO usuarios (firebase_uid, email, nombre, apellidos, role) 
                VALUES (:uid, :email, :nombre, :apellidos, :role)
                ON DUPLICATE KEY UPDATE 
                nombre = VALUES(nombre), apellidos = VALUES(apellidos), role = VALUES(role)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $data['id'],
            ':email' => $data['email'],
            ':nombre' => $data['name'],
            ':apellidos' => $data['lastName'] ?? '',
            ':role' => $data['role'] ?? 'cliente'
        ]);
        echo json_encode(["status" => "success"]);
        break;

    case 'createOrder':
        $pdo->beginTransaction();
        try {
            // Find internal user ID
            $stmtUser = $pdo->prepare("SELECT id FROM usuarios WHERE firebase_uid = ?");
            $stmtUser->execute([$data['clientId']]);
            $user = $stmtUser->fetch();
            $internalId = $user ? $user['id'] : null;

            $orderNum = 'ORD-' . time();
            $stmt = $pdo->prepare("INSERT INTO pedidos (numero_pedido, cliente_id, total) VALUES (?, ?, ?)");
            $stmt->execute([$orderNum, $internalId, $data['total']]);
            $orderId = $pdo->lastInsertId();
            
            $pdo->commit();
            echo json_encode(["status" => "success", "orderId" => $orderId, "orderNumber" => $orderNum]);
        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(["status" => "error", "message" => $e->getMessage()]);
        }
        break;

    case 'getOrders':
        $userId = $_GET['userId'] ?? '';
        if ($userId) {
            $stmt = $pdo->prepare("SELECT p.* FROM pedidos p JOIN usuarios u ON p.cliente_id = u.id WHERE u.firebase_uid = ?");
            $stmt->execute([$userId]);
        } else {
            $stmt = $pdo->query("SELECT * FROM pedidos");
        }
        echo json_encode($stmt->fetchAll());
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Invalid action"]);
        break;
}
