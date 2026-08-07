<?php
// Contact form handler — sends straight from this hosting account via PHP's
// mail(), so it doesn't depend on the visitor's own email client (mailto:)
// or on a third-party service's dashboard settings. Destination address is
// fixed here in code, not in any external panel.

header("Content-Type: application/json; charset=utf-8");

$to = "Celosias@hadehaus.com.ar";

function respond($success, $message) {
  echo json_encode(["success" => $success, "message" => $message]);
  exit;
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
  http_response_code(405);
  respond(false, "Method not allowed.");
}

// Strips newlines from a value used inside a mail header — otherwise a
// submitted field containing "\r\n" could inject extra headers (classic
// PHP mail() header-injection spam vector).
function clean_header_value($value) {
  return str_replace(["\r", "\n"], "", trim($value));
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

$subject = "Consulta de " . clean_header_value($name) . " — Jade Haus Arq.";

$body = "Nombre: " . $name . "\n" .
        "Email: " . $email . "\n" .
        "Teléfono: " . ($phone !== "" ? $phone : "-") . "\n\n" .
        "Mensaje:\n" . ($message !== "" ? $message : "-");

// From: has to be an address on this same domain, or many mail servers
// (including this one) will flag/reject the message as spoofed — the
// visitor's real address goes in Reply-To instead, so hitting "reply" on
// the received email still goes straight to them.
$headers = "From: Jade Haus Arq. <no-reply@hadehaus.com.ar>\r\n" .
           "Reply-To: " . clean_header_value($name) . " <" . clean_header_value($email) . ">\r\n" .
           "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
  respond(true, "OK");
} else {
  http_response_code(500);
  respond(false, "No se pudo enviar el email.");
}
