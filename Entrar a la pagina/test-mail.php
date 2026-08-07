<?php
// One-off test script — NOT part of the real contact form. Visiting this
// URL directly sends a test email via authenticated SMTP (through the real
// Celosias@jadehaus.com.ar mailbox) to confirm delivery actually works.
// Delete this file from the server once the test is done.

require __DIR__ . "/lib/phpmailer/Exception.php";
require __DIR__ . "/lib/phpmailer/PHPMailer.php";
require __DIR__ . "/lib/phpmailer/SMTP.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Content-Type: text/plain; charset=utf-8");

// ============================================================
// EDITAR ANTES DE SUBIR: misma contraseña que pusiste en contact.php
// ============================================================
$smtp_password = "PONE_LA_CONTRASEÑA_ACA";

$smtp_host = "mail.jadehaus.com.ar";
$smtp_user = "Celosias@jadehaus.com.ar";
$smtp_port = 587;

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
  $mail->addAddress("federiconevi@gmail.com");

  $mail->Subject = "Prueba SMTP - Jade Haus Arq.";
  $mail->Body = "Si estas leyendo esto, el envio por SMTP autenticado funciona.\n\nHora del servidor: " . date("Y-m-d H:i:s");

  $mail->send();
  echo "OK: se envio correctamente por SMTP. Revisa federiconevi@gmail.com (y la carpeta de Spam).\n";
} catch (Exception $e) {
  echo "ERROR: " . $mail->ErrorInfo . "\n";
}
