<?php
    $page = $_GET["page"];

    $url = "https://m.mafengwo.cn/?category=get_info_flow_list&page=$page";

    echo file_get_contents($url);
?>