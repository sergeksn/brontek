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
        const data_site = {};/*тут будут храниться все данные для работы скриптов сайта*/
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

<body>
    <header>
        <?php include_once __DIR__.'/templates/top_baner.php' ?>
        <?php include_once __DIR__.'/templates/top_menu_block.php' ?>
    </header>
    <div id="header_overlay"></div>
<script>
    let header_position = function(){
        let header = document.getElementsByTagName("header")[0],//элемент header
        header_overlay = document.getElementById("header_overlay"),//элемент #header_overlay
        header_height = window.getComputedStyle(header).height;//высота хедера числом

        header_overlay.style.height = header_height;//задаём высоту подложки хедера

        //после того как структура DOM загрузилась меняем position, чтоб меню сначало появилось, а после подгрузки скриптов уже было подвижным
        document.addEventListener("DOMContentLoaded", function(){
            header.style.position = "fixed";
        })
    }
    header_position();
</script>