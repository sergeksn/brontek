"use strict"; //используем современный режим

//ПРИМЕЧАНИЕ: скорость работы моей библиотеки в общем выше чем у jQuery, для примера данная операция в 100000 (сто тысяч) повторений
//$("header").find("div").parents("div").children("div").siblings("nav, a, div.top_banner, .header_cart")
//на ksn заняла 24.3 сек
//на jQuery заняла 35.053 сек
//что на 30% быстрее

if (typeof window.jQuery !== "undefined") { jQuery.noConflict(); } //на всякий случай если вдруг подключена jQuery, чтоб не конфликтовали

//объект с основными функциями

//базовые функции для работы
//bf - base functions
let bf = {
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
        //secure: true //куки будут переданы толкьо по HTTPS протоколу
    }) {

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
}
//базовые функции для работы

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
    on: function(event, callback, options_event = { passive: true }, elements = this) {
        let events = bf.string_to_array(event); //преобрзуем строковый список в масив

        for (let i = 0; i < elements.length; i++) {
            for (let b = 0; b < events.length; b++) {
                elements[i].addEventListener(events[b], callback, options_event);
            }
        }
    },
    //добавляем слушатель события

    //удаляем слушатель события
    //event - строка событий которые нужно отключить от прослушивания для элемента, пример: "touchend click resize"
    //callback - функция которая должна быть отключена для данных слушателей событий
    off: function(event, callback, elements = this) {
        let events = bf.string_to_array(event); //преобрзуем строковый список в масив

        for (let i = 0; i < elements.length; i++) {
            for (let b = 0; b < events.length; b++) {
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
    //properties - стили css которые нужно анимировать в формате {style:value, style_2,value_2}
    //duration - длительность в милисекундах которую будет длится анимация 400 = 0.4s
    //timing_function - как будет протекать анимация, значение дяля transition-timing-function
    //callback - функция которая будет вызвана для кажого элемента на котором была применена анимация после её завершеения в качестве параметра this для функции будет передан DOM елемент к которому применялась анимация
    animate: function(properties = null, duration = 400, timing_function = "ease-out", callback = null) {
        if (properties === null) return this;

        let transition_style_fo_write = ""; //будет содеражть стили transition для записи

        for (let style in properties) { transition_style_fo_write += "" + style + " " + duration / 1000 + "s " + timing_function + ","; } //получаем итоговый вид свойства transition

        //добавляем каждому элементу нужный transition если нужно составляем из нового и его уже имеющегося
        this.each(function() {
            let el = $(this),
                el_transition_style = el.css("transition");

            //если transition стоит по умолчанию
            if (el_transition_style === "all 0s ease 0s") {
                el.css("transition", transition_style_fo_write.slice(0, -1)); //удаляем запятую в конце
                return;
            }
            //если transition стоит по умолчанию

            //перебираем все css свойства чтоб удалить у исходного значения transition дулбирующиеся значения
            for (let style in properties) {
                if (!el_transition_style.includes(style)) { continue; } //если свойство transition не содержит текущее перебираемое название css свойства
                el_transition_style += ","; //добаляем ив конце запятую чтоб корректно работал поиск по регулярному выражению
                el_transition_style = el_transition_style.replace(new RegExp(style + " [^s]+s [^,]+,"), ""); //удаляем из начального свойства transition элемента те значения которые будут перезаписаны при анимировании
            }
            //перебираем все css свойства чтоб удалить у исходного значения transition дулбирующиеся значения

            el.css("transition", el_transition_style + transition_style_fo_write.slice(0, -1)); //задаёем свойство transition составленое из уже имеющегося значения у элемента с тем что нужно задать и убираем зарятую в конце
        });
        //добавляем каждому элементу нужный transition если нужно составляем из нового и его уже имеющегося

        //каждому элементу задаём стили для анимирования
        this.each(function() {
            let el = $(this);

            for (let style in properties) {
                el.css(style, properties[style]);
            }

            if (callback) { callback.call(this) } //если нужно вызываем функцию и передаём ей в качестве парметра this текущий DOM элемент к которому была применена анимация
        });
        //каждому элементу задаём стили для анимирования

        return this;
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