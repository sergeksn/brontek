"use strict"; //используем современный режим

//ПРИМЕЧАНИЕ: скорость работы моей библиотеки в общем выше чем у jQuery, для примера данная операция в 100000 (сто тысяч) повторений
//$("header").find("div").parents("div").children("div").siblings("nav, a, div.top_banner, .header_cart")
//на ksn заняла 24.3 сек
//на jQuery заняла 35.053 сек
//что на 30% быстрее

if (typeof window.jQuery !== "undefined") { jQuery.noConflict(); } //на всякий случай если вдруг подключена jQuery, чтоб не конфликтовали

//объект с основными функциями

//тут храним все необходимые данные для работы функций
const list_data = {
    swipe: []
}
//тут храним все необходимые данные для работы функций

//базовые функции для работы
//bf - base functions
let bf = {
    remove_default: function(e) { e.preventDefault() }, //функция призвана остановить события браузера по умолчанию для тех элементов и событий к которым она вызвана

    //ПРИМЕЧАНИЕ: не знаю почему но при движении нескольких точек по экрану в момент одновременного их события touchmove идентификаторы и соответсвенно события первого касание перекрывает более позние, тем самым переодически получаются глюки что когда движется второй палец браузер считает что движентся первый

    //ВАЖНО: если к элементу применён слушатель swipe то все действия по умолчанию у элемента будут убраны (click mousedown touchstart mousemove touchmove mouseup touchend), а так же к одному элементу может быть привязано только ОДНО событие свайпа !!!
    //el - элемент DOM
    //settings - настройки для определения был ли данный жест свайпом
    //add_listener - уесли функция вызвана с true значит мы добавляем слушатель данного события, если с false то удаляем
    swipe_event: {
        /*touchstart — начало касания, пользователь нажал на экран;
        touchmove — пользователь двигает пальцем по экрану;
        touchend — пользователь отпустил экран;
        touchcancel — отмена касания. Это событие срабатывает, если пользователь заходит за край страницы, переворачивает экран, сворачивает браузер и так далее.*/
        //срабатывает в момент подключения слушателя swipe к элементу
        init: function(el, settings, add_listener = true) {
            //если передано что нужно удалить слушатель
            if (!add_listener) {
                let settings = bf.swipe_event.get_settings(el); //настройки свайпа текущего элемента

                //функция удаляет прослушивание всех событий для обнаружения свайпа
                $(el).off("click " + settings.start_events + " " + settings.move_events + " " + settings.finall_events + " " + settings.leave_events, bf.remove_default, bf.remove_default); //включаем события по умолчанию
                $(el).off(settings.start_events, bf.swipe_event.start); //отключаем прослушивани событий mousedown touchstart для функции start 
                //функция удаляет прослушивание всех событий для обнаружения свайпа
                return; //прерываем дальнейщее выполнение функции
            }
            //если передано что нужно удалить слушатель

            // настройки по умолчанию
            let default_settings = {
                touch_swipe: true, //отслеживать свайп на сенсорных устройствах
                mouse_swipe: true, //отслеживать свайп на устройствах с мышкой
                min_percent_dist_x: 2, //минимальная дистанция, которую должен пройти указатель, чтобы жест считался как свайп в % от ширины экрана
                max_percent_dist_x: 90, //максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп в % от ширины экрана
                min_percent_dist_y: 2, //максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп в % от высоты экрана
                max_percent_dist_y: 90, //максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп в % от высоты экрана
                min_px_dist_x: null, //минимальная дистанция, которую должен пройти указатель, чтобы жест считался как свайп в пикселях px
                max_px_dist_x: null, //максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп в пикселях px
                min_px_dist_y: null, //максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп в пикселях px
                max_px_dist_y: null, //максимальная дистанция, не превышая которую может пройти указатель, чтобы жест считался как свайп в пикселях px
                min_time: 50, //максимальное время, за которое должен быть совершен свайп (ms)
                max_time: 1000, //минимальное время, за которое должен быть совершен свайп (ms)
                allow_leave: true, //считать ли жесты при которых указатель покидал границы элемента свайпом, если false то если указатиль покинул границы элемента свайп не будет засчитан
                remove_default_events: true, //убирать ли события click mousedown touchstart mousemove touchmove mouseup touchend mouseleave touchcancel по умолчанию для элемента
                /*callback_success: () => console.log("SUCCESS"), //функция которая будет вызвана если жест над элементом был свайпом, тоже самое что и срабатывае события, но выполяняется раньше чем событие убдует инициализированно, а следоовательно запустится раньше чем те функции которые прикреплены к событию swipe
                callback_fail: () => console.log("FAIL"), //функция которая будет вызвана если жест над элементом не был свайпом
                callback_finally: () => console.log("FINALLY"), //функция которая будет вызвана по завершенни проверки действия на свайп, вне зависимости как завершилась проверка
                callback_start: () => console.log("START"), //функция которая будет вызвана каждый раз при старте свайпа, когда указатель нажали
                callback_move: () => console.log("MOVE"), //функция которая будет вызвана каждый раз в момент движения указателя
                callback_leave: () => console.log("LEAVE"), //функция которая будет вызвана когдя указатель  покинет элемент или будет ошибка регистрации указателя*/
                callback_success: () => {},
                callback_fail: () => {},
                callback_finally: () => {},
                callback_start: () => {},
                callback_move: () => {},
                callback_leave: () => {},
                el: el, //элемент на котором изначально было привязано событие свайпа
                terget_el: null, //элемент который является целевым в данные момент времени, т.е. в начале это элемент по кторому кликнули потом элементы по которым движется курсор, вконце элемент над которым отпустили мышку, не особо работает для сенсорых экранов там почему-то всего элемент который мы нажали вначале
                start_terget_el: null, //элемент на котором начат свайп, т.е. нажали мышь или палец
                finall_target_el: null, //элемент на котором окончен свайп, т.е. отпустили кнопку мыши или палец, не особо работает для сенсорых экранов там почему-то всего элемент который мы нажали вначале
                direction: "", //направление свайпа
                start_direction: null, //начальное направление свайпа, для того чтоб поянт куда изначально элемент начали смещать
                some_touches: false, //если true то будет регистрировать свайп даже при нескольких точках касания на сансорном экране (вне целевого элемента!!!), и как следствие сможет обрабатывать несколько разных свайпов или других сенсорных событий для разных элементов одновременно
                touch_identifier: null, //ВАЖНО: это для избежаения ошибки иногда индентификаторы путаются местами и получается глюки, не знаю почему так происходит, но сверяем идентификаторы мы именно чтоб избежать багов
                permission_directions: {
                    top: true,
                    right: true,
                    bottom: true,
                    left: true
                }, //направления в которых нужно учитывать свайп
                permission_mouse_buttons: {
                    1: true, //левая
                    2: false, //центральная
                    3: false //правая
                }, //какие кнопки мыши учитывать при свайпе
                start_time: 0, //время начало свайпа
                total_time: 0, //сколько времени занял свайп
                start_x: 0, //позиция точки нажатия в самом начале по горизонтали
                start_y: 0, //позиция точки нажатия в самом начале по вертикали
                x: 0, //будет хранить изменяемую позицию точки нажатия при перемещении по горизонтали
                y: 0, //будет хранить изменяемую позицию точки нажатия при перемещении по вертикали
                x_dist: 0, //дистанция проейдаеная по горизонтали
                y_dist: 0 //дистанция проейдаеная по вертикали
            };
            // настройки по умолчанию

            settings = Object.assign({}, default_settings, settings); // настройки по умолчанию объединяем и заменяем настройками пользователя

            if (!settings.touch_swipe && !settings.mouse_swipe) return; //если не указан ни один тип устройства для мониторинга свайпа завершаем инициализацию прослушивания свайпа

            settings.start_events = ""; //тут будут храниться события которые будут вызываться для начала слушания свайпа mousedown touchstart
            settings.move_events = ""; //тут будут храниться события которые будут вызываться во время движения указателя mousemove touchmove
            settings.finall_events = ""; //тут будут храниться события которые будут вызываться во время окончания жеста mouseup touchend
            settings.leave_events = ""; //тут будут храниться события которые будут вызываться в момент когда указатель покидает элемент или всевозможные ошибки mouseleave touchcancel

            //формируем нужные имена событий
            if (settings.touch_swipe) {
                settings.start_events += settings.start_events.length > 0 ? " touchstart" : "touchstart";
                settings.move_events += settings.move_events.length > 0 ? " touchmove" : "touchmove";
                settings.finall_events += settings.finall_events.length > 0 ? " touchend" : "touchend";
                settings.leave_events += settings.leave_events.length > 0 ? " touchcancel" : "touchcancel";
            }

            if (settings.mouse_swipe) {
                settings.start_events += settings.start_events.length > 0 ? " mousedown" : "mousedown";
                settings.move_events += settings.move_events.length > 0 ? " mousemove" : "mousemove";
                settings.finall_events += settings.finall_events.length > 0 ? " mouseup" : "mouseup";
                settings.leave_events += settings.leave_events.length > 0 ? " mouseleave" : "mouseleave";
            }
            //формируем нужные имена событий

            //получаем максимально и минимально дупустимые растояния в пикселях для учёта свайпа
            let el_width = $(el).width(),
                el_height = $(el).height();

            settings.min_px_dist_x = settings.min_px_dist_x === null ? (el_width / 100) * settings.min_percent_dist_x : settings.min_px_dist_x;
            settings.max_px_dist_x = settings.max_px_dist_x === null ? (el_width / 100) * settings.max_percent_dist_x : settings.max_px_dist_x;
            settings.min_px_dist_y = settings.min_px_dist_y === null ? (el_height / 100) * settings.min_percent_dist_y : settings.min_px_dist_y;
            settings.max_px_dist_y = settings.max_px_dist_y === null ? (el_height / 100) * settings.max_percent_dist_y : settings.max_px_dist_y;
            //получаем максимально и минимально дупустимые растояния в пикселях для учёта свайпа

            //записываем в глобальный список данные этого элемента
            list_data.swipe.push({
                element: el,
                settings: settings
            });
            //записываем в глобальный список данные этого элемента

            //window.getEventListeners($(".top_banner_wrap")[0])

            //отключаем события по умолчанию если задано в настройках
            if (settings.remove_default_events) {
                $(el).on("click " + settings.start_events + " " + settings.move_events + " " + settings.finall_events + " " + settings.leave_events, bf.remove_default, { passive: false });
            }
            //отключаем события по умолчанию если задано в настройках

            $(el).on(settings.start_events, bf.swipe_event.start); //начинаем слушать событие нажатия мыши и/или касания
            $(window).on("resize", bf.swipe_event.resize_recalculete); //он добавляется и его НЕ нужно удалять
        },
        //срабатывает в момент подключения слушателя swipe к элементу

        //при ресайзе пересчитываем максимальные и минимальные вдлинны свайпа в пикселях
        resize_recalculete: function() {
            for (let i = 0; i < list_data.swipe.length; i++) {
                let settings = list_data.swipe[i].settings,
                    el_width = $(settings.el).width(),
                    el_height = $(settings.el).height();

                settings.min_px_dist_x = (el_width / 100) * settings.min_percent_dist_x;
                settings.max_px_dist_x = (el_width / 100) * settings.max_percent_dist_x;
                settings.min_px_dist_y = (el_height / 100) * settings.min_percent_dist_y;
                settings.max_px_dist_y = (el_height / 100) * settings.max_percent_dist_y;
            }
        },
        //при ресайзе пересчитываем максимальные и минимальные вдлинны свайпа в пикселях

        //ищем текущий элемент с его настройками для свайпа
        get_settings: function(el) {
            for (let i = 0; i < list_data.swipe.length; i++) {
                if (list_data.swipe[i].element === el) {
                    return list_data.swipe[i].settings;
                }

            }
        },
        //ищем текущий элемент с его настройками для свайпа

        //проверяем сколько точек касания на экране и какая кнопка мыши нажата
        check_touch_and_mouses_buttons: function(e, settings) {
            /*touches: список всех точек соприкосновения пальцев с экраном.
            targetTouches: список всех точек соприкосновения с текущим элементом DOM.
            changedTouches: список всех точек соприкосновения, участвующих в текущем событии. Например, в случае события touchend это будет точка, в которой пользователь убрал палец с экрана.*/

            if (typeof e.touches !== "undefined" && e.targetTouches.length > 1) return false; //если экран сенсорный экран и на данном элементе уже есть касание то мы игнорируем все остальные касание по данному элементу

            let event = bf.swipe_event.events_props(e); //получаем объект с событиями для текущего типа устройства

            if (typeof event.which !== "undefined" && !settings.permission_mouse_buttons[event.which]) return false; // игнорирование нажатие неразрешённых кнопок мыши

            return event;
        },
        //проверяем сколько точек касания на экране и какая кнопка мыши нажата

        //стартует после нажатия клавиши мыши или касания пальца на элементе
        start: function(e) {
            //this элемент до которого дошло всплытие события, т.е. element.addEventListener(type, test) в данном случае если клик был по любому дочернему элементу element или нему самому , то в this будет этот element на котором вызвано слушанье события
            let settings = bf.swipe_event.get_settings(this); //настройки свайпа текущего элемента

            settings.start_time = Math.round(performance.now()); //время начало свайпа

            if (typeof e.touches !== "undefined" && !settings.some_touches && e.touches.length > 1) return; //для сенсорных экранов и если запрещено более чем одно сенсорное соприкосновение с экраном и на экране сейчас более одного касания

            let event = bf.swipe_event.check_touch_and_mouses_buttons(e, settings); //вернёт объект события или false если указатель не прошёл проверку

            if (typeof event.identifier !== "undefined") settings.touch_identifier = event.identifier; //ВАЖНО: это для избежаения ошибки иногда индентификаторы путаются местами и получается глюки, не знаю почему так происходит, но сверяем идентификаторы мы именно чтоб избежать багов

            if (!event) return; //если указатель не прошёл проврку, больше одного касания или не разрешённая кнопка миши

            settings.start_x = event.pageX; //записываем стартовое положение точки нажатия на документе
            settings.start_y = event.pageY; //записываем стартовое положение точки нажатия на документе

            settings.x = event.pageX; //записываем текущее положение точки нажатия на документе
            settings.y = event.pageY; //записываем текущее положение точки нажатия на документе

            //добаляем слушатели в зависимости от типов устройств для которых свайп будет отслеживаться
            $(settings.el).on(settings.move_events, bf.swipe_event.move, { passive: false }); //добавляем слушатель события для перемещения курсора или пальца
            $(settings.el).on(settings.finall_events, bf.swipe_event.finall, { passive: false }); //добавляем слушатель события когда кнопка мыши отпущена или палец поднят
            $(settings.el).on(settings.leave_events, bf.swipe_event.leave, { passive: false }); //добавляем слушатель события курсор мыши покинул элемент или палец вышел за пределы экрана или ещё какая-то ошибка на сенсоре
            //добаляем слушатели в зависимости от типов устройств для которых свайп будет отслеживаться

            settings.start_terget_el = event.target; //записываем элемент на котором было нажатие

            settings.start_direction = null; //сбрасаваем стартовое направление свайпа

            settings.callback_start();
        },
        //стартует после нажатия клавиши мыши или касания пальца на элементе

        //перемещения курсора или пальца
        move: function(e) {
            let settings = bf.swipe_event.get_settings(this), //настройки свайпа текущего элемента
                event = bf.swipe_event.check_touch_and_mouses_buttons(e, settings); //вернёт объект события или false если не указатель не прошёл проверку

            if (typeof event.identifier !== "undefined" && settings.touch_identifier !== event.identifier) return; //ВАЖНО: это для избежаения ошибки иногда индентификаторы путаются местами и получается глюки, не знаю почему так происходит, но сверяем идентификаторы мы именно чтоб избежать багов
            if (!event) {
                bf.swipe_event.end(false, settings);
                return; //если указатель не прошёл проврку, больше одного касания или не разрешённая кнопка миши
            }

            settings.terget_el = event.target; //записываем элемент над которым проходит сейчас указатель, не особо работает для сенсорых экранов там почему-то всего элемент который мы нажали вначале

            settings.x = event.pageX; //записываем текущее положение точки нажатия на документе
            settings.y = event.pageY; //записываем текущее положение точки нажатия на документе

            //определяем изначальное напрвление свайпа
            if (!settings.start_direction) {
                let x_dist = Math.abs(settings.x - settings.start_x), //получаем на сколько пикселей было смещение по горизонтали
                    y_dist = Math.abs(settings.y - settings.start_y); //получаем на сколько пикселей было смещение по вертикали

                //нужно чтоб разница в смещении сталь хоть немного существенной что +- точно пределить направление свайпа и отсеять ложные напраления
                if (Math.abs(x_dist - y_dist) > 3) {
                    if (x_dist > y_dist) {
                        if (settings.x > settings.start_x) {
                            settings.start_direction = "right";
                        } else {
                            settings.start_direction = "left";
                        }
                    } else if (x_dist < y_dist) {
                        if (settings.y > settings.start_y) {
                            settings.start_direction = "bottom";
                        } else {
                            settings.start_direction = "top";
                        }
                    }
                }
            }
            //определяем изначальное напрвление свайпа

            settings.callback_move();
        },
        //перемещения курсора или пальца

        //курсор мыши покинул элемент или палец вышел за пределы экрана или ещё какая-то ошибка на сенсоре
        leave: function(e) {
            let settings = bf.swipe_event.get_settings(this), //настройки свайпа текущего элемента
                result = bf.swipe_event.analiz_swipe(settings), //определяем соответствует ли жест свайпу
                event = bf.swipe_event.check_touch_and_mouses_buttons(e, settings); //вернёт объект события или false если не указатель не прошёл проверку

            if (!event) {
                bf.swipe_event.end(false, settings);
                return; //если указатель не прошёл проврку, больше одного касания или не разрешённая кнопка миши
            }

            settings.finall_target_el = settings.el;

            settings.callback_leave();

            settings.allow_leave ? bf.swipe_event.end(result, settings) : bf.swipe_event.end(false, settings); //передаём в конечный обработчик end результат проверки был ли это свайп если разрешено покидать элемент при свайпе
        },
        //курсор мыши покинул элемент или палец вышел за пределы экрана или ещё какая-то ошибка на сенсоре

        //будет вызвана когда указатель будет отпущен
        finall: function(e) {
            let settings = bf.swipe_event.get_settings(this), //настройки свайпа текущего элемента
                result = bf.swipe_event.analiz_swipe(settings), //определяем соответствует ли жест свайпу
                event = bf.swipe_event.check_touch_and_mouses_buttons(e, settings); //вернёт объект события или false если не указатель не прошёл проверку

            if (!event) {
                bf.swipe_event.end(false, settings);
                return; //если указатель не прошёл проврку, больше одного касания или не разрешённая кнопка миши
            }

            settings.finall_target_el = event.target; //записываем элемент над которым отпустили указатель, не особо работает для сенсорых экранов там почему-то всего элемент который мы нажали вначале
            bf.swipe_event.end(result, settings); //анализируем жест и результат передаём в завершающую функцию
        },
        //будет вызвана когда указатель будет отпущен

        //завершаем обработку события
        end: function(result, settings) {
            bf.swipe_event.clean(settings); //функция чистит все ненужные слушатели после того как указатель убран

            if (result) { //свайп
                settings.callback_success();
                bf.swipe_event.run_event(settings);
            } else { //не свайп
                settings.callback_fail();
            }

            settings.callback_finally();
        },
        //завершаем обработку события

        //возвращает объект со списком свойств текущего события для текущего устройства
        events_props: function(e) {
            if (typeof e.touches !== "undefined") {
                let event = null;
                //перебираем события данного типа (touchemove например) которые происходят в данный момент
                for (let i = 0; i < e.changedTouches.length; i++) {
                    let changed_id = e.changedTouches[i].identifier; //для каждого события получаем идентификатор касание который его вызвал

                    //перебираем события которые применяются конкретно к этому элементу в данный момент времени
                    for (let b = 0; b < e.targetTouches.length; b++) {
                        let target_id = e.changedTouches[b].identifier; //для каждого события получаем идентификатор касание который его вызвал
                        if (changed_id === target_id) event = e.changedTouches[b]; //находи те касания которые применяются к текущему элементу и соответствуют текущему событию
                    }
                    //перебираем события которые применяются конкретно к этому элементу в данный момент времени
                }
                //перебираем события данного типа (touchemove например) которые происходят в данный момент

                if (event === null) return e.changedTouches[0]; //для touchend

                return event;
            } else {
                return e;
            }
        },
        //возвращает объект со списком свойств текущего события для текущего устройства

        //функция чистит все ненужные слушатели
        clean: function(settings) {
            $(settings.el).off(settings.move_events, bf.swipe_event.move); //удаляем слушатель события для перемещения курсора или пальца
            $(settings.el).off(settings.finall_events, bf.swipe_event.finall); //удаляем слушатель события когда кнопка мыши отпущена или палец поднят
            $(settings.el).off(settings.leave_events, bf.swipe_event.leave); //удаляем слушатель курсор мыши покинул элемент или палец вышел за пределы экрана или ещё какая-то ошибка на 
        },
        //функция чистит все ненужные слушатели

        //оцениваем жест как свайп
        analiz_swipe: function(settings) {
            settings.x_dist = Math.abs(settings.x - settings.start_x); //получаем на сколько пикселей было смещение по горизонтали
            settings.y_dist = Math.abs(settings.y - settings.start_y); //получаем на сколько пикселей было смещение по вертикали

            settings.total_time = Math.round(performance.now() - settings.start_time); //сколько времени длился свайп

            //проверяем не превышено ли время разрешённое на свайп
            if (settings.total_time < settings.min_time || settings.total_time > settings.max_time) {
                console.log("NO swipe timeout");
                return false;
            }
            //проверяем не превышено ли время разрешённое на свайп

            //спайп по горизонтали
            if (settings.x_dist >= settings.y_dist) {
                //если дистанция свайпа больше минимально счиаемой дистанции и меньше максимальной дистации
                if (settings.x_dist >= settings.min_px_dist_x && settings.x_dist <= settings.max_px_dist_x) {
                    if (settings.x > settings.start_x) {
                        settings.direction = "right";
                        console.log("RIGHT swipe");
                        return settings.permission_directions.right ? true : false;
                    } else {
                        settings.direction = "left";
                        console.log("LEFT swipe");
                        return settings.permission_directions.left ? true : false;
                    }
                }
                //если дистанция свайпа больше минимально счиаемой дистанции и меньше максимальной дистации

                //пройдена слишком маленькая дистация
                else {
                    console.log("NO swipe distance x");
                    return false;
                }
                //пройдена слишком маленькая дистация
            }
            //спайп по горизонтали

            //спайп по вертикали
            else {
                //если дистанция свайпа больше минимально счиаемой дистанции и меньше максимальной дистации
                if (settings.y_dist >= settings.min_px_dist_y && settings.y_dist <= settings.max_px_dist_y) {
                    if (settings.y > settings.start_y) {
                        settings.direction = "bottom";
                        console.log("BOTTOM swipe");
                        return settings.permission_directions.bottom ? true : false;
                    } else {
                        settings.direction = "top";
                        console.log("TOP swipe");
                        return settings.permission_directions.top ? true : false;
                    }
                }
                //если дистанция свайпа больше минимально счиаемой дистанции и меньше максимальной дистации

                //пройдена слишком маленькая дистация
                else {
                    console.log("NO swipe distance y");
                    return false;
                }
                //пройдена слишком маленькая дистация
            }
            //спайп по вертикали
        },
        //оцениваем жест как свайп

        //запускаем привязку события
        run_event: function(settings) {
            //данные которые будут переданы в событие
            let data = {
                    direction: settings.direction,
                    x_dist: settings.x_dist,
                    y_dist: settings.y_dist,
                    total_time: settings.total_time
                },
                //данные которые будут переданы в событие

                //создаём кастомное событие
                swipeEvent = new CustomEvent("swipe", {
                    bubbles: true,
                    cancelable: true,
                    detail: data
                });
            //создаём кастомное событие

            settings.el.dispatchEvent(swipeEvent); //привязываем событие к элементу
        }
        //запускаем привязку события
    },
    //функция реализует событие свайпа

    //преобразует строку в массив разделитель separator
    //++
    string_to_array: function(string, separator = " ") {
        return string.split(separator); //возвращаем массив
    },

    //преобразуем массивоподобные объекты в separator
    //++
    toArray: function(data) {
        return Array.from(data);
    },
    //преобразуем массивоподобные объекты в массивы

    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект в котором будут только те элементы которые встречаются в обоих массивах
    //clone_clean - если true то вернёт массив без одинаковых значений
    return_clone_elements_arr: function(arr_1, arr_2, clone_clean = true) {
        let massiv_1 = Array.isArray(arr_1) ? arr_1 : this.toArray(arr_1), //если вдруг это не массив то преобразуем в массив
            massiv_2 = Array.isArray(arr_2) ? arr_2 : this.toArray(arr_2), //если вдруг это не массив то преобразуем в массив
            //перебираем массив massiv_1 для поиска совпадающих значений с массивом massiv_2
            result = massiv_1.filter((item, index) => {
                return massiv_2.indexOf(item) !== -1; //если indexOf вернул не -1 то функция вернёт true и текущий элемнт будет добавлен в массив result так как он присутствует в обоих массивах
            });
        //перебираем массив massiv_1 для поиска совпадающих значений с массивом massiv_2

        return clone_clean ? this.return_no_clone_arr(result) : result; //удаляем повоторяющиеся элементы и возвращаем новый объект
    },
    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект в котором будут только те элементы которые встречаются в обоих массивах

    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект содержащий все элементы обеих массивов
    //clone_clean - если true то вернёт массив без одинаковых значений
    //result = [] массив в который будем записывать все элементы
    return_skleniy_arr: function(arr_1, arr_2, clone_clean = true, result = []) {
        result.push.apply(result, arr_1); //записываем данные из arr_1
        result.push.apply(result, arr_2); //записываем данные из arr_2
        return clone_clean ? this.return_no_clone_arr(result) : result;
    },
    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект содержащий все элементы обеих массивов

    //получает на вход массив (массивоподобный объект), после этого удаляет в нём одинаковые значения и возвращает результирующий объект с новой длинной
    return_no_clone_arr: function(arr) {
        //let result = this.toArray(new Set(arr));//здесь применяется метод set который возвращает только уникальные значения
        let massiv = Array.isArray(arr) ? arr : this.toArray(arr), //если вдруг это не массив то преобразуем в массив
            result = massiv.filter((item, index) => { return massiv.indexOf(item) === index }); //с помошью фильтрующего метода Array возвращаем массив в котором будт только элементы удовлетворяющие условию massiv.indexOf(item) === index, т.е. если будет повторяющееся значение его индекс будет равен не его индексу , а первому такому элементу в массиве, следовательно этот элемент повторно не будет включаться
        return result;
    },
    //получает на вход массив (массивоподобный объект), после этого удаляет в нём одинаковые значения и возвращает результирующий объект с новой длинной

    //очищает массив arr от значений values
    return_cleaned_of_values: function(values, arr) {
        let cleaned = Array.isArray(values) ? values : this.toArray(values), //если вдруг это не массив то преобразуем в массив
            massiv = Array.isArray(arr) ? arr : this.toArray(arr), //если вдруг это не массив то преобразуем в массив
            result = massiv.filter((item) => !cleaned.includes(item));
        //result = massiv.filter((item) => { return cleaned.indexOf(item) < 0 });тоже самое но с помощью метода indexOf
        return result;
    },
    //очищает массив arr от значений values

    //внутренняя функция возвращает объект с данным width padding border margin переданного элемента для его ширины или высоты
    getWidthOrHeight: function(element, dimension) {
        if (dimension === "width") {
            let padding_left = window.getComputedStyle(element).paddingLeft,
                padding_right = window.getComputedStyle(element).paddingRight,
                padding_lr = Number(padding_left.replace("px", "")) + Number(padding_right.replace("px", "")), //общая ширина padding
                border_left = window.getComputedStyle(element).borderLeftWidth,
                border_right = window.getComputedStyle(element).borderRightWidth,
                border_lr = Number(border_left.replace("px", "")) + Number(border_right.replace("px", "")), //общая ширина border
                margin_left = window.getComputedStyle(element).marginLeft,
                margin_right = window.getComputedStyle(element).marginRight,
                margin_lr = Number(margin_left.replace("px", "")) + Number(margin_right.replace("px", "")), //общая ширина margin
                width = element.offsetWidth - padding_lr - border_lr;
            return {
                "width": width,
                "padding": padding_lr,
                "border": border_lr,
                "margin": margin_lr
            }
        } else if (dimension === "height") {
            let padding_top = window.getComputedStyle(element).paddingTop,
                padding_bottom = window.getComputedStyle(element).paddingBottom,
                padding_tb = Number(padding_top.replace("px", "")) + Number(padding_bottom.replace("px", "")), //общая ширина padding
                border_top = window.getComputedStyle(element).borderTopWidth,
                border_bottom = window.getComputedStyle(element).borderBottomWidth,
                border_tb = Number(border_top.replace("px", "")) + Number(border_bottom.replace("px", "")), //общая ширина border
                margin_top = window.getComputedStyle(element).marginTop,
                margin_bottom = window.getComputedStyle(element).marginBottom,
                margin_tb = Number(margin_top.replace("px", "")) + Number(margin_bottom.replace("px", "")), //общая ширина margin
                height = element.offsetHeight - padding_tb - border_tb;
            return {
                "height": height,
                "padding": padding_tb,
                "border": border_tb,
                "margin": margin_tb
            }
        }
    },

    //функция для получения высот и ширин таких элементов как window и document
    //elem - передаваемый объект window или document
    //name - Width / Height
    //target_property - свойство которое нужно получить, outerHeight к примеру
    win_doc_wh: function(elem, name, target_property) {
        if (elem === window) {
            return target_property.indexOf("outer") === 0 ?
                elem["inner" + name] :
                elem.document.documentElement["client" + name];
        }
        //если это document
        if (elem.nodeType === 9) {
            let doc = elem.documentElement;

            return Math.max(
                elem.body["scroll" + name], doc["scroll" + name],
                elem.body["offset" + name], doc["offset" + name],
                doc["client" + name]
            );
        }

        return false;
    },
    //функция для получения высот и ширин таких элементов как window и document

    //возвращает массив состоящий из всех элементов найденых по селекстором через запятую, примечательно что будет использован оптимальный поиск по дереву DOM для каждого типа селектора
    //selectors - строка в виде селекторов, можно несколько перечисленных через запятую, к примеру: ".test, a.web, header, nav"
    //element_fo_search - элемент в котором будет производится поиск всех элементов по селектору
    //result сюда будем записывать все элементы DOM найденые по соответствующим селекторам
    return_selectors_arr: function(selectors, element_fo_search = document, result = []) {
        let selectors_arr = this.string_to_array(selectors, ","); //массив со списком селекторов

        //перебираем все предоставленные селекторы разделённые запятой и записываем их в массив
        for (let i = 0; i < selectors_arr.length; i++) {

            //возможно селекторы разделены не только запятой но и пробелом, вот так ", ", тогда нужно удалить все пробелы из начала строки
            //удалятся первые символы будут до тех пор пока ои не перестанут быть пробелами
            while (selectors_arr[i][0] === " ") {
                selectors_arr[i] = selectors_arr[i].substring(1); //удаляем пробел вначале строки
            }
            //возможно селекторы разделены не только запятой но и пробелом, вот так ", ", тогда нужно удалить все пробелы из начала строки

            let selector = selectors_arr[i], //текущий итерируемый селектор в наборе
                proverka = /^(#([\w]+)|(\w+)|\.([\w]+))$/.test(selector); //проверяем является ли selector id, tag или class

            //если селекстор сооствествует id, тегу или одиночному классу
            if (proverka) {
                //id
                if (selector.includes("#")) {
                    let el_fo_id = element_fo_search.getElementById(selector.slice(1)); //элемент найденый по id

                    //если el_fo_id был найден и нее равен null
                    if (el_fo_id) {
                        result.push.apply(result, [el_fo_id]); //поскольку первая возможная запись в массив то просто записываем без всяких доп проверок на содержимое массива result
                    }
                    //если el_fo_id был найден и нее равен null
                }
                //id

                //class
                else if (selector.includes(".")) {
                    result = this.return_skleniy_arr(result, element_fo_search.getElementsByClassName(selector.slice(1)));
                }
                //class

                //tag
                else {
                    result = this.return_skleniy_arr(result, element_fo_search.getElementsByTagName(selector));
                }
                //tag
            }
            //если селекстор сооствествует id, тегу или одиночному классу

            //если сложный селектор
            else {
                result = this.return_skleniy_arr(result, element_fo_search.querySelectorAll(selector));
            }
            //если сложный селектор
        }
        //перебираем все предоставленные селекторы разделённые запятой и записываем их в массив

        return result; //возвращаем массив со всеми элементами
    },
    //возвращает массив состоящий из всех элементов найденых по селекстором через запятую, примечательно что будет использован оптимальный поиск по дереву DOM для каждого типа селектора

    //создаёт новый куки
    //name - имя записываемого куки
    //value - значение записываемого кукки
    //options - параметры для записываемых куки
    setCookie: function(name, value, options = {
        //path: '/', //базовый путь по которому куки будут доступны
        //domain: "site.com",//домен дял которого будут действовать куки
        //expires: "Tue, 19 Jan 2038 03:14:07 GMT",//дата истечения куки
        //"max-age": "604800", //устанавливает время действия куки в секундах, по умолчанию 7 дней
        //secure: true //куки будут переданы только по HTTPS протоколу
    }) {
        //объединяем объекты со значением по умолчанию и переданные пользователем
        options = Object.assign({
            path: '/',
            "max-age": "604800"
        }, options);
        //объединяем объекты со значением по умолчанию и переданные пользователем

        name = decodeURIComponent(name); //получаем "uswvewvc vw vw vweer" из "uswvewvc%20vw%20vw%20vweer" или "uswvewvc vw vw vweer" из "uswvewvc vw vw vweer"
        name = encodeURIComponent(name); //получаем "uswvewvc%20vw%20vw%20vweer" из "uswvewvc vw vw vweer"

        if (!options.path) { options.path = '/'; } //если явно не задан адрес дял которого работает куки то делаем его доступным для всего сайта

        //проверим соответсвует парметр expires объекта options формату даты unix
        if (options.expires instanceof Date) {
            options.expires = options.expires.toUTCString(); //преобразуем значение expires в формат Mon, 03 Jul 2006 21:44:38 GMT
        }
        //проверим соответсвует парметр expires объекта options формату даты unix

        let updatedCookie = name + "=" + encodeURIComponent(value); //данные для записи в куки

        //перебираем объект options и дописываем в данные для записи в куки
        for (let optionKey in options) {
            updatedCookie += "; " + optionKey;
            let optionValue = options[optionKey];
            if (optionValue !== true) {
                updatedCookie += "=" + optionValue;
            }
        }
        //перебираем объект options и дописываем в данные для записи в куки

        document.cookie = updatedCookie; //записываем данные в куки
    },
    // Пример использования:
    //setCookie('user', 'John', { secure: true, 'max-age': 3600 });
    //создаёт новый куки

    // возвращает куки с указанным name или undefined, если ничего не найдено
    //name - имя куки значение которого нужно получить
    getCookie: function(name) {
        //может быть передано значение как "uswvewvc%20vw%20vw%20vweer" так и "uswvewvc vw vw vweer" , по этому сначало декодируем в строку с пробелами, а потом кодируем с заменой на соответствующие символы, тем самым мы получим надёжный вывод вне зависимости от того как запросился куки
        name = decodeURIComponent(name); //получаем "uswvewvc vw vw vweer" из "uswvewvc%20vw%20vw%20vweer" или "uswvewvc vw vw vweer" из "uswvewvc vw vw vweer"
        name = encodeURIComponent(name); //получаем "uswvewvc%20vw%20vw%20vweer" из "uswvewvc vw vw vweer"

        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));

        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    // возвращает куки с указанным name или undefined, если ничего не найдено

    //удаляем куки по имени
    //name - имя куки который нужно удалить
    deleteCookie: function(name) {
        this.setCookie(name, "", {
            'max-age': -1
        })
    },
    //удаляем куки по имени

    //функция сравнивет данные из check_value с data_fo_wait и когда они будут равными завершит функцию
    //ВАЖНО: возвращает Promise !!!
    //check_value - функция, результат выполнение которой будет сравниватьтся с data_fo_wait
    //data_fo_wait - данные которые мы хотим дождаться от функции check_value
    //max_time_length - максимальное время в секундах которое будет выполняться проверка
    //interval - интервал в миллисекундах через котороый будет производиться проверка
    /*пример использования
    async function() {
        делаем что-то
        await bf.wait(() => el.css("height"), "20px"); ждём пока () => el.css("height") не вернёт нам "20px"
        делаем что-то
        await bf.wait(() => item.css("top"), "0px"); ждём пока () => item.css("top") не вернёт нам "0px"
        делаем что-то
    }*/
    wait: function(check_value = null, data_fo_wait, max_time_length = 10, interval = 10) {
        //возвращаем промис с результатами ожидания
        return new Promise((resolve, reject) => {
            //если в check_value ничего не передано или передана не функция заверщаемся неудачей
            if (!check_value || typeof check_value !== "function") {
                reject();
                return;
            }

            let time_start = new Date().getTime(), //время старата в миллисекундах
                time_length = max_time_length * 1000, //время на выполнение в миллисекундах
                stop_time = time_start + time_length; //время на котором выполнение таймера будет прервано

            //создаём циклическую проверку соответствия check_value с data_fo_wait
            let timer_id = setInterval(() => {
                //console.log(check_value()+" ?="+data_fo_wait);
                if (check_value() === data_fo_wait) {
                    clearInterval(timer_id);
                    resolve();
                    return; //заверщаем функцию чтоб не было дальнейших проверок
                }

                if (new Date().getTime() >= stop_time) {
                    clearInterval(timer_id);
                    reject("TIMEOUT");
                }
            }, interval);
            //создаём циклическую проверку соответствия check_value с data_fo_wait
        });
        //возвращаем промис с результатами ожидания
    }
    //функция сравнивет данные из check_value с data_fo_wait и когда они будут равными завершит функцию
}
//базовые функции для работы

