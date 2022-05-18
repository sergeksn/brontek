<?php require_once "header.php"; ?>

    <main style="position: relative; height: 1000px;">






        <div id="bg_green_block" style="
        height:750px; 
        width: 500px; 
        margin: auto; 
        background-color: green;
        position: relative; 
        left: 0px;
        display:flex;
        flex-direction: column;
        ">
            <div id="block_1" style="
            height:100px; 
            width: 100px; 
            margin: 10px 0; 
            background-color: yellow;
            position: relative; 
            left: 0px;
            ">block_1</div>
            <div id="block_2" style="
            height:100px; 
            width: 100px; 
            background-color: red;
            position: absolute; 
            left: 0px;
            ">block_2</div>
            <div id="block_3" style="
            height:100px; 
            width: 100px; 
            margin: 10px 0; 
            background-color: blue;
            position: relative; 
            left: 0px;
            ">block_3</div>

            
        </div>
    <?php /*
        $url = $_SERVER['REQUEST_URI'];

        if($url == "/"){
            include_once  __DIR__."/pages/home.php";
        } else {
            include_once __DIR__."/pages".$url.".php";
        }
        */
    ?>
    </main>


<?php require_once "footer.php"; ?>