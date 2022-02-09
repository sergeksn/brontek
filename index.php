<?php require_once "header.php"; ?>

    <main>

    <?php 
        $url = $_SERVER['REQUEST_URI'];

        if($url == "/"){
            include_once  __DIR__."/pages/home.php";
        } else {
            include_once __DIR__."/pages".$url.".php";
        }
        
    ?>
    </main>


<?php require_once "footer.php"; ?>