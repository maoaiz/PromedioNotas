<?php
$git = "git pull origin master";
exec($git,$salida);
foreach($salida as $line) {
    echo "$line<br>";
}


?>
