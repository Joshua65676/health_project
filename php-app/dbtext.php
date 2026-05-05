<?php
try {
    $pdo = new PDO("mysql:host=mysql;dbname=mydb", "root", "root");
    echo "MySQL connection successful!";
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}
