//КНОПКА ПРОКРУТКИ ВВЕРХ
let header = $("header"), //header
    scroll_top_button = $(".scroll_to_top_wrapper"); //оболочка кнопки скрола вверх

GDS.scroll_to_top = {

    button_img_loaded: false, //загружена ли картинка поиска

    time_for_scroll: 500, //время для анимации прокрутки в мс

    enable_button: true, //разлокирована кнопка или нет, блокируется на время прокуртки чтоб не обрабатывать лишние нажатия

    min_scroll_to_show_button_distans: null, //минимальная дистаницая в пикселях которую нужно прокрутить от верха документа чтоб кнопка скрола была показана

    //инициализируем кнопку скрола, вычисляем её текущие размеры и позицию, проверяем нужно ли её показать, вычисляем минимальную высоту показа кнопки, добавляем слушатели события на скрол
    init: function() {
        let bottom = null,
            left = null,
            right = null,
            min_bottom,
            min_gorisontal,
            size = Math.round(GDS.win_width * 0.03), //задаём ширину и высоту блока с кнопкой
            min_size = 50;

        //телефоны
        if (GDS.win_width <= 630) {
            min_bottom = 40;
            min_gorisontal = 30;
        }
        //телефоны

        //планшеты
        if (GDS.win_width > 630 && GDS.win_width <= 1000) {
            min_bottom = 110;
            min_gorisontal = 30;
        }
        //планшеты

        //пк
        if (GDS.win_width > 1000) {
            min_bottom = 120;
            min_gorisontal = 50;
        }
        //пк

        bottom = Math.round(GDS.win_height * 0.1) > min_bottom ? Math.round(GDS.win_height * 0.1) : min_bottom; //определяем отсуп от низа окна браузера до кноки скрола вверх

        //если сенсорное устройство
        if (GDS.devise_touch) left = Math.round(GDS.win_width * 0.05) > min_gorisontal ? Math.round(GDS.win_width * 0.05) : min_gorisontal; //определяем левый отсуп от окна браузера до кноки скрола вверх

        //если обычное устройство
        else right = Math.round(GDS.win_width * 0.05) > min_gorisontal ? Math.round(GDS.win_width * 0.05) : min_gorisontal; //определяем правый отсуп от окна браузера до кноки скрола вверх

        size = size > min_size ? size : min_size; //если процентный размер меньше минимального разрешённого размера используем минимальный размер

        //задаём стили для кнопки чтоб она подстроилась под разные экраны
        scroll_top_button.css({
            "bottom": bottom + "px",
            "width": size + "px",
            "height": size + "px"
        });

        if (left) scroll_top_button.css("left", left + "px");

        if (right) scroll_top_button.css("right", right + "px");
        //задаём стили для кнопки чтоб она подстроилась под разные экраны

        this.min_scroll_to_show_button_distans = Math.round(GDS.win_height * 0.7) > 500 ? Math.round(GDS.win_height * 0.7) : 500; //если 75% высоты экрана больше чем 500 то используем их как минимальную дистанцию скрола, иначеи используем 500

        this.show_button(); //проверяем текущуюю позиции кнопки и показываем её если нужно

        header.add(window).on("scroll", this.show_button.bind(this)); //привязываем отслеживание скрола на окне и на хедере, т.к. как там будет поиск

        $(window).on("resize", this.show_button.bind(this)); //так же проверяем нужно ли показывать кнопку при ресайзе

        scroll_top_button.on("click tochend", this.scroll_top_action.bind(this));

    },
    //инициализируем кнопку скрола, вычисляем её текущие размеры и позицию, проверяем нужно ли её показать, вычисляем минимальную высоту показа кнопки, добавляем слушатели события на скрол

    //управляет видимостью кнопки прокрутки
    // status - если true кнопка видна, если false то скрыта
    button_visibility: function(status) {
        //плавно показываем кнопку
        if (status) {
            scroll_top_button.addClass("show"); //плавно показываем кнопку

            //если картинка ещё не была загружена
            if (!this.button_img_loaded) {
                GDS.media.load_img(scroll_top_button.find("img")); //загружаем картинку
                this.button_img_loaded = true; //помечаем что картинка уже загружена
            }
            //если картинка ещё не была загружена
        }
        //плавно показываем кнопку
        else scroll_top_button.removeClass("show"); //плавно скрываем кнопку
    },
    //управляет видимостью кнопки прокрутки

    //функция определяет показывать кнопку или нет
    show_button: function() {
        //кнопка может быть показана только если определён обработчик поиска и открыт блок с результатами поиска
        if (GDS.search && GDS.search.status.result_search_block === "open") {
            let value = header[0].scrollTop > this.min_scroll_to_show_button_distans ? true : false; //если прокрутили достаточно далеко от верха хедера
            this.button_visibility(value); //плавно показываем или скрываем кнопку
            return; //завершаем функцию
        }
        //кнопка может быть показана только если определён обработчик поиска и открыт блок с результатами поиск

        if (GDS.search && GDS.search.status.input_search_block === "open") return; //если просто открыто окно поиска завершаем функцию проверки показа кнопки

        //проверяем прокрутку html элемента
        let value = window.pageYOffset > this.min_scroll_to_show_button_distans ? true : false; //если прокрутили достаточно далеко от верха документа

        this.button_visibility(value); //плавно показываем или скрываем кнопку
    },
    //функция определяет показывать кнопку или нет

    //проскролит вверх после нажатия на кнопку
    scroll_top_action: async function() {
        if (!this.enable_button) return; //если кнопка заблокирована не начинам прокрутку

        this.enable_button = false; //блокируем кнопку

        //если определён обработчик поиска и открыт блок с результатами поиска
        if (GDS.search && GDS.search.status.result_search_block === "open") {
            await header.animate({ "scrollTop": "0" }, this.time_for_scroll); //дожидаемся завершения прокрутки

            this.enable_button = true; //разблокируем кнопку
        }
        //если определён обработчик поиска и открыт блок с результатами поиска
        else {
            await $("html").animate({ "scrollTop": "0" }, this.time_for_scroll); //дожидаемся завершения прокрутки

            this.enable_button = true; //разблокируем кнопку
        }
    }
    //проскролит вверх после нажатия на кнопку
};
//КНОПКА ПРОКРУТКИ ВВЕРХ