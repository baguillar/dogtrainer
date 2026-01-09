<?php
// api/redsys_sign.php
// Firma transacciones de Redsys de forma segura en el servidor

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

// Tu clave secreta de Redsys (NUNCA en cliente)
$REDSYS_SECRET_KEY = 'sq7HjrUOBfKmC576ILgskD5srU870gJ7';

try {
    // Obtener JSON del cliente
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        throw new Exception('Datos inválidos');
    }
    
    // Extraer parámetros
    $amount = $input['amount'] ?? null;
    $order = $input['order'] ?? null;
    $merchantCode = $input['merchantCode'] ?? null;
    $terminal = $input['terminal'] ?? null;
    $currency = $input['currency'] ?? null;
    
    // Validar datos
    if (!$amount || !$order || !$merchantCode || !$terminal || !$currency) {
        throw new Exception('Faltan parámetros requeridos');
    }
    
    // Construir parámetros para Redsys
    $merchantParameters = [
        'DS_MERCHANT_AMOUNT' => $amount,
        'DS_MERCHANT_ORDER' => $order,
        'DS_MERCHANT_MERCHANTCODE' => $merchantCode,
        'DS_MERCHANT_CURRENCY' => $currency,
        'DS_MERCHANT_TRANSACTIONTYPE' => '0', // Compra
        'DS_MERCHANT_TERMINAL' => $terminal,
        'DS_MERCHANT_MERCHANTURL' => $_SERVER['HTTP_HOST'] . '/api/redsys_response.php',
        'DS_MERCHANT_URLOK' => $_SERVER['HTTP_HOST'] . '/pago-exitoso',
        'DS_MERCHANT_URLKO' => $_SERVER['HTTP_HOST'] . '/pago-cancelado',
    ];
    
    // Codificar en Base64
    $merchantParametersBase64 = base64_encode(json_encode($merchantParameters));
    
    // Generar firma HMAC_SHA256
    // Algoritmo Redsys: SHA256(merchantParameters + secretKey)
    $merchantParametersBytes = hex2bin($merchantParametersBase64);
    $signature = hash_hmac('sha256', $merchantParametersBase64, $REDSYS_SECRET_KEY, true);
    $signatureBase64 = base64_encode($signature);
    
    // Respuesta al cliente
    echo json_encode([
        'Ds_MerchantParameters' => $merchantParametersBase64,
        'Ds_Signature' => $signatureBase64,
        'Ds_SignatureVersion' => 'HMAC_SHA256_V1'
    ]);
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
