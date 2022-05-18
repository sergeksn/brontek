const body = $("body"), //body
    header = $("header"), //header
    overlay = $("#overlay"), //полупрозрачная бела подложка для всплывающих окон
    shadow_block = $("#shadow_block"), //полоска с теню
    header_menu = $(".header_menu_wrapper"), //верхнее меню
    hidden_header_part = $(".hidden_header_part"), //скрытая часть хедера
    header_search_button = $(".header_search_button"),
    search_wrapper = $(".search_wrapper"),
    search_input = search_wrapper.find("input"),
    close_search_button = search_wrapper.find(".close_search"),
    search_loader = $(".search_loader"),
    results_wrapper = $(".results_wrapper"),
    header_burger_button = $(".header_burger_button"), //кнопка бургер меню
    search_results = $(".search_results");

GDS.search = {
    //содержит текущее состояние блоков поиска
    status: {
        //close - окно закрыто
        //pending to open - в процессе открытия окна
        //open - окно открыто
        //pending to close - в процессе закрытия окна
        input_search_block: "close",
        result_search_block: "close"
    },

    buttons_enable: true, //разрешаем открытие окна поиска, разрешаем нажимать на кнопку крестик возле инпута чтоб удалять результаты поиска , нужно чтоб избежать ложных многократных нажатий пока все функции открытия или закрытия окна поиска не выполнятся

    cached_result: null, //сохранеям в данный объект результаты последнего поиска чтоб можно было их быстро использовать для повторного открытия окна поиска если не было очищщено поле ввода

    input_timerid: null, //id таймера для задержки ввода

    //иницализируем все функции и слушатели для работы поиска
    init: function() {
        header_search_button.on("click tochend", this.click_header_search_button.bind(this)); //клик по кнопке поиска в меню

        overlay.on("click tochend", this.click_overlay.bind(this)); //скрываем окно поиска по клику на полупрозрачную подложку

        close_search_button.on("click tochend", this.click_close_search_button.bind(this)); //клик по крестику в окне поиска

        search_input.on("input", this.chenge_in_search_input.bind(this)); //начинаем поиск после ввода символов
    },
    //иницализируем все функции и слушатели для работы поиска

    //функция будет блокировать/разблокировать все активные кнопки в модуле поиска чтоб не возникало ошибок при множественных нажатиях
    switch_active_search_buttons: function(status_active = true) {
        status_active ? close_search_button.removeClass("disabled") : close_search_button.addClass("disabled");
        status_active ? header_search_button.removeClass("disabled") : header_search_button.addClass("disabled");
        this.buttons_enable = status_active;
    },
    //функция будет блокировать/разблокировать все активные кнопки в модуле поиска чтоб не возникало ошибок при множественных нажатиях

    //открываем окно поиска с полем ввода
    open_search: function() {
        return new Promise(async (resolve, reject) => {
            if (this.status.input_search_block !== "close") return reject("вызвано открытие окна поиска когда оно уже открыто"); //если окно поиска не до конца закрыто то завершаем промис неудачей

            this.status.input_search_block = "pending to open"; //статус открытия окна



            if (GDS.menu_mobile.status === "close") header_burger_button.addClass("open"); //меняем бургер кнопку на крестик если меню закрыто

            body.addClass("scroll_lock"); //блокируем прокурутку документа

            GDS.header.toggle = false; //блокируем сворачивание/разворачивание хедера

            hidden_header_part.css({
                "position": "absolute",
                "height": hidden_header_part.height() + "px", //явно задаём высоту скрытому блоку
                "visibility": "visible" //делаем весь скрытый блок видимым
            });

            await Promise.all([
                hidden_header_part.animate({ "top": header_menu.height() + "px" }, GDS.anim_time, GDS.anim_tf), //опускаем весь скрытый блок
                GDS.overlay.show_overlay(true) //показываем подложку и ждём завершения её появления
            ]);

            hidden_header_part.css({
                "position": "relative",
                "top": "",
                "height": "" //явно задаём высоту скрытому блоку
            });



            //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа
            header.css({
                "height": header.height() + "px"
            });
            //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа




            if (!GDS.devise_touch) search_input.focus(); //ставим курсор на наше поле ввода НЕ на сенсорных экранах

            this.status.input_search_block = "open"; //статус открытия окна

            GDS.scroll_to_top.button_visibility(false); //плавно скрываем кнопку скрола вверх

            resolve(); //промис успешно выполнен окно поиска открыто
        });
    },
    //открываем окно поиска с полем ввода

    //закрываем окно поиска с полем ввода
    close_search: function() {
        return new Promise(async (resolve, reject) => {
            if (this.status.input_search_block !== "open") return reject("вызвано закрытие окна поиска когда оно уже закрыто"); //если окно поиска не польностью открыто то завершаем промис неудачей

            this.status.input_search_block = "pending to close"; //статус открытия окна



            if (GDS.menu_mobile.status === "close") header_burger_button.removeClass("open"); //меняем крестик на бургер кнопку если меню закрыто




            hidden_header_part.css({
                "position": "absolute",
                "height": hidden_header_part.height() + "px", //явно задаём высоту скрытому блоку
                "top": (header_menu.height() - hidden_header_part.height()) + "px"
            });




            //уменьшаем высоту скрытого блока и плавно скрываем окно поиска дожидаемся окончания анимации
            await hidden_header_part.animate({
                "top": "-" + (search_wrapper.height() - header_menu.height()) + "px"
            }, GDS.anim_time, GDS.anim_tf);
            //уменьшаем высоту скрытого блока и плавно скрываем окно поиска

            hidden_header_part.css({
                "height": "", //убираем у скрытого блока явно заданную высоту анимации
                "visibility": "hidden" //делаем скрытый блко невидимым
            });

            await GDS.overlay.show_overlay(false); //скрываем подложку и ждём завершения её сворачивания

            this.clean_search_events(); //удаляем все слушатели которые были нужны при открытом окне поиска

            GDS.header.toggle = true; //разрешаем сворачивание/разворачивание хедера

            body.removeClass("scroll_lock"); //включаем прокурутку документа

            this.status.input_search_block = "close"; //статус открытия окна

            GDS.scroll_to_top.show_button(); //показываем/скрываем кнопку скрола вверх

            resolve(); //промис успешно выполнен окно поиска закрыто
        });
    },
    //закрываем окно поиска с полем ввода

    //открываем окно для отображения результатов поиска
    open_results_block: function() {
        return new Promise(async (resolve, reject) => {
            if (this.status.result_search_block !== "close") return reject("вызвано открытие окна вывода результатов поиска когда оно уже открыто"); //если окно с результатами поиска не до конца закрыто то завершаем промис неудачей

            this.status.result_search_block = "pending to open"; //статус открытия окна




            //толкьо если мобильное меню закрыто
            if (GDS.menu_mobile.status === "close") {
                let search_results_block_height = GDS.win_height - search_results[0].getBoundingClientRect().top; //получаем растояние от верха экрана до верха блока для отображение результатов поиска и получаем высоту которую дожен будет занять блок чтоб покрыть всю высоту экрана

                await $().animate([{
                    "elements": search_results,
                    "height": search_results_block_height + "px" //опускаем блок с результатами поиска до низа окна бразуера
                }, {
                    "elements": hidden_header_part,
                    "height": "+=" + search_results_block_height + "px" //опускаем скрытый блок до низа окна бразуера
                }], GDS.anim_time, GDS.anim_tf);
            }
            //толкьо если мобильное меню закрыто







            search_loader.animate({ "opacity": "1" }, GDS.anim_time, GDS.anim_tf); //показываем лоадер после откытия блока с результатами поиска
            

            shadow_block.addClass("hide"); //скрываем полосу чтоб она не перекрывала контент

            //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа
            header.css({
                "overflow-y": "scroll",
                "overflow-x": "hidden", //нужно для скрола банера без горизонтальной полосы прокрутки
                "height": GDS.win_height + "px"
            });
            //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа

            this.status.result_search_block = "open"; //статус открытия окна

            resolve(); //промис успешно выполнен окно с результатами поиска открыто
        });
    },
    //открываем окно для отображения результатов поиска

    //закрываем окно для отображения результатов поиска
    close_results_block: function() {
        return new Promise(async (resolve, reject) => {
            if (this.status.result_search_block !== "open") return reject("вызвано закрытие окна вывода результатов поиска когда оно уже закрыто"); //если окно с результатами поиска не польностью открыто то завершаем промис неудачей

            this.status.result_search_block = "pending to close"; //статус открытия окна



            //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа
            header.css({
                "overflow-y": "",
                "overflow-x": "", //нужно для скрола банера без горизонтальной полосы прокрутки
                "height": ""
            });
            //делаем чтоб хедер имел прокуту и стал чем-то вроде нового документа

            shadow_block.removeClass("hide"); //делаем полосу с теню видимой

            //если результаты поиска пусты и ещё не заполнены ни чем
            if (results_wrapper[0].innerHTML === "") {
                await search_loader.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //плавно скрываем лоадер
            }
            //если результаты поиска пусты и ещё не заполнены ни чем

            //если есть какие-то отображённые результаты поиска
            else {
                search_loader.css("opacity", "0"); //скрываем лоадер

                await results_wrapper.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //дожидаемся пока станет прозрачным блок с результатами поиска

                results_wrapper[0].innerHTML = ""; //очищаем содержимое блока с результатами поиска
            }
            //если есть какие-то отображённые результаты поиска

            await $().animate([{
                "elements": search_results,
                "height": "0px" //уменьшаем высоту блок с результатами поиска для его скрытия
            }, {
                "elements": hidden_header_part,
                "height": search_wrapper.height() + "px" //уменьшаем высоту скрытого блока
            }], GDS.anim_time, GDS.anim_tf);

            this.status.result_search_block = "close"; //статус открытия окна

            resolve(); //промис успешно выполнен окно с результатами поиска закрыто
        });
    },
    //закрываем окно для отображения результатов поиска

    //начинает асинхранную задачу по поиску и возвращает результат
    load_results: function(search_text) {
        return bf.request_to_server({
            "action": "search",
            "text": search_text
        }, "/ajax.php");
    },
    //начинает асинхранную задачу по поиску и возвращает результат

    //раскрываем окно с результатами поиска и отображает результаты поиска в блоке для результатов
    render_results: async function(search_text) {

        //если мы уже ищем не первый раз то блок с результатами поиска нужно очистить перед выводом новых результатов
        if (results_wrapper[0].innerHTML !== "") {
            await results_wrapper.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //дожидаемся пока результаты поиска станут прозрачными

            results_wrapper[0].innerHTML = ""; //удаляем всё содержимое блока с результатами поиска

            search_loader.animate({ "opacity": "1" }, GDS.anim_time, GDS.anim_tf); //показываем лоадер
        }
        //если мы уже ищем не первый раз то блок с результатами поиска нужно очистить перед выводом новых результатов

        //вставляет переданные код html в блок с результатами поиска и плавно показывает его
        let show_results = async (result_html) => {
            if (search_input[0].value !== search_text) return; //если за время поиска пользователь успел поменять содержимое инпута, то мы ничего не выводим и начнётся новый поиск

            await search_loader.animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf); //дожидаемся скрытия лоадера
            results_wrapper[0].innerHTML = result_html; //записываем результаты в блок с результатами поиска
            await results_wrapper.animate({ "opacity": "1" }, GDS.anim_time, GDS.anim_tf); //плавно показываем блок с результатами
            this.start_load_img_in_search_result(); //загружаем картинки из результатов поиска
        };
        //вставляет переданные код html в блок с результатами поиска и плавно показывает его

        //если в данном объекте есть запись с прежнеми результатами поиска значит окно было просто свёрнуто и мы не должны делать запрос на сервер, а просто выведем данные из кеша объекта
        if (this.cached_result) return await show_results(this.cached_result); //вставляет переданные код html в блок с результатами поиска и плавно показывает его, а так же прерываем дальнейшие выполнение функции

        //ищем search_text - текст введённый в поле поиска в базе, после того как получили ответ выводим его на экран
        await this.load_results(search_text).then(async (data) => {
            await show_results(data.response); //вставляет переданные код html в блок с результатами поиска и плавно показывает его
            this.cached_result = data.response; //сохранеям результаты поиска в кеш объекта поиска
        }).catch((error) => console.log(error));
        //ищем search_text - текст введённый в поле поиска в базе, после того как получили ответ выводим его на экран
    },
    //раскрываем окно с результатами поиска и отображает результаты поиска в блоке для результатов

    //запускаем процесс загрузки картинок
    start_load_img_in_search_result: function() {
        //если результаты поиска дали хотяб один ответ
        if ($(".results_wrapper .product_prevu_img_block").length > 0) {
            this.load_img(); //загружаем уже частично видимые картинки
            header.on("scroll", this.load_img); //добавляем слушатель чтоб при скроле хедера загружались картинки из результатов поиска
        }
        //если результаты поиска дали хотяб один ответ
    },
    //запускаем процесс загрузки картинок

    //загружает только те картинки из результатов поиска до которых пользователь доскролил или которые стали видны в момент загрузки резаультатов
    load_img: function() {
        let images_search = $(".results_wrapper .product_prevu_img_block:not(.start_load):not(.loaded)"); //все блоки картинок из результатов поиска которе ещё не загружены и не начали загрузку

        //находим все блоки с картинками которые не загружены и ещё не начали загрузку и проверяем находятся ли они в границах окна браущера по вертикали, если находятяс выполянем для каждой найденой калбек
        images_search.check_visible((img_block) => {
            $(img_block).addClass("start_load"); //помечаем что блок с картинками начал загрузку
            GDS.media.load_img_prevu_product(); //начинаем загружать картинки из всех блоков product_prevu_img_block с пометкой начавшейся загрузки start_load
        }, $(window), {
            search_dir: {
                top: true,
                bottom: true
            }
        });
        //находим все блоки с картинками которые не загружены и ещё не начали загрузку и проверяем находятся ли они в границах окна браущера по вертикали, если находятяс выполянем для каждой найденой калбек

        //ПРИМЕЧАНИЕ: чтоб коректно удалялся слушатель нужно дать ссылку явно на объект GDS.search
        if (images_search.length === 0) GDS.search.clean_search_events(); //как только все блоки картинок загрузились можно удалить слушатель загрузки картинок при скроле
    },
    //загружает только те картинки из результатов поиска до которых пользователь доскролил или которые стали видны в момент загрузки резаультатов

    //удаляет слушатели события которые нужны только при открытом окне поиска
    clean_search_events: function() {
        header.off("scroll", this.load_img); //отключаем слушатель с хедера который загружал картинки в результатах поиска
    },
    //удаляет слушатели события которые нужны только при открытом окне поиска

    //клик по кнопке поиска в меню
    //используем search вместо this так как функция будет вызвана в другом контексте и в её this будет передан элемент из eventlister
    click_header_search_button: async function() {
        if (!this.buttons_enable) return; //если в данный момент кнопка заблокирована просто прерываем функцию

        this.switch_active_search_buttons(false); //блокируем все нажатия активных кнопок в модуле поиска

        let search_data = bf.getCookie("search_data"); //получаем последнее что пользователь вводил для поиска

        //если в куки есть поисковой запрос и он блоше чем один символ
        if (search_data !== undefined && search_data.length > 1) {
            search_input[0].value = search_data; //записываем текст поиска в инпут
            search_data.length > 0 ? search_input.addClass("nachat_vvod") : search_input.removeClass("nachat_vvod"); //если введён хотяб один символ в поле поиска
        }
        //если в куки есть поисковой запрос и он блоше чем один символ

        await this.open_search() //пробуем открыть окно если оно закрыто
            .then(async () => { //после того как открыли окно
                //если в куки есть поисковой запрос и он блоше чем один символ, начинаем вывод результатов поиска и ждём его окончания
                if (search_data !== undefined && search_data.length > 1) {
                    await this.open_results_block();
                    await this.render_results(search_data);
                }
                //если в куки есть поисковой запрос и он блоше чем один символ, начинаем вывод результатов поиска и ждём его окончания
            })
            .catch(() => //если окно поиска оказалось уже открытым
                this.close_results_block().catch(() => {}) //пробуем закрыть окно с результатами поиска, вдруг оно открыто
                .finally(() => //дожидаемся завершения промиса закрытия результатов поиска не зависимо от его результатов
                    this.close_search().catch(() => {}))); // закрываем окно поиска

        this.switch_active_search_buttons(true); //разблокируем все нажатия активных кнопок в модуле поиска
    },
    //клик по кнопке поиска в меню

    //скрываем окно поиска по клику на полупрозрачную подложку
    click_overlay: async function() {
        if (!this.buttons_enable) return; //если в данный момент кнопка заблокирована просто прерываем функцию

        this.switch_active_search_buttons(false); //блокируем все нажатия активных кнопок в модуле поиска

        await this.close_search().catch(() => {}); //закрываем окно поиска

        this.switch_active_search_buttons(true); //разблокируем все нажатия активных кнопок в модуле поиска
    },
    //скрываем окно поиска по клику на полупрозрачную подложку

    //клик по крестику в окне поиска
    click_close_search_button: async function() {
        if (!this.buttons_enable) return; //если в данный момент кнопка заблокирована просто прерываем функцию

        //удаляем данные запроса пользователя в инпуте и куках
        let clean_input = () => { //должна быть именно стрелочная функция чтоб перенять this из родительского объекта/функции
            search_input.removeClass("nachat_vvod"); //убираем класс уведомляющий о том что поле заполнено текстом поиска

            search_input[0].value = ""; //удаляем содержимое инпута для поиска

            bf.deleteCookie("search_data"); //чистим куки от текста поиска

            this.cached_result = null; //так же чистим прежние результаты поиска из кеша объекта поиска
        };
        //удаляем данные запроса пользователя в инпуте и куках

        this.switch_active_search_buttons(false); //блокируем все нажатия активных кнопок в модуле поиска

        await this.close_results_block() //пробуем закрыть окно с результатами поиска
            .then(() => clean_input()) //если окно  срезультатами поиска успешно закрыто то можно чистить содержимое запроса пользователя
            .catch(async () => { //если клик был когда окно с результатами поиска было закрыто
                search_input[0].value !== "" ? clean_input() : await this.close_search().catch(() => {}); //если в поле инпута был какой то текст просто чистим его, значит мы просто нажали на крестик в тот момент когда запрос на сервер ещё не отправился, если поле ввода пусто то значит можно закрывать окно поиска
            });

        this.switch_active_search_buttons(true); //разблокируем все нажатия активных кнопок в модуле поиска
    },
    //клик по крестику в окне поиска

    //начинаем поиск после ввода символов
    chenge_in_search_input: function() {
        clearTimeout(this.input_timerid); //удаляем таймер

        search_input[0].value.length > 0 ? search_input.addClass("nachat_vvod") : search_input.removeClass("nachat_vvod"); //если введён хотяб один символ в поле поиска меняем стили инпута

        //создаём таймер задержки ввода
        this.input_timerid = setTimeout(async () => {

            let search_text = search_input[0].value; //поисковой запрос

            this.switch_active_search_buttons(false); //блокируем все нажатия активных кнопок в модуле поиска

            this.cached_result = null; //так же чистим прежние результаты поиска из кеша объекта поиска

            bf.setCookie("search_data", search_text.slice(0, 100), { expires: "Tue, 19 Jan 2099 03:14:07 GMT" }); //записываем в куки то что ввёл пользователь

            //если ввели 2 и блоее символов начинаем поиск
            if (search_text.length > 1) {



                //если открыт блок поиска
                if (this.status.input_search_block === "open") {
                    //если закрыт блок с результатами поиска
                    if (this.status.result_search_block === "close") {
                        await this.open_results_block().catch(() => {}).then(() => this.render_results(search_text)); //откроет блок для вывода результатов поиска если он ещё не был открыт и только потом выводим результаты поиска
                    }
                    //если закрыт блок с результатами поиска

                    //если открыт блок с результатами поиска
                    else if (this.status.result_search_block === "open") {
                        await this.render_results(search_text); //выводим результаты поиска
                    }
                    //если открыт блок с результатами поиска
                }
                //если открыт блок поиска


                //если открыто мобильное меню
                if (GDS.menu_mobile.status === "open") {
                    //если закрыт блок с результатами поиска
                    if (this.status.result_search_block === "close") {
                        await $(".header_menu_mobile, .header_phone_mobile").animate({ "opacity": "0" }, GDS.anim_time, GDS.anim_tf);

                        $(".header_menu_mobile, .header_phone_mobile").css("display", "none")

                        await this.open_results_block().catch(() => {}).then(() => this.render_results(search_text)); //откроет блок для вывода результатов поиска если он ещё не был открыт и только потом выводим результаты поиска
                    }
                    //если закрыт блок с результатами поиска

                    //если открыт блок с результатами поиска
                    else if (this.status.result_search_block === "open") {
                        await this.render_results(search_text); //выводим результаты поиска
                    }
                    //если открыт блок с результатами поиска
                }
                //если открыто мобильное меню

            }
            //если ввели 2 и блоее символов начинаем поиск

            //если количество символов удалили до нуля то сворачиваем блок с результатами поиска
            if (search_text.length === 0) {
                await this.close_results_block().catch(() => {}); //удаляем результаты поиска и закрываем его окно
            }
            //если количество символов удалили до нуля то сворачиваем блок с результатами поиска

            this.switch_active_search_buttons(true); //разблокируем все нажатия активных кнопок в модуле поиска
        }, 500);
        //создаём таймер задержки ввода
    }
    //начинаем поиск после ввода символов
};