<?php
$password = 't7G$k9Pz!Qw2RmX4';
$hash = password_hash($password, PASSWORD_BCRYPT);
echo $hash . PHP_EOL;
echo (password_verify($password, $hash) ? 'true' : 'false') . PHP_EOL;
