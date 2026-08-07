<?php
// Contact form handler — sends via authenticated SMTP (through the real
// Celosias@hadehaus.com.ar mailbox) instead of PHP's bare mail(), which
// tested as accepted-but-never-delivered to Gmail (no SPF/DKIM on shared
// hosting, so Gmail silently drops it). Authenticated SMTP through a real
// mailbox is what actually lands in the inbox.

require __DIR__ . "/lib/phpmailer/Exception.php";
require __DIR__ . "/lib/phpmailer/PHPMailer.php";
require __DIR__ . "/lib/phpmailer/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Content-Type: application/json; charset=utf-8");

// ============================================================
// EDITAR ANTES DE SUBIR: poné la contraseña real del email
// Celosias@hadehaus.com.ar entre las comillas de abajo.
// ============================================================
$smtp_password = "PONE_LA_CONTRASEÑA_ACA";

$smtp_host = "mail.hadehaus.com.ar";
$smtp_user = "Celosias@hadehaus.com.ar";
$smtp_port = 587;
$to = "Celosias@hadehaus.com.ar";

function respond($success, $message) {
  echo json_encode(["success" => $success, "message" => $message]);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  respond(false, "Method not allowed.");
}

// Honeypot — a field real visitors never see or fill in; only bots that
// blindly fill every input trip it. Silently "succeeds" without sending.
if (!empty($_POST["website"])) {
  respond(true, "OK");
}

$name = isset($_POST["name"]) ? trim($_POST["name"]) : "";
$email = isset($_POST["email"]) ? trim($_POST["email"]) : "";
$phone = isset($_POST["phone"]) ? trim($_POST["phone"]) : "";
$message = isset($_POST["message"]) ? trim($_POST["message"]) : "";

if ($name === "" || $email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(422);
  respond(false, "Falta el nombre o el email no es válido.");
}

$body = "Nombre: " . $name . "\n" .
        "Email: " . $email . "\n" .
        "Teléfono: " . ($phone !== "" ? $phone : "-") . "\n\n" .
        "Mensaje:\n" . ($message !== "" ? $message : "-");

$mail = new PHPMailer(true);
try {
  $mail->isSMTP();
  $mail->Host = $smtp_host;
  $mail->SMTPAuth = true;
  $mail->Username = $smtp_user;
  $mail->Password = $smtp_password;
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  $mail->Port = $smtp_port;
  $mail->CharSet = "UTF-8";

  $mail->setFrom($smtp_user, "Jade Haus Arq.");
  $mail->addAddress($to);
  // Real visitor's address goes here — hitting "reply" on the received
  // email goes straight to them, not back to the site's own mailbox.
  $mail->addReplyTo($email, $name);

  $mail->Subject = "Consulta de " . $name . " — Jade Haus Arq.";
  $mail->Body = $body;

  $mail->send();
  respond(true, "OK");
} catch (Exception $e) {
  http_response_code(500);
  respond(false, "No se pudo enviar: " . $mail->ErrorInfo);
}
