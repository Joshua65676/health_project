<?php

declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

function sendVerificationEmail(string $email, string $name, string $token): void
{
    $host = getenv('SMTP_HOST');
    $username = getenv('SMTP_USERNAME');
    $password = getenv('SMTP_PASSWORD');
    $fromEmail = getenv('SMTP_FROM_EMAIL') ?: $username;

    if (!$host || !$username || !$password || !$fromEmail) {
        throw new RuntimeException('SMTP settings are incomplete.');
    }

    $verificationUrl = appBaseUrl() . '/auth/verify-email.php?token=' . urlencode($token);
    $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $safeUrl = htmlspecialchars($verificationUrl, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $mailer = new PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host = $host;
    $mailer->SMTPAuth = true;
    $mailer->Username = $username;
    $mailer->Password = $password;
    $mailer->Port = (int) (getenv('SMTP_PORT') ?: '587');
    $mailer->SMTPSecure = strtolower(getenv('SMTP_ENCRYPTION') ?: 'tls') === 'ssl'
        ? PHPMailer::ENCRYPTION_SMTPS
        : PHPMailer::ENCRYPTION_STARTTLS;
    $mailer->CharSet = 'UTF-8';
    $mailer->setFrom($fromEmail, getenv('SMTP_FROM_NAME') ?: 'MediAI');
    $mailer->addAddress($email, $name);
    $mailer->isHTML(true);
    $mailer->Subject = 'Confirm your MediAI account';
    $mailer->Body = '<p>Hello ' . $safeName . ',</p><p>Confirm your email address to finish creating your MediAI account.</p><p><a href="' . $safeUrl . '">Confirm email address</a></p><p>This link expires in 24 hours. If you did not create an account, you can ignore this email.</p>';
    $mailer->AltBody = "Hello $name,\n\nConfirm your email address to finish creating your MediAI account:\n$verificationUrl\n\nThis link expires in 24 hours.";
    $mailer->send();
}
