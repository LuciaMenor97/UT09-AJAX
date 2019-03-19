<?php
    $respaldo = $_POST['respaldo'];
    $fp = fopen("respaldo.json","w+");
    fwrite($fp, $respaldo);
    fclose($fp);
?> 