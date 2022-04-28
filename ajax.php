<?php
//обрабатываем запрос к базе данных
function db_query($query){
	$db = mysqli_connect("localhost", "root", "", "test");
	return mysqli_query($db, $query);
}
//обрабатываем запрос к базе данных




/*
читстим код svg
$svg = file_get_contents("img/search/qashqai_front_stencil.svg");
    $svg = preg_replace('/width="[^"]+"/', "", $svg);
    $svg = preg_replace('/height="[^"]+"/', "", $svg);
    $svg = preg_replace('/xmlns="[^"]+"/', "", $svg);
*/
   
    

 
//полняем поиск по товарам и получаем готовую html разметку
function search($text){
	$result = db_query("SELECT * FROM wp_ksn_shop_products WHERE name LIKE '%$text%' OR small_description LIKE '%$text%'");//выполянем в поиск в базе в двух столбцах таблицы на наличие слова

	$respons = "";//сюда будет записан итоговый ответ

	if($result->num_rows === 0){
		$respons .= '<div class="search_fail">По Вашему запросу <span>"'.$text.'"</span> ничего не найдено =(</div>';
	}

	//после завершения поиска перебираем все результаты
	while($row = $result->fetch_assoc()){

		$title = preg_replace('/'.$text.'/iu', '<span class="search_target">$0</span>', $row['name']);//производит поиск и выделение слов независимо от регистра

		$old_price = $row['old_price'] == 0 ? null : '<div class="old_price">'.$row['old_price'].'</div>';//если есть старая цена при налии чискидки
		$discont = $row['discont'] == 0 ? null : '<div class="discont">-'.$row['discont'].'%</div>';//если есть скидка на данный товар
		$small_description = $row['small_description'] == 0 ? null : $row['small_description'];//краткое описание продукта

		if($small_description) $small_description = preg_replace('/'.$text.'/iu', '<span class="search_target">$0</span>', $small_description);//производит поиск и выделение слов независимо от регистра

		//будет получать url картинки для поиска данного товара и даддинг для этой картинки

		$instruction_title_text = 'Инструкция по монтажу "'.$title.'"';//текст заголовка результата поиска инструкции
		$instruction_img_block = '<div class="product_prevu_img_block" style="padding-top: 66.6666%;"><img data-src="/img/search/instruction.jpg"></div>';//блок картинки поиска инструкций

		if($row['product_data'] === ""){//временная заглушка
			$img_block =  "<div class=\"product_prevu_img_block\" style=\"padding-top: 66.6666%;\"><img data-src=\"/img/search/search.jpg\"><img data-src=\"/img/search/main_overlay.svg\"><img data-src=\"/img/search/fary.svg\"><img data-src=\"/img/search/perednie_stoyki.svg\"></div>";
		} else {
			$product_data = json_decode($row['product_data']);
			$img_block = $product_data->img_block;//полный блок картинки товара, в нём основная картинка с наложенными слоями svg деталей которые нужны для конкретного товара
		}
		//будет получать url картинки для поиска данного товара и даддинг для этой картинки

		$page_url = $row['url'] === "" ? "#test" : $row['url'];//будет получать ссылку на страницу данного товара

		//создаём html код найденного элемента для рендера
		$item = '<div class="result_item">
					<div class="search_description">
						<div class="search_item_title">'.$title.'</div>
						<div class="small_dec">'.$small_description.'</div>
						<div class="price_block">
							'.$old_price.'
							<div class="current_price">'.$row['price'].' ₽</div>
							'.$discont.'
						</div>
					</div>
					<div class="search_prevu">
						<a href="'.$page_url.'">
							<img class="search_arrow" src="/img/search/arrow.svg" alt="">
						</a>
						'.$img_block.'
					</div>
				</div>';
		//создаём html код найденного элемента для рендера

		//создаём html код найденного элемента для рендера блока инструкции
		$item .= '<div class="result_item">
					<div class="search_description">
						<div class="search_item_title">'.$instruction_title_text.'</div>
						<div class="small_dec">'.$small_description.'</div>
					</div>
					<div class="search_prevu">
						<a href="'.$page_url.'#instruction_block">
							<img class="search_arrow" src="/img/search/arrow.svg" alt="">
						</a>
						'.$instruction_img_block.'
					</div>
				</div>';

		//создаём html код найденного элемента для рендера блока инструкции

		$respons .= $item;//записываем каждый новый html код найденного товара в писке в конец строки на ответ клиенту
	};
	//после завершения поиска перебираем все результаты

	$respons .= '<div class="search_results_links"><a href="#"><div>Не нашли Ваш авто?</div></a><a href="#"><div>Консультация</div></a></div>';//дописываем в ответе дополнительные html блоки

	//sleep(3);
	
	return $respons;//функция возвращает строку с готовой html разметкой для вывода в поисковой блок
};
//полняем поиск по товарам и получаем готовую html разметку



$post_data = $_POST;

if($post_data["action"] === "search"){
	die(search($post_data["text"]));
}

?>