/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import multer from "multer";
import path from "path";
import db from "../db.js";

const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "public", "uploads", "products"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// File upload route
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/uploads/products/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// DB Init route
router.get("/db-init", async (req, res) => {
  try {
    const queries = [
      `CREATE TABLE IF NOT EXISTS usuarios (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        firebase_uid VARCHAR(128) UNIQUE,
        nombre VARCHAR(100),
        apellidos VARCHAR(100),
        email VARCHAR(150) UNIQUE NOT NULL,
        role ENUM('cliente','admin','superadmin') DEFAULT 'cliente',
        telefono VARCHAR(10),
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )`,
      `CREATE TABLE IF NOT EXISTS categorias (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )`,
      `CREATE TABLE IF NOT EXISTS formas_presentacion (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL UNIQUE
      )`,
      `CREATE TABLE IF NOT EXISTS productos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        categoria_id INT UNSIGNED,
        forma_id INT UNSIGNED,
        nombre VARCHAR(150) NOT NULL,
        slug VARCHAR(150) NOT NULL UNIQUE,
        sku VARCHAR(50) NOT NULL UNIQUE,
        precio DECIMAL(10, 2) NOT NULL,
        precio_descuento DECIMAL(10, 2),
        descripcion_corta VARCHAR(300),
        descripcion_larga MEDIUMTEXT,
        estatus VARCHAR(100) DEFAULT 'publicado',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL
      )`,
      `CREATE TABLE IF NOT EXISTS pedidos (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        numero_pedido VARCHAR(30) NOT NULL UNIQUE,
        cliente_id INT UNSIGNED,
        estado_pedido ENUM('pendiente','pagado','en_preparacion','enviado','entregado','cancelado') DEFAULT 'pendiente',
        total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )`
    ];

    for (const q of queries) {
      await db.query(q);
    }

    // Seed default users
    const defaultUsers = [
      ['admin-uid', 'anderson2050eth@gmail.com', 'Anderson', 'Admin', 'admin'],
      ['user-uid', 'test@biomedics.com', 'Usuario', 'Demo', 'cliente']
    ];

    for (const u of defaultUsers) {
      await db.query(
        "INSERT IGNORE INTO usuarios (firebase_uid, email, nombre, apellidos, role) VALUES (?, ?, ?, ?, ?)",
        u
      );
    }

    res.json({ status: "success", message: "Base de datos inicializada y usuarios semilla creados" });
  } catch (error) {
    console.error("Database initialization error:", error);
    res.status(500).json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

// General Action Handler to match PHP logic
router.get("/", async (req, res) => {
  const { action } = req.query;

  try {
    switch (action) {
      case 'getProducts': {
        const [rows] = await db.query("SELECT * FROM productos WHERE deleted_at IS NULL");
        return res.json(rows);
      }
      case 'getProduct': {
        const { id } = req.query;
        // Search by ID or firebase_uid or slug
        const [rows]: any = await db.query(
          "SELECT * FROM productos WHERE (id = ? OR slug = ?) AND deleted_at IS NULL", 
          [id, id]
        );
        return res.json(rows[0] || { error: "Not found" });
      }
      case 'getCategories': {
        const [rows] = await db.query("SELECT * FROM categorias WHERE deleted_at IS NULL");
        return res.json(rows);
      }
      case 'getUser': {
        const { id } = req.query;
        const [rows]: any = await db.query(
          "SELECT * FROM usuarios WHERE (firebase_uid = ? OR email = ?) AND deleted_at IS NULL", 
          [id, id]
        );
        return res.json(rows[0] || { error: "Not found" });
      }
      case 'getOrders': {
        const { userId } = req.query;
        let query = "SELECT * FROM pedidos";
        let params = [];
        if (userId) {
          // find internal id first or use firebase_uid
          const [u]: any = await db.query("SELECT id FROM usuarios WHERE firebase_uid = ?", [userId]);
          if (u[0]) {
            query += " WHERE cliente_id = ?";
            params.push(u[0].id);
          }
        }
        const [rows] = await db.query(query, params);
        return res.json(rows);
      }
      default:
        return res.status(404).json({ error: "Action not handled via GET" });
    }
  } catch (error) {
    console.error(`Error in action ${action}:`, error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
    const { action } = req.query;
    const data = req.body;

    try {
        switch (action) {
            case 'saveUser': {
                const { id, email, name, lastName, role } = data;
                const query = `
                    INSERT INTO usuarios (firebase_uid, email, nombre, apellidos, role)
                    VALUES (?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        nombre = VALUES(nombre),
                        apellidos = VALUES(apellidos),
                        role = VALUES(role)
                `;
                await db.query(query, [id, email, name, lastName, role || 'cliente']);
                return res.json({ status: "success" });
            }
            case 'saveProduct': {
                const { id, name, price, shortDesc, status } = data;
                // Simplified save
                if (id) {
                    await db.query(
                        "UPDATE productos SET nombre = ?, precio = ?, descripcion_corta = ?, estatus = ? WHERE id = ?",
                        [name, price, shortDesc, status, id]
                    );
                }
                return res.json({ status: "success" });
            }
            case 'createOrder': {
                const { clientId, total } = data;
                const [u]: any = await db.query("SELECT id FROM usuarios WHERE firebase_uid = ?", [clientId]);
                const internalId = u[0]?.id || null;
                const orderNum = 'ORD-' + Date.now();
                const [result]: any = await db.query(
                    "INSERT INTO pedidos (numero_pedido, cliente_id, total) VALUES (?, ?, ?)",
                    [orderNum, internalId, total]
                );
                return res.json({ status: "success", orderId: result.insertId, orderNumber: orderNum });
            }
            default:
                return res.status(404).json({ error: "Action not handled via POST" });
        }
    } catch (error) {
        console.error(`Error in POST action ${action}:`, error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// DB Test route
router.get("/db-test", async (req, res) => {
  try {
    const [rows]: any = await db.query('SELECT NOW() as now');
    res.json({ 
      status: "connected", 
      time: rows[0].now,
      database: process.env.DB_NAME
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({ 
      status: "error", 
      message: error instanceof Error ? error.message : "Unknown error" 
    });
  }
});

export default router;
