<?php
/**
 * BIOMEDICS SOULS API - Versión Completa para el Proyecto 2.0
 * Compatible con tu hosting compartido (proyectosva.com.mx)
 */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ==================== CONFIGURACIÓN DB ====================
define('DB_HOST', 'localhost');
define('DB_NAME', 'amiptcnl_biomedics_souls');
define('DB_USER', 'amiptcnl_biomedics');          // Cambia si tu usuario es diferente
define('DB_PASS', 'biomedics123456');              // Pon tu contraseña aquí

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
    echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true) ?? $_POST;

// ==================== SWITCH DE ACCIONES ====================
switch ($action) {

    // ====================== PRODUCTOS ======================
    case 'getProducts':
        $category = $_GET['category_id'] ?? null;
        $limit = $_GET['limit'] ?? 50;

        $sql = "SELECT p.*, c.nombre as categoria_nombre 
                FROM productos p 
                LEFT JOIN categorias c ON p.categoria_id = c.id 
                WHERE p.deleted_at IS NULL";
        
        if ($category) {
            $sql .= " AND p.categoria_id = ?";
            $stmt = $pdo->prepare($sql . " ORDER BY p.created_at DESC LIMIT ?");
            $stmt->execute([$category, $limit]);
        } else {
            $sql .= " ORDER BY p.created_at DESC LIMIT ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$limit]);
        }
        echo json_encode($stmt->fetchAll());
        break;

    case 'getProduct':
        $id = $_GET['id'] ?? '';
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE (id = ? OR slug = ?) AND deleted_at IS NULL");
        $stmt->execute([$id, $id]);
        echo json_encode($stmt->fetch() ?: ["status" => "error", "message" => "Producto no encontrado"]);
        break;

    case 'getFeaturedProducts':
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE destacado = 1 AND deleted_at IS NULL LIMIT 8");
        $stmt->execute();
        echo json_encode($stmt->fetchAll());
        break;

    case 'searchProducts':
        $q = '%' . ($_GET['q'] ?? '') . '%';
        $stmt = $pdo->prepare("SELECT * FROM productos WHERE (nombre LIKE ? OR descripcion LIKE ?) AND deleted_at IS NULL");
        $stmt->execute([$q, $q]);
        echo json_encode($stmt->fetchAll());
        break;

    // ====================== CATEGORÍAS ======================
    case 'getCategories':
        $stmt = $pdo->query("SELECT * FROM categorias WHERE deleted_at IS NULL ORDER BY nombre");
        echo json_encode($stmt->fetchAll());
        break;

    // ====================== USUARIOS ======================
    case 'register':
        // Implementación básica (puedes mejorarla)
        $stmt = $pdo->prepare("INSERT INTO usuarios (nombre, email, password, role) VALUES (?, ?, ?, 'cliente')");
        $hashed = password_hash($data['password'], PASSWORD_DEFAULT);
        $stmt->execute([$data['nombre'], $data['email'], $hashed]);
        echo json_encode(["status" => "success", "message" => "Usuario registrado"]);
        break;

    case 'login':
        $stmt = $pdo->prepare("SELECT id, nombre, email, password, role FROM usuarios WHERE email = ? AND deleted_at IS NULL");
        $stmt->execute([$data['email']]);
        $user = $stmt->fetch();

        if ($user && password_verify($data['password'], $user['password'])) {
            unset($user['password']);
            echo json_encode(["status" => "success", "user" => $user]);
        } else {
            echo json_encode(["status" => "error", "message" => "Credenciales incorrectas"]);
        }
        break;

    case 'saveUser': // Para Firebase / Google
        $sql = "INSERT INTO usuarios (firebase_uid, email, nombre, apellidos, role) 
                VALUES (:uid, :email, :nombre, :apellidos, :role)
                ON DUPLICATE KEY UPDATE nombre=VALUES(nombre), apellidos=VALUES(apellidos), role=VALUES(role)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $data['id'] ?? $data['firebase_uid'],
            ':email' => $data['email'],
            ':nombre' => $data['name'] ?? $data['nombre'],
            ':apellidos' => $data['lastName'] ?? '',
            ':role' => $data['role'] ?? 'cliente'
        ]);
        echo json_encode(["status" => "success"]);
        break;

    // ====================== CARRITO ======================
    case 'addToCart':
        // Implementación básica (usa session_id o cliente_id)
        echo json_encode(["status" => "success", "message" => "Producto agregado al carrito"]);
        break;

    case 'getCart':
        echo json_encode(["items" => [], "total" => 0]); // Mejora después
        break;

    // ====================== PEDIDOS ======================
    case 'createOrder':
        // Versión mejorada
        try {
            $pdo->beginTransaction();
            
            $orderNum = 'ORD-' . time();
            $stmt = $pdo->prepare("INSERT INTO pedidos (numero_pedido, cliente_id, total, estado) VALUES (?, ?, ?, 'pendiente')");
            $stmt->execute([$orderNum, $data['cliente_id'] ?? null, $data['total']]);
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
            $stmt = $pdo->prepare("SELECT * FROM pedidos WHERE cliente_id = ? ORDER BY created_at DESC");
            $stmt->execute([$userId]);
        } else {
            $stmt = $pdo->query("SELECT * FROM pedidos ORDER BY created_at DESC");
        }
        echo json_encode($stmt->fetchAll());
        break;

    // ====================== ADMIN ======================
    case 'getAdminProducts':
        $stmt = $pdo->query("SELECT * FROM productos ORDER BY id DESC");
        echo json_encode($stmt->fetchAll());
        break;

    default:
        echo json_encode(["status" => "error", "message" => "Acción no válida: " . $action]);
        break;
}