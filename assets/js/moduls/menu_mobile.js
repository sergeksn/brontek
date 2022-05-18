let header_burger_button = $(".header_burger_button"), //кнопка бургер меню
    hidden_header_part = $(".hidden_header_part"), //скрытая часть хедера
    header_menu = $(".header_menu_wrapper"), //верхнее меню
    body = $("body"), //body
    overlay = $("#overlay"), //полупрозрачная бела подложка для всплывающих окон
    header = $("header"); //header

//МОБИЛЬНОЕ МЕНЮ
GDS.menu_mobile = {
    //close - меню закрыто
    //pending to open - в процессе открытия меню
    //open - меню открыто
    //pending to close - в процессе закрытия меню
    status: "close", //статус открытия меню

    //инициализируем все скрипты для работы мобильного меню
    init: function() {
        header_burger_button.on("click tochend", this.toggle_menu.bind(this)); //открываем и закрывам меню по клику на бургер кнопку
        overlay.on("click tochend", this.click_to_overlay.bind(this)); //закрываем меню при клике на подложку
    },
    //инициализируем все скрипты для работы мобильного меню

    //открываем или закрываем меню в зависимости от его статуса
    toggle_menu: function() {
        if (this.status === "close") this.open_menu().catch(() => {});
        if (this.status === "open") this.close_menu().catch(() => {});
    },
    //открываем или закрываем меню в зависимости от его статуса

    //открываем меню
    open_menu: function() {
        return new Promise(async (resolve, reject) => {
            if (this.status !== "close") return reject("попытались открыть окно когда оно не закрыто"); //если попытались запустить открытие меню когда оно не закрыто то завершаем промис неудачей

            this.status = "pending to open"; //помечаем что началось открытие меню

            body.addClass("scroll_lock"); //блокируем прокурутку документа

            header_burger_button.addClass("open"); //меняем бургер кнопку на крестик



            hidden_header_part.css({
                "height": hidden_header_part.height() + "px", //явно задаём высоту скрытому блоку
                "visibility": "visible" //делаем весь скрытый блок видимым
            });

            //дожидаемся завершения показа подложки и опускания меню
            await Promise.all([
                GDS.overlay.show_overlay(true), //показываем подложку
                hidden_header_part.animate({ "top": header_menu.height() + "px" }, GDS.anim_time, GDS.anim_tf) //дожидаемся пока меню опуститься
            ]);
            //дожидаемся завершения показа подложки и опускания меню

            //если высота скрытого блока меню вместе с высотой хедера больше чем высота экрана устройства
            if ((GDS.header.get_header_h() + hidden_header_part.height()) > GDS.win_height) {
                //делаем хедер прокручиваемым
                header.css({
                    "height": GDS.win_height + "px",
                    "overflow-y": "scroll"
                });
            }
            //если высота скрытого блока меню вместе с высотой хедера больше чем высота экрана устройства

            this.status = "open"; //помечеам что меню открыто

            resolve(); //успешно завершаем промис
        });
    },
    //открываем меню

    //закрываем меню
    close_menu: async function() {
        return new Promise(async (resolve, reject) => {
            if (this.status !== "open") return reject("попытались закрыть окно когда оно не открыто"); //если попытались запустить закрытие меню когда оно не открыто то завершаем промис неудачей

            this.status = "pending to close"; //статус открытия окна

            header_burger_button.removeClass("open"); //меняем крестик на бургер кнопку

            await Promise.all([
                GDS.overlay.show_overlay(false), //скрываем подложку

                hidden_header_part.animate({ "top": "-" + (hidden_header_part.height() - header_menu.height()) + "px" }, GDS.anim_time, GDS.anim_tf) //дожидаемся пока меню поднимется
            ]);

            hidden_header_part.css({
                "height": "", //убираем у скрытого блока явно заданную высоту анимации
                "visibility": "hidden" //делаем скрытый блок невидимым
            });

            //у хедера могли быть заданы высота и прокрутка если высота окна была меньше восоты скрытого блока меню, очищаем их
            header.css({
                "height": "",
                "overflow-y": ""
            });
            //у хедера могли быть заданы высота и прокрутка если высота окна была меньше восоты скрытого блока меню, очищаем их
            
            body.removeClass("scroll_lock"); //разблокируем прокурутку документа

            this.status = "close"; //помечеам что меню закрыто

            resolve(); //успешно завершаем промис
        });
    },
    //закрываем меню

    //сработает при клике на подложку
    click_to_overlay: function() {
        if (this.status !== "open") return; //если меню не открыто завершаем функцию
        this.close_menu().catch(() => {}); //закрываем меню
    },
    //сработает при клике на подложку
};
//МОБИЛЬНОЕ МЕНЮ




//открываем меню
let open_menu_mobile = function() {

        if (header_menu.hasClass("open_menu")) return false; //если меню уже открыто завершаем функцию

        header_menu.addClass("open_menu"); //помечаем меню как открытое

        body.toggleClass("scroll_lock"); //блокируем прокурутку документа

        //если высота скрытого блока меню вместе с высотой хедера меньше чем высота экрана устройства
        if (GDS.devise_height - (GDS.header.height + GDS.header.hidden_header_block) <= 0) {
            header.animate({ "height": GDS.devise_height + "px" }, GDS.anim_time, GDS.anim_tf, function() {
                header.css({ "overflow-y": "scroll" });
            }); //разворачиваем меню на высоту блока
        }
        //если высота скрытого блока меню вместе с высотой хедера меньше чем высота экрана устройства

        //если высота скрытого блока меню вместе с высотой хедера больше (или равна) чем высота экрана устройства
        hidden_header_part.animate({ "bottom": "-" + GDS.header.hidden_header_block + "px" }, GDS.anim_time, GDS.anim_tf); //разворачиваем меню на высоту блока

        GDS.overlay.toggle_overlay(); //показываем подложку
        return true;
    },
    //открываем меню

    //закрываем меню
    close_menu_mobile = function() {
        if (!header_menu.hasClass("open_menu")) return false; //если меню уже закрыто завершаем функцию

        header.animate({ "height": GDS.header.height + "px" }, GDS.anim_time, GDS.anim_tf, function() {
            header.css({ "overflow-y": "revert", "height": "revert" }); //убираем блокировку прокрутки документа
        });

        //сворачиваем меню
        hidden_header_part.animate({ "bottom": "0px" }, GDS.anim_time, GDS.anim_tf, function() {
            header_menu.removeClass("open_menu"); //убираем пометку открытого меню
        });
        //сворачиваем меню

        body.toggleClass("scroll_lock"); //убираем блокировку прокрутки документа

        GDS.overlay.toggle_overlay(); //скрываем подложку
        return true;
    }
//закрываем меню




//
//МОБИЛЬНОЕ МЕНЮ
//
//