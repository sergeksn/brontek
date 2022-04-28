<!DOCTYPE html>
<html lang="ru">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BRONTEC</title>
    <link rel="shortcut icon" href="/favicon.jpg" />
    <link rel="stylesheet" href="/assets/css/setka.css">
    <link rel="stylesheet" href="/assets/css/critikal.css">
    <script>
        const GDS = {};/*global data site  тут будут хранится все необходимые данные для работы фронтенда сайта, размеры блоков или какието-то данные для взаимодействия модулей*/
    </script>
    <style>
    #header_overlay{
        background-color: var(
        <?php 
        $url = $_SERVER["REQUEST_URI"];
        $blue = ["/", "/about-us/"];
        $find = false;
        foreach ($blue as $page_url) {
            if($page_url == $url){
                echo "--blue-theme";
                $find = true;
                break;
            }
        }

        if(!$find) echo "--bg-site-color";

        ?>
        );
    }
    </style>
</head>

<body class="custom_scrollbar">
    <header class="custom_scrollbar">
        <?php include_once __DIR__.'/templates/top_baner.php' ?>
        <?php include_once __DIR__.'/templates/top_menu_block.php' ?>
    </header>
    <div id="header_overlay"></div>
    <div id="overlay"></div>
<script>
    /*нужно чтоб в момент загрузки страницы меню занимало нужную позицию и не прыгало относитель но контента*/
    (() => {
        let header = document.getElementsByTagName("header")[0],/*элемент header*/
        header_overlay = document.getElementById("header_overlay"),/*элемент #header_overlay*/
        header_height = window.getComputedStyle(header).height;/*высота хедера числом*/
        header_overlay.style.height = header_height;/*задаём высоту подложки хедера*/
    })()
</script>