//тут храняться кастомные собития и функции которые нужно выхывать при добавлени или удалении каждого события
const ksn_custom_events = {
    "swipe": bf.swipe_event.init
};
//тут храняться кастомные собития и функции которые нужно выхывать при добавлени или удалении каждого события

//функция инициализирует первый поиск по selector-у и возвращает сформированный объект obj с прототипом KSN_jQuery
let ksn = function(selector = null) {
    let obj = Object.create(KSN_jQuery); //создаём пустой объект с прототипом KSN_jQuery
    return obj.init(selector); //инициализируем, возвращаем наш объект obj с прототипом KSN_jQuery и всеми элементами найдеными по селекторам
}
//функция инициализирует первый поиск по selector-у и возвращает сформированный объект obj с прототипом KSN_jQuery

const KSN_jQuery = {
    //метод инициализации, ищет все подходящие селекторы и возвращает результат в виде объекта с прототипом KSN_jQuery
    //obj - объект с прототипом KSN_jQuery
    init: function(selector, obj = this) {
        //если селектор $(""), $(null), $(undefined), $(false)
        if (!selector) {
            return obj; //возвращаем наш объект obj
        }
        //если селектор $(""), $(null), $(undefined), $(false)

        //для текстовых сетекторов "#test, .class_test>div.tested, header, a[href='/wefewf/ewf']"
        if (typeof selector === "string") {
            let elements = bf.return_selectors_arr(selector); //возвращаем все найденые элементы в виде массива

            //перебираем все элементы elements и записываем их по порядку в объект obj
            for (let i = 0; i < elements.length; i++) {
                obj[i] = elements[i];
            }
            //перебираем все элементы elements и записываем их по порядку в объект obj

            obj.length = elements.length; //записываем в коне количество элементов объекта объекта length

            return obj; //возвращаем наш объект obj с прототипом KSN_jQuery и всеми элементами найдеными по селекторам
        }
        //для текстовых сетекторов ".class_test>div.tested"

        //для сетекторов типа DOMElement таких как window, document...
        obj[0] = selector; //записываем объект DOMElement
        obj.length = 1;
        return obj; //возвращаем наш объект obj с прототипом KSN_jQuery
        //для сетекторов типа DOMElement таких как window, document...
    },
    //метод инициализации, ищет все подходящие селекторы и возвращает результат в виде объекта с прототипом KSN_jQuery

    //метод создаёт новый объект с прототипом KSN_jQuery, и заполянет его элементами из elements
    //obj - создаём объект obj с прототипом KSN_jQuery
    construct_new_ksn: function(elements = null, obj = Object.create(KSN_jQuery)) {
        //ПРИМЕЧАНИЕ: создать новый объект с заданым прототипом и записать в него занчения намного быстрее чем чистить старый объект, а потом ещё и заполянть его значениями

        //если ничего не передано для формирования нового объекта, то возвращаем новый объект с длинной в 0
        if (elements === null) {
            obj.length = 0;
            return obj;
        }
        //если ничего не передано для формирования нового объекта, то возвращаем новый объект с длинной в 0

        //перебираем все элементы elements и записываем их по порядку в объект obj
        for (let i = 0; i < elements.length; i++) {
            obj[i] = elements[i];
        }

        obj.length = elements.length; //записываем в коне количество элементов объекта объекта length

        return obj; //возвращаем наш объект obj
    },
    //метод создаёт новый объект с прототипом KSN_jQuery, и заполянет его элементами из elements

    //производит итерации над объектами и для каждого итирируемого элемента объекта вызиывает функцию callback
    //arg_1 - объект или функция
    //arg_2 - функция обратного вызова
    //++
    each: function(arg_1, arg_2) {
        let obj = typeof arg_1 === "function" ? this : arg_1, //если в arg_1 передана функция то obj будет this
            callback = typeof arg_1 === "function" ? arg_1 : arg_2; //если в arg_1 передана функция то callback будет arg_1

        obj = Array.isArray(obj) ? obj : bf.toArray(obj); //преобразуем в массив для итераций если нужно

        //перебираем массив с итерируемыми элементами
        for (let i = 0; i < obj.length; i++) {
            callback.call(obj[i], i, obj[i]); //дял каждого итирируемого элемента вызываем функцию обратиного вызова в которую в качестве this передаём объект текущего итериремого элемента , а в качестве аргументов передаём индекс и значение в массиве соответственно
        }
        //перебираем массив с итерируемыми элементами

        return this.construct_new_ksn(obj); //возвращаем объект
    },
    //производит итерации над объектами и для каждого итирируемого элемента объекта вызиывает функцию callback

    //добавляем слушатель события
    //event - строка событий которые нужно прослушивать на элементе, пример: "touchend click resize focus blur"
    //callback - функция которую нужно вызвать при срабатывании события из строки event, можно указать название функции, пример: touch_menu_open_close ; или указать функцию, пример: function(){console.log("Выполняем что-то, при срабатывании события из массива event")}
    //options_event - сюда нужно передать объект с обциями для данного слушателя
    //custom_settings - настрйоки которые будт переданы в кастомные события созданые пользователем такие как swipe
    on: function(event, callback, options_event, custom_settings = {}, elements = this) {
        let events = bf.string_to_array(event); //преобрзуем строковый список в масив

        options_event = Object.assign({}, { //объединяем параметры пользователя с параметрами по умолчанию
            passive: true
        }, options_event);

        for (let i = 0; i < elements.length; i++) {
            for (let b = 0; b < events.length; b++) {

                //если событие кастомное
                if (ksn_custom_events.hasOwnProperty(events[b])) {
                    ksn_custom_events[events[b]](elements[i], custom_settings, true) //запускаем соответствующую функцию для регистрации данного события
                }
                //если событие кастомное

                elements[i].addEventListener(events[b], callback, options_event);
            }
        }
    },
    //добавляем слушатель события

    //удаляем слушатель события
    //event - строка событий которые нужно отключить от прослушивания для элемента, пример: "touchend click resize"
    //callback - функция которая должна быть отключена для данных слушателей событий
    //custom_settings - настрйоки которые будт переданы в кастомные события созданые пользователем такие как swipe
    off: function(event, callback, custom_settings = {}, elements = this) {
        let events = bf.string_to_array(event); //преобрзуем строковый список в масив

        for (let i = 0; i < elements.length; i++) {
            for (let b = 0; b < events.length; b++) {

                //если событие кастомное
                if (ksn_custom_events.hasOwnProperty(events[b])) {
                    ksn_custom_events[events[b]](elements[i], custom_settings, false) //запускаем соответствующую функцию для регистрации данного события
                }
                //если событие кастомное

                elements[i].removeEventListener(events[b], callback);
            }
        }
    },
    //удаляем слушатель события

    //удаляем атрибут
    //attributs - идин или несколько атрибутов которые нужно удалить разделённые прбелами
    //elements - один или более элементов атрибуты attributs в которых нужно удалить
    //++
    removeAttr: function(attributs, elements = this) {
        attributs = bf.string_to_array(attributs); //преобрзуем строковый список в массив

        //перебираем атрибуты для удаления
        for (let b = 0; b < attributs.length; b++) {
            //перебираем все элементы у которых нужно удалить атрибуты
            for (let i = 0; i < elements.length; i++) {
                elements[i].removeAttribute(attributs[b]); //удаляем указаннй трибут у текущего итерируемого элемента
            }
            //перебираем все элементы у которых нужно удалить атрибуты
        }
        //перебираем атрибуты для удаления

        return this; //возвращаем объект this
    },
    //удаляем атрибут

    //дополняем или перезаписываем значение атрибута
    //attribut - один атирибут занчение которого нужно получить или изменить
    //value - значение которое нужно задать атрибуту
    //type - тип операции с атрибутом: "reset" - перезапишет значение атрибута, "inset" - добавит value к текущему значению атрибута
    //elements - элементы к которым нужно применить данный метод
    //++
    attr: function(attribut, value = null, type = "reset", elements = this) {
        //если занчение для атрибута не указано то просто возвращаем текущее значение атрибута в виде строки
        if (value === null) {
            return elements[0].getAttribute(attribut); //возвращаем значение атрибута элемента, или первого из объекта с элементами
        }
        //если занчение для атрибута не указано то просто возвращаем текущее значение атрибута в виде строки   

        //перебираем все элементы у которых нжно произвести операции с атрибутами
        for (let i = 0; i < elements.length; i++) {

            //перезапись атрибута со значением
            if (type === "reset") {
                elements[i].setAttribute(attribut, value);
            }

            //дополняем заначение атрибута
            if (type === "inset") {
                let attr_data = elements[i].getAttribute(attribut); //текущее значение атрибута
                attr_data ? elements[i].setAttribute(attribut, attr_data + " " + value) : elements[i].setAttribute(attribut, value); //если у атрибута уже было какое-то начение то объединяем их если не было то просто записываем новое чтоб избежать "null value"
            }
            //дополняем заначение атрибута
        }
        //перебираем все элементы у которых нжно произвести операции с атрибутами

        return this; //возвращаем объект this
    },

    //добавляем классы class_name ко всем элементам elements
    //class_name - перечень классов разделённых пробелами
    //++
    addClass: function(class_name = null, elements = this) {
        if (class_name === null) { return this; } //если не преданы именна классов завершаем функцию
        let classes = bf.string_to_array(class_name); //преобрзуем строковый список в масив

        //перебираем все классы на добавление
        for (let i = 0; i < classes.length; i++) {
            //перебираем все элементы к которым нужно добавить классы
            for (let b = 0; b < elements.length; b++) {
                elements[b].classList.add(classes[i]) //если данного класса у элемента нет, то добавим его
            }
            //перебираем все элементы к которым нужно добавить классы
        }
        //перебираем все классы на добавление

        return this; //возвращаем объект this 
    },
    //добавляем классы class_name ко всем элементам elements

    //удаляем классы class_name у всех элемнтов elements
    //class_name - перечень классов разделённых пробелами
    //++
    removeClass: function(class_name = null, elements = this) {
        if (class_name === null) { return this; } //если не преданы именна классов завершаем функцию
        let classes = bf.string_to_array(class_name); //преобрзуем строковый список в масив

        //перебираем все классы не удаление
        for (let i = 0; i < classes.length; i++) {
            //перебираем все элементы классы в которых нужно удалить
            for (let b = 0; b < elements.length; b++) {
                elements[b].classList.remove(classes[i]); //если у элемента есть данный клас удаляем его
            }
            //перебираем все элементы классы в которых нужно удалить
        }
        //перебираем все классы не удаление

        return this; //возвращаем объект this 
    },
    //удаляем классы class_name у всех элемнтов elements

    //проверяет наличее классов у элементов elements, если хоть у одного элемента найдены все классы удовлетворяющие классам class_name значения то вернёт true
    //class_name - перечень классов разделённых пробелами
    //++
    hasClass: function(class_name = null, elements = this) {
        if (class_name === null) { return false; } //если не преданы именна классов завершаем функцию
        let classes = bf.string_to_array(class_name); //преобрзуем строковый список в масив

        //перебираем все элементы классы в которых нужно проверить на наличие
        for (let b = 0; b < elements.length; b++) {
            let temp_result; //тут будет запитываться и перезаписываться наличие каждого класса у текущего элемента
            //перебираем все классы на проверку
            for (let i = 0; i < classes.length; i++) {
                //проверяет имеет ли текущий итерируемый элемент текущий проверяемый класс
                if (elements[b].classList.contains(classes[i])) {
                    temp_result = true; //если текущий проверяемый класс найден у текущего проверяемого элемента помечаем во временном результате обнаружение класса
                } else {
                    temp_result = false; //если текущий проверяемый класс НЕ найден у текущего проверяемого элемент помечам во временном результате неудачу
                    break; //прекращаем дальнейший перебор классов, т.к. как киминимум один из классов у данного элемента не найден и можно переходить к проверке следующего элемента
                }
                //проверяет имеет ли текущий итерируемый элемент текущий проверяемый класс
            }
            //перебираем все классы на проверку

            //если temp_result будет true значит все классы из списка class_name были обнаружены в каком-то элементе и можно вернуть ответ true, который обозначит что мы найшли как минимум один элемент в котором есть все классы из списка class_name
            if (temp_result) {
                return true; //возвращаем ответ что нашли такой элемент
            }
            //если temp_result будет true значит все классы из списка class_name были обнаружены в каком-то элементе и можно вернуть ответ true, который обозначит что мы найшли как минимум один элемент в котором есть все классы из списка class_name
        }
        //перебираем все элементы классы в которых нужно проверить на наличие

        return false; //если функция дошла до этого момента и не завершилась ранее то значит не нашлось элементов в которых бы присустствовали сразу все классы из class_name и мы возвращаем false
    },
    //проверяет наличее классов у элементов elements, если хоть у одного элемента найдены все классы удовлетворяющие классам class_name значения то вернёт true

    //добавляет или удаляет класс в зависимости отр того есть он у элемента или нет
    //class_name - перечень классов разделённых пробелами
    //++
    toggleClass: function(class_name = null, elements = this) {
        if (class_name === null) { return this; } //если не преданы именна классов завершаем функцию
        let classes = bf.string_to_array(class_name); //преобрзуем строковый список в масив

        //перебираем все классы для переключения (добавить/удалить)
        for (let i = 0; i < classes.length; i++) {
            //перебираем все элементы для смены классов
            for (let b = 0; b < elements.length; b++) {
                elements[b].classList.toggle(classes[i]); //добавляем или удаляем класс у элемента в завистимости от того есть он у него или нет
                //нет класса - добавляем; есть каласс - удаляем;
            }
            //перебираем все элементы для смены классов
        }
        //перебираем все классы для переключения (добавить/удалить)

        return this; //возвращаем объект this 
    },
    //добавляет или удаляет класс в зависимости отр того есть он у элемента или нет

    //фокусируется на первом элементе из набора elements и при наличии callback после фокусировки вызывает функцию callback
    //callback - функция которая будет вызвана после получения фокуса элементом
    //prevent_scrolling - предотвращать прокрутку к элементу или нет при фокусировке, по умолчанию false, т.е. будет прокручиваться к элементу на котором установлен фокус
    //++
    focus: function(callback = null, prevent_scrolling = false, elements = this) {
        elements[0].focus({ preventScroll: prevent_scrolling }); //фокусируемся на элементе
        if (callback) { callback.call(this); } //если указан callback функция вызываем её передав в неё в качестве this текущий this
        return this; //возвращаем объект this 
    },
    //фокусируется на первом элементе из набора elements и при наличии callback после фокусировки вызывает функцию callback

    //убирает фокус с первого элемента в наборе elements и при наличии callback после потери фокуса вызывает функцию callback
    //callback - функция которая будет вызвана после получения фокуса элементом
    //++
    blur: function(callback = null, elements = this) {
        elements[0].blur(); //снимаем фокус с первого элемента в наборе elements
        if (callback) { callback.call(this); } //если указан callback функция вызываем её передав в неё в качестве this текущий this
        return this; //возвращаем объект this 
    },
    //убирает фокус с первого элемента в наборе elements и при наличии callback после потери фокуса вызывает функцию callback

    //ширина самого элемента без учёта margin border padding
    //value - значение которое нужно задать
    width: function(value = null, elements = this) {
        let result = bf.win_doc_wh(elements[0], "Width", "width"); //проверям если это window или document

        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = bf.getWidthOrHeight(elements[0], "width"); //получам объект с ширинами составных частей элемента таких как padding, margin и border

        //если передано значение для установки ширины
        if (value) {
            elements[0].style.width = value + data.padding + data.border + "px"; //браузер записывает в width сумму значений ширины элемента его padding и border, так чтоб всё совпало добавляем к нужному занчению value ширину padding и border этого элемента
            return this; //возвращаем объект this 
        }
        //если передано значение для установки ширины

        return data.width; //ширина самого элемента без всего лишнего

    },

    //ширина элемента и padding без учёта margin border
    //value - значение которое нужно задать
    innerWidth: function(value = null, elements = this) {

        let result = bf.win_doc_wh(elements[0], "Width", "innerWidth"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = bf.getWidthOrHeight(elements[0], "width"); //получам объект с ширинами составных частей элемента таких как padding, margin и border

        //если передано значение для установки ширины
        if (value) {
            elements[0].style.width = value + data.border + "px"; //браузер записывает в width сумму значений ширины элемента его padding и border, так что записываем в css width значение value плюс ширина border
            return this; //возвращаем объект this 
        }
        //если передано значение для установки ширины

        return data.width + data.padding; //ширина элемента и его padding
    },

    //ширина элемента, padding и border без учёта margin, если mrg = true то будет учитываться и margin
    //value - значение которое нужно задать
    //mrg - учитывать margin или нет
    outerWidth: function(value = null, mrg = false, elements = this) {

        let result = bf.win_doc_wh(elements[0], "Width", "outerWidth"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = bf.getWidthOrHeight(elements[0], "width"); //получам объект с ширинами составных частей элемента таких как padding, margin и border

        //если передано значение для установки ширины
        if (value) {
            elements[0].style.width = mrg ? value - data.margin + "px" : value + "px"; //браузер записывает в width сумму значений ширины элемента его padding и border. В зависимости от того нужно ли учитывать ширину margin записываем в ширину элемента value или value + margin
            return this; //возвращаем объект this 
        }
        //если передано значение для установки ширины

        return mrg ? data.width + data.padding + data.border + data.margin : data.width + data.padding + data.border; //в зависимости от того нужно ли учитывать margin возвращаем ширину элемента с его padding и border и при необходимости c margin
    },

    //высота самого элемента без учёта margin border padding
    //value - значение которое нужно задать
    height: function(value = null, elements = this) {
        let result = bf.win_doc_wh(elements[0], "Height", "height"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = bf.getWidthOrHeight(elements[0], "height"); //получам объект с высотой составных частей элемента таких как padding, margin и border

        //если передано значение для установки высоты
        if (value) {
            elements[0].style.height = value + data.padding + data.border + "px"; //браузер записывает в height сумму значений высот элемента его padding и border, так чтоб всё совпало добавляем к нужному занчению value высот padding и border этого элемента
            return this; //возвращаем объект this 
        }
        //если передано значение для установки высоты

        return data.height; //высота самого элемента без всего лишнего
    },

    //высота элемента и padding без учёта margin border
    //value - значение которое нужно задать
    innerHeight: function(value = null, elements = this) {
        let result = bf.win_doc_wh(elements[0], "Height", "innerHeight"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = bf.getWidthOrHeight(elements[0], "height"); //получам объект с высотой составных частей элемента таких как padding, margin и border

        //если передано значение для установки высоты
        if (value) {
            elements[0].style.height = value + data.border + "px"; //браузер записывает в height сумму значений высот элемента его padding и border, так что записываем в css height значение value плюс высоту border
            return this; //возвращаем объект this 
        }
        //если передано значение для установки высоты

        return data.height + data.padding; //высота элемента и его padding
    },

    //высота элемента, padding и border без учёта margin, если mrg = true то будет учитываться и margin
    //value - значение которое нужно задать
    //mrg - учитывать margin или нет
    outerHeight: function(value = null, mrg = false, elements = this) {

        let result = bf.win_doc_wh(elements[0], "Height", "outerHeight"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = bf.getWidthOrHeight(elements[0], "height"); //получам объект с высотой составных частей элемента таких как padding, margin и border

        //если передано значение для установки высоты
        if (value) {
            elements[0].style.height = mrg ? value - data.margin + "px" : value + "px"; //браузер записывает в height сумму значений высот элемента его padding и border. В зависимости от того нужно ли учитывать высоту margin записываем в высоту элемента value или value + margin
            return this; //возвращаем объект this 
        }
        //если передано значение для установки высоты

        return mrg ? data.height + data.padding + data.border + data.margin : data.height + data.padding + data.border; //в зависимости от того нужно ли учитывать margin возвращаем высоту элемента с его padding и border и при необходимости c margin
    },

    //добавляем стили элементам
    //styles название стиля занчение которого нужно получитть или если задано value то установить этим значением, или styles это может быть объект с формате {"стиль1":"значение", "стиль2":"значение"}
    //value - значение для стиля в styles
    //++
    css: function(styles, value = null, elements = this) {
        //переводим css название свойства в камелкейс формат
        //style_name - обычное название свойства css  к примеру border-radius
        let camal_case_css_property = function(style_name) {
                let css_property = style_name[0] === "-" ? style_name.slice(1) : style_name, //проверяем наличие префикса webkit и прочих и удаляем - в начале -webkit-border-radius или border-radius
                    arr_css_property = css_property.split("-"), //возвращаем массив ["border", "radius"]
                    property = arr_css_property[0]; //конечное имя свойства css для поиска в getComputedStyle "border"

                //если в названии свойства больше одного слова
                if (arr_css_property.length > 1) {
                    for (let i = 1; i < arr_css_property.length; i++) {
                        property = property + arr_css_property[i][0].toUpperCase() + arr_css_property[i].slice(1); //ставим первую букву слова в верхний регистр и то что получилось добавляем в конец имени свойства property  webkitBorderRadius borderRadius
                    }
                }
                //если в названии свойства больше одного слова
                return property; //возвращаем название css свойства в нужном виде webkitBorderRadius borderRadius
            },
            //переводим css название свойства в камелкейс формат

            //задам стиль style элементам elements со значением value
            set_style = function(style, value) {
                let property = camal_case_css_property(style); //получем название css свйства в нужном формате
                //переберам все элементы которым нужно задать стили
                for (let i = 0; i < elements.length; i++) {
                    elements[i].style[property] = value; //задаём элементу elements[i] css свойство property со значением value
                }
                //переберам все элементы которым нужно задать стили
            },
            //задам стиль style элементам elements со значением value

            //получаем стиль style у первого элемента в наборе elements
            get_style = function(style) {
                let property = camal_case_css_property(style); //получем название css свйства в нужном формате
                return window.getComputedStyle(elements[0])[property]; //возвращаем значение css property
            };
        //получаем стиль style у первого элемента в наборе elements

        //передан объект со стилями которые нужно установить для элементов
        if (typeof styles === "object") {
            //переберам все стили в объекте styles и применяем их к элементам
            for (let key in styles) {
                set_style(key, styles[key]);
            }
            //переберам все стили в объекте styles и применяем их к элементам
        }
        //передан объект со стилями которые нужно установить для элементов

        //передан один стиль для установки элементам
        else {
            //если не передано значение для стиля то просто получем его значение у элемента
            if (value === null) {
                return get_style(styles); //возвращаем полученное значение css свйства styles
            }
            //если не передано значение для стиля то просто получем его значение у элемента

            //если передано значение для установки значения стиля
            else {
                set_style(styles, value); //задаём стилю новое значение
            }
            //если передано значение для установки значения стиля
            //console.log(window.getComputedStyle(elements[0]))
        }
        //передан один стиль для установки элементам

        return this; //возвращаем объект
    },
    //добавляем стили элементам

    //возвращает элементы лежащие на одном уровне с elements и фильтруются по селектору selector, если selector будет null то венёт всех соседей
    //selector - селекторы по которым будет фильтроваться итоговоый результат соседних элементов, пример "nav" или "nav, .header_burger_button, .header_phone_mobile"
    //result = [] сюда будут записаны все соседи удовлетворяющие текущим условиям
    //++
    siblings: function(selector = null, elements = this, result = []) {
        //для каждого элемента в elements ищем соседей
        for (let i = 0; i < elements.length; i++) {
            let temp_arr = [], //тут будут хранится временные данные для одной итерации
                parent = elements[i].parentNode; //родитель текущего итерируемого элемента
            temp_arr = bf.return_skleniy_arr(temp_arr, parent.children); //записываем во временный массив всех соседей текущего итерируемого элемента включая его самого

            //если задан селектор для фильтрации соседей на выходе
            if (selector) {
                let all_children_element = bf.return_selectors_arr(selector, parent); //все потомки родителя текущего итерируемого элемента
                temp_arr = bf.return_clone_elements_arr(all_children_element, temp_arr); //получем элементы которые находятся во временном массиве и удовлетворяют селекторам
            }
            //если задан селектор для фильтрации соседей на выходе

            temp_arr = bf.return_cleaned_of_values([elements[i]], temp_arr); //удаляем из временного объекта сам итерируемый этемент, так как мы ищем его сосдей, а не его самого

            result = bf.return_skleniy_arr(result, temp_arr); //записываем в конечный результирующий объект данные из временно объекта текущей итерации
        };
        //для каждого элемента в elements ищем соседей

        return this.construct_new_ksn(result); //возвращаем всех найденых соседей если selector = null, или только те которые совпали с элементами объекта filter_elements
    },
    //возвращает элементы лежащие на одном уровне с elements и фильтруются по селектору selector, если selector будет null то венёт всех соседей

    //возвращает прямых потомков элеметов elements, фильтруемых по селектору selector
    //если selector = null то вернёт всех прямых потомков элементов elements
    //отличается от find тем что ищет только на один уровень вниз элементов elements
    //result = [] сюда будут записаны все прямые потомки удовлетворяющие текущим условиям
    //++
    children: function(selector = null, elements = this, result = []) {
        //для каждого элемента в elements ищем прямых потомков
        for (let i = 0; i < elements.length; i++) {
            //если заданы селекторы по которому фильтровать прямых потомков
            if (selector) {
                let childrens = elements[i].children, //все прямые потомки текущего элемента
                    all_elements = bf.return_selectors_arr(selector, elements[i]), //находим все элементы в текущем элементе которые удовлетворяют селекторам
                    filter_elements = bf.return_clone_elements_arr(all_elements, childrens); //находим элементы которые находятся и в прямых потомках текущего элемента и удовлетворяют селекторам
                result = bf.return_skleniy_arr(result, filter_elements); //записываем элементы в результат
            }
            //если заданы селекторы по которому фильтровать прямых потомков

            //фильтр прямых потомков не задан
            else {
                result = bf.return_skleniy_arr(result, elements[i].children); //записываем в результат всех прямых потомков каждого элемента
            }
            //фильтр прямых потомков не задан
        };
        //для каждого элемента в elements ищем прямых потомков

        return this.construct_new_ksn(result); //в завистимости от того установлен фильтр в виде селектора или нет возвращаем объект с отфильтрованными элементами полученнным вледствии нахождения одинаковых элементов в result и filter_elements или же просто всех найденых прямых потомков в видео объекта , если selector не был установлен
    },
    //возвращает прямых потомков элеметов elements, фильтруемых по селектору selector

    //производим поиск по DOM древу каждого элемента в elements для поиска удовлетворяющих selector елементов, если selector = "*" то верёнт всех потомков элементов elements
    //result = [] сюда будут записаны все потомки удовлетворяющие текущим условиям
    //++
    find: function(selector, elements = this, result = []) {
        if (!selector) { return this.construct_new_ksn() } //если селектор не задан вернём пустой объект

        //перебираем все элементы elements потомков которых нужно найти
        for (let i = 0; i < elements.length; i++) {
            let all_children = bf.return_selectors_arr(selector, elements[i]); //получаем всех потомков текущего итерируемого элемента
            result = bf.return_skleniy_arr(result, all_children); //записываем в результирующий массив всех найденых и соответствующих селекторам потомков
        }
        //перебираем все элементы elements потомков которых нужно найти

        return this.construct_new_ksn(result); //возвращаем функцию для пересоздания объекта this чтоб вернуть его в новом виде
    },
    //производим поиск по DOM древу каждого элемента в elements для поиска удовлетворяющих selector елементов, если selector = "*" то верёнт всех потомков элементов elements

    //возвращает прямого родителя каждого elements, если задан selector то результат будет проверяется и на соотвествие ему
    //result = [] - сюда будут записаны все прямые родители элементов удовлетворяющих селекторам
    //++
    parent: function(selector = null, elements = this, result = []) {
        //перебираем все элементы elements
        for (let i = 0; i < elements.length; i++) {
            result.push(elements[i].parentNode); //записываем в массив result родителей каждого элемента elements
        }
        //перебираем все элементы elements

        //если задан селектор для отбора
        if (selector) {
            let all_selectors = bf.return_selectors_arr(selector), //массив со всеми элементами удовлетворяющими селектор selector
                filter_result = bf.return_clone_elements_arr(result, all_selectors); //получаем массив в который будут записаны одинаковые занчения найденные в массивах result и all_selectors
            return this.construct_new_ksn(filter_result); //возвращаем объект с отфильтрованными родительскими элементами
        }
        //если задан селектор для отбора

        return this.construct_new_ksn(result); //возвращаем объект с родительскими элементами
    },
    //возвращает прямого родителя каждого elements, если задан selector то результат будет проверяется и на соотвествие ему

    //возвращает всех родителей элементов elements, удовлетворяющих selector
    //result = [] - сюда записываем всех родителей элементов удовлетворяющих селекторам
    //++
    parents: function(selector = null, elements = this, result = []) {
        //перебираем все элементы elements
        for (let i = 0; i < elements.length; i++) {
            let el = elements[i]; //текущий итерируемый элемент родетелей которого мы ищем

            //цикл while будет выпоолняться пока мы не доберёмся до родительского элемента document
            while (el.parentNode.nodeType !== 9) {
                result.push(el.parentNode); //записываем в массив result каждого родитетя по очереди
                el = el.parentNode; //присваеваем текущему итерируемому элементу el его родителя чтоб обеспечить подъём вверх по DOM дереву элементов
            }
            //цикл while будет выпоолняться пока мы не доберёмся до родительского элемента document
            result = bf.return_no_clone_arr(result); //чистим результирующий массив от повторяющихся элементов
        }
        //перебираем все элементы elements

        //если задан селектор для отбора
        if (selector) {
            return this.construct_new_ksn(bf.return_clone_elements_arr(result, bf.return_selectors_arr(selector))); //возвращаем объект с отфильтрованными родительскими элементами по селекторам
        }
        //если задан селектор для отбора

        return this.construct_new_ksn(result); //возвращаем объект с родительскими элементами
    },
    //возвращает всех родителей элементов elements, удовлетворяющих selector

    //возвращает объект с элементом соответствующим индексу index в объекте elements
    //index = -1 выдаст последний элемент в наборе
    //++
    eq: function(index, elements = this) {
        let i = index === -1 ? elements.length - 1 : index,
            el = elements[i]; //получаем элемент массива по индексу i, если не нашли то получим undefined

        //если нашли
        if (el) {
            return this.construct_new_ksn([el].slice()) //возвращаем объект сформированный на основе массиа созданного с единственным элементом el
        }
        //если нашли

        //если не нашли
        else {
            return this.construct_new_ksn(); //возвращаем объект сформированный на основе пустого объекта
        }
        //если не нашли
    },
    //возвращает объект с элементом соответствующим индексу index в объекте elements

    //возвращает первый элемент в объекте elements
    //++
    first: function(elements = this) {
        return this.eq(0);
    },
    //возвращает первый элемент в объекте elements

    //возвращает последний элемент в объекте elements
    //++
    last: function(elements = this) {
        return this.eq(-1);
    },
    //возвращает последний элемент в объекте elements

    //анимирует элементы
    //styles - объект со стилями и значениями которые нужно анимировать {"margin-bottom": "-=20%","width": "+=20px","margin-top": "100px","opacity": "0.1"}
    //duration - лительность анимации в милисекундах
    //timing - указывает как с течением времени будет меняться анимация или функцией или названием уже готовой функции
    //callback - будет вызвана по завершении анимации
    animate: function(styles, duration = 400, timing = "linear", callback = null) {
        let timing_algoritm_chenge, //сюда будет сохранена функция котороя будет определять текущее состояние анимации с течением времени
            //список название временных функций с их конструкторами
            timing_fu_list = {
                "linear": function(remaning_time) {
                    return remaning_time;
                },
                "ease-in": function(remaning_time) {
                    return Math.pow(remaning_time, 2)
                },
                "slow-to-fast": function(remaning_time) {
                    return 1 - Math.sin(Math.acos(remaning_time));
                },
                "bow-shot": function(remaning_time, x = 1.5) {
                    return Math.pow(remaning_time, 2) * ((x + 1) * remaning_time - x)
                },
                "dropped-ball": function(remaning_time, x = 1.5) {
                    return Math.pow(2, 10 * (remaning_time - 1)) * Math.cos(20 * Math.PI * x / 3 * remaning_time)
                }
            };
        //список название временных функций с их конструкторами

        //находим из списка нжный нам конструктор временнйо функции
        for (let func_name in timing_fu_list) {
            if (func_name === timing) timing_algoritm_chenge = timing_fu_list[func_name];
        }
        //находим из списка нжный нам конструктор временнйо функции

        if (typeof timing === "function") timing_algoritm_chenge = timing; //если в качестве аргумента timing передана функция то используем её для расчёта текущего состояния анимации

        //перебираем все элементы которые нужно анимировать
        this.each(function() {
            let el = $(this), //текущий элемент к которому будет применена анимация
                data_styles = [],
                rendering_default = function(progress) {

                    //перебираем все css стили из объекта styles
                    data_styles.forEach((data_item) => {
                        let sdvig = data_item.start_value + (data_item.shift_value * progress); //текущее изменение значения
                        el.css(data_item.property, sdvig + data_item.units); //задаём элементу обновлённое значение текущего css свойства
                    })
                    //перебираем все css стили из объекта styles
                },
                start_time = performance.now(); //записываем время начала анимации, в качестве точки отсчёта будем брать время прошедшее с момента создания данного документа

            //перебираем все css стили из объекта styles и записываем для каждого данные в data_styles объект
            for (let property in styles) {

                let start_value = Number(el.css(property).replace("px", "")), //числовое занчение свойства в начльный момент времени
                    finall_value = Number(styles[property].replace(/^(\+|-)=|px|%/g, "")), //числовое занчение свойства до которого нужно анимировать
                    units = styles[property].includes("px") ? "px" : (styles[property].includes("%") ? "%" : null), //единицы измерения которые переданы для значения css свойства px или %
                    increase = styles[property].includes("+=") ? true : false, //если задано увеличить исходное занчение свойство на данную величину
                    decrease = styles[property].includes("-=") ? true : false; //если задано уменьшить исходное занчение свойство на данную величину

                //если значение указанов  процентах
                if (units === "%") {
                    //свойства исключения процентные значение которых беррутся у родителя от других свойств
                    let exceptions = {
                            "margin": "width",
                            "margin-top": "width",
                            "margin-right": "width",
                            "margin-bottom": "width",
                            "margin-left": "width",
                            "padding": "width",
                            "padding-top": "width",
                            "padding-right": "width",
                            "padding-bottom": "width",
                            "padding-left": "width",
                            "line-height": "font-size",
                        },
                        //свойства исключения процентные значение которых беррутся у родителя от других свойств

                        parent_prop_value = exceptions.hasOwnProperty(property) ? Number(el.parent().css(exceptions[property]).replace("px", "")) : Number(el.parent().css(property).replace("px", "")); //получаем значение этого свойства у родтельского элемента

                    finall_value = (parent_prop_value * finall_value) / 100; //конечное значение свойства
                    units = "px"; //меняем единицы измерения на пиксели
                }
                //если значение указанов  процентах

                //если задано увеличить исходное занчение свойство на данную величину
                if (increase) {
                    finall_value = start_value + finall_value;
                }
                //если задано увеличить исходное занчение свойство на данную величину

                //если задано уменьшить исходное занчение свойство на данную величину
                if (decrease) {
                    finall_value = start_value - finall_value;
                }
                //если задано уменьшить исходное занчение свойство на данную величину

                let shift_value = finall_value - start_value, //числовое занчение на сколько по итогу нужно изменить свойство элемента
                    data = {
                        "property": property, //название css свойства
                        "start_value": start_value, //числовое занчение свойства в начльный момент времени
                        "finall_value": finall_value, //числовое занчение свойства в конце анимации
                        "shift_value": shift_value, //числовое занчение на сколько по итогу нужно изменить свойство элемента
                        "units": units, //единицы измерения
                        "increase": increase,
                        "decrease": decrease
                    };

                data_styles.push(data); //записываем в конец массива data_styles
            }
            //перебираем все css стили из объекта styles и записываем для каждого данные в data_styles объект

            let start = Number(el.css("width").replace("px", ""));

            //начинаем перерисовку элемента по заданному функцией алгоритму rendering_fu
            requestAnimationFrame(function animate(time) {
                let past_time = (time - start_time) / duration; //получаем значение пройденного времени с начала анимации с учётом её длительности, значение начинается с 0 - начало анимации, и заканчивается 1 - конец анимации. т.е. если прошла треть анимации past_time = 0,3333, если вдруг значение получилось меньше нуля то делаем его нулём
                //загоняем past_time в пределы от 0 до 1
                if (past_time < 0) past_time = 0;
                if (past_time > 1) past_time = 1;
                //загоняем past_time в пределы от 0 до 1

                let progress = timing_algoritm_chenge(past_time); // вычисляем текущее состояние анимации в зависимости от пройденного времени

                rendering_default(progress); //трисовываем анимацию в зависимости от текущего прогресса

                if (past_time !== 1) {
                    requestAnimationFrame(animate); //запускаем отрисовку этой анимации о тех пор пока условное время past_time пройденное с начала анимаци не станет равным 1, т.е. до тех пор пока анимация не закончится
                } else {
                    if (callback) callback(); //если занан колбек в конце анимации запускаем его
                }

            });
            //начинаем перерисовку элемента по заданному функцией алгоритму rendering_fu
        });
        //перебираем все элементы которые нужно анимировать

        return this; //возвращаем исходный объект с набором элементов для анимирования
    },
    //анимирует элементы
}
//объект с основными функциями

window.$ = ksn; //делаем вызов функции ksn через $

//после вызова функции ksn.noConflict() ksn библеотека будет доступна только через вызов ksn
ksn.noConflict = function() {
    if (window.$ === ksn) {
        window.$ = undefined;
    }
}
//после вызова функции ksn.noConflict() ksn библеотека будет доступна только через вызов ksn



//ПРИМЕЧАНИЕ: данные функции позволят сравнивать по скорости разные функции или процессы
/*let kol = 10000;

function ksn_spead_test() {
    let time_start = new Date().getTime();
    for (let i = 0; i < kol; i++) {
        //$("#idishnik")
        //$("#idishnik").addClass("test")
        //$("#idishnik").hasClass("test")
        //$("a.test_wf.data_2_tess#idishnik.thri_cl")
        //$()
        //$().each(["241","efewf", "effg"],test_f);
        $("header").find("div").parents("div").children("div").siblings("nav, a, div.top_banner, .header_cart")
    }
    let time_finish = new Date().getTime(),
        result = (time_finish - time_start) / 1000;
    console.log(result + " сек")
}

function jQuery_spead_test() {
    let time_start = new Date().getTime();
    for (let i = 0; i < kol; i++) {
        //jQuery("#idishnik")
        //jQuery("#idishnik").addClass("test")
        //jQuery("#idishnik").hasClass("test")
        //jQuery("a.test_wf.data_2_tess#idishnik.thri_cl")
        //jQuery()
        //jQuery.each(["241","efewf", "effg"],test_f);
        jQuery("header").find("div").parents("div").children("div").siblings("nav, a, div.top_banner, .header_cart")
    }
    let time_finish = new Date().getTime(),
        result = (time_finish - time_start) / 1000;
    console.log(result + " сек")
}*/
//ksn_spead_test()
//jQuery_spead_test()