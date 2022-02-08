<?php
//ПРИМЕЧАНИЕ: может произойти так что пользователь скрыл банер, но мы разместили новый спустя некоторое время и чтоб банер ему был показан снова мы привязываем в куках id срытого банера, созданый рандомо
function generate_string($spisok = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ", $strength = 15) {
    $input_length = strlen($spisok);
    $random_string = 'id_';
    for($i = 0; $i < $strength; $i++) {
        $random_character = $spisok[mt_rand(0, $input_length - 1)];
        $random_string .= $random_character;
    }
 
    return $random_string;
}

//echo(generate_string())
?>
<div class="top_banner_wrap col-12" id="id_NKkGUF0X9DGuvct">
    <a href="#">
        <img src="/img/header/banner.jpg" alt="">
    </a>
    <div class="close_banner">
        <div class="line_1"></div>
        <div class="line_2"></div>
    </div>
</div>
<script>
//
let top_banner_wrap = document.getElementsByClassName("top_banner_wrap")[0],
    top_banner_id = top_banner_wrap.getAttribute("id"),
    cookie_top_baner = document.cookie.match(new RegExp("(?:^|; )top_baner_hide_"+top_banner_id+"=([^;]*)"));//пытаемся получить значение из куки

cookie_top_baner = cookie_top_baner ? cookie_top_baner[1] : false;//если значения нет занчит показываем банер, если есть то скрываем

if(cookie_top_baner) top_banner_wrap.style.display = "none";
</script>