"use strict"; //используем современный режим

jQuery.noConflict();

//объект с основными функциями
const KSN_jQuery = {
    //фнкция возвращает новый объект внеся в него все элементы из elements и его длинну length используя в качестве своего прототипа KSN_jQuery объект
    output: function(elements = []) {
        let obj = Object.create(KSN_jQuery); //создаём объект obj с прототипом KSN_jQuery

        //если передан просто узел DOM его нужно преобразовать в итерируемый элемент
        if (elements.length === undefined) {
            elements = this.toArray([elements]); //преобразуем в массив
        }
        //если передан просто узел DOM его нужно преобразовать в итерируемый элемент

        //перебираем все элементы elements и записываем из по порядку в объект obj
        for (let i = 0; i < elements.length; i++) {
            obj[i] = elements[i];
        }

        obj.length = elements.length; //записываем в коне количество элементов объекта объекта length

        return obj; //возвращаем наш объект obj
    },

    //производит итерации над объектами и для каждого итирируемого элемента объекта вызиывает функцию callback
    //arg_1 - объект или функция
    //arg_2 - функция обратного вызова
    each: function(arg_1, arg_2) {
        let obj = typeof arg_1 === "function" ? this : arg_1, //если в arg_1 передана функция то obj будет this
            callback = typeof arg_1 === "function" ? arg_1 : arg_2; //если в arg_1 передана функция то callback будет arg_1

        obj = this.toArray(obj); //преобразуем в массив для итерации

        //перебираем массив с итерируемыми элементами
        for (let i = 0; i < obj.length; i++) {
            callback.call(this.output(obj[i]), i, obj[i]); //дял каждого итирируемого элемента вызываем функцию обратиного вызова в которую в качестве this передаём объект текущего итериремого элемента , а в качестве аргументов передаём индекс и значение в массиве соответственно
        }
        //перебираем массив с итерируемыми элементами

        return this.output(obj); //возвращаем объект
    },
    //производит итерации над объектами и для каждого итирируемого элемента объекта вызиывает функцию callback

    //возвращает объект состоящий из всех элементов найденых по селекстором через запятую, примечательно что будет использован оптимальный поиск по дереву DOM для каждого типа селектора
    //selectors - строка в виде селекторов, можно несколько перечисленных через запятую, к примеру: ".test, a.web, header, nav"
    //element_fo_search - элемент в котором будет производится поиск всех элементов по селектору


    //ВАЖНО: настрйоить чтоб корректно работало div.wfwf#ewfwef или #ewfgewg.wefgewgewg


    return_selectors_obj: function(selectors, element_fo_search = document) {
        let selectors_arr = selectors.split(","), //массив со списком селекторов
            result = []; //сюда будем записывать все элементы DOM найденые по соответствующим селекторам

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
                    result.push(element_fo_search.getElementById(selector))
                    //result = this.return_skleniy_arr(result, [element_fo_search.getElementById(selector)]);
                }
                //id

                //class
                else if (selector.includes(".")) {
                    result = this.return_skleniy_arr(result, element_fo_search.getElementsByClassName(selector));
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

        return this.output(result); //возвращаем новый объект со всеми элементами
    },
    //возвращает объект состоящий из всех элементов найденых по селекстором через запятую, примечательно что будет использован оптимальный поиск по дереву DOM для каждого типа селектора

    //преобразует строку в массив разделитель пробел
    string_to_array: function(string) {
        return string.split(" "); //возвращаем массив
    },

    //преобразуем массивоподобные объекты в массивы
    toArray: function(data) {
        return Array.from(data);
    },

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

        return clone_clean ? this.output(this.return_no_clone_arr(result)) : this.output(result); //удаляем повоторяющиеся элементы и возвращаем новый объект
    },
    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект в котором будут только те элементы которые встречаются в обоих массивах

    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект содержащий все элементы обеих массивов
    //clone_clean - если true то вернёт массив без одинаковых значений
    return_skleniy_arr: function(arr_1, arr_2, clone_clean = true) {
        let massiv_1 = Array.isArray(arr_1) ? arr_1 : this.toArray(arr_1), //если вдруг это не массив то преобразуем в массив
            massiv_2 = Array.isArray(arr_2) ? arr_2 : this.toArray(arr_2), //если вдруг это не массив то преобразуем в массив
            result = massiv_1.concat(massiv_2); //объединяем два массива с помощью встроенного метода массивов concat
        return clone_clean ? this.output(this.return_no_clone_arr(result)) : this.output(result);
    },
    //получает на вход два массива (массивоподобных объекта) и в результате возвращает объект содержащий все элементы обеих массивов

    //получает на вход массив (массивоподобный объект), после этого удаляет в нём одинаковые значения и возвращает результирующий объект с новой длинной
    return_no_clone_arr: function(arr = this) {
        //let result = this.toArray(new Set(arr));//здесь применяется метод set который возвращает только уникальные значения
        let massiv = Array.isArray(arr) ? arr : this.toArray(arr), //если вдруг это не массив то преобразуем в массив
            result = massiv.filter((item, index) => { return massiv.indexOf(item) === index }); //с помошью фильтрующего метода Array возвращаем массив в котором будт только элементы удовлетворяющие условию massiv.indexOf(item) === index, т.е. если будет повторяющееся значение его индекс будет равен не его индексу , а первому такому элементу в массиве, следовательно этот элемент повторно не будет включаться
        return this.output(result);
    },
    //получает на вход массив (массивоподобный объект), после этого удаляет в нём одинаковые значения и возвращает результирующий объект с новой длинной

    //очищает массив arr от значений values
    return_cleaned_of_values: function(values, arr = this) {
        let cleaned = Array.isArray(values) ? values : this.toArray(values), //если вдруг это не массив то преобразуем в массив
            massiv = Array.isArray(arr) ? arr : this.toArray(arr), //если вдруг это не массив то преобразуем в массив
            result = massiv.filter((item) => !cleaned.includes(item));
        //result = massiv.filter((item) => { return cleaned.indexOf(item) < 0 });тоже самое но с помощью метода indexOf
        return this.output(result);
    },
    //очищает массив arr от значений values

    //event - строка событий которые нужно прослушивать на элементе, пример: "touchend click resize focus blur"
    //callback - функция которую нужно вызвать при срабатывании события из строки event, можно указать название функции, пример: touch_menu_open_close ; или указать функцию, пример: function(){console.log("Выполняем что-то, при срабатывании события из массива event")}
    //options_event - сюда нужно передать объект с обциями для данного слушателя
    on: function(event, callback, options_event = { passive: true }, elements = this) {
        let events = this.string_to_array(event); //преобрзуем строковый список в масив

        for (let i = 0; i < elements.length; i++) {
            for (let b = 0; b < events.length; b++) {
                elements[i].addEventListener(events[b], callback, options_event);
            }
        }
    },

    //event - строка событий которые нужно отключить от прослушивания для элемента, пример: "touchend click resize"
    //callback - функция которая должна быть отключена для данных слушателей событий
    off: function(event, callback, elements = this) {
        let events = this.string_to_array(event); //преобрзуем строковый список в масив

        for (let i = 0; i < elements.length; i++) {
            for (let b = 0; b < events.length; b++) {
                elements[i].removeEventListener(events[b], callback);
            }
        }
    },

    //дополняем или перезаписываем значение атрибута
    //removeAttr("attribut") - заменено на attr("attribut", "")
    attr: function(attribut, value = null, type = "reset", elements = this) {
        //если занчение для отрибута не указано то просто возвращаем текущее значение атрибута в виде строки
        if (value === null) {
            return elements[0].getAttribute(attribut);
        }
        //если занчение для отрибута не указано то просто возвращаем текущее значение атрибута в виде строки   

        for (let i = 0; i < elements.length; i++) {

            //удаляем атрибут у всех переданных элементов в объекте
            if (value === "") {
                elements[i].removeAttribute(attribut);
                continue; //пропускаем и переходим к следующей итерации по циклу
            }

            //перезапись атрибута со значением
            if (type === "reset") {
                elements[i].setAttribute(attribut, value);
            }

            //дополняем заначение атрибута
            if (type === "inset") {
                let class_data = elements[i].getAttribute(attribut);
                elements[i].setAttribute(attribut, class_data + " " + value);
            }
        }

        return this; //возвращаем объект this
    },

    //удаляем атрибут
    removeAttr: function(attributs, elements = this) {
        let attrs = this.string_to_array(attributs); //преобрзуем строковый список в масив

        for (let b = 0; b < attrs.length; b++) {
            for (let i = 0; i < elements.length; i++) {
                elements[i].removeAttribute(attrs[b]);
            }
        }
        return this; //возвращаем объект this
    },

    //добавляем класс class_name ко всем элементам находящимся в this
    addClass: function(class_name, elements = this) {
        let classes = this.string_to_array(class_name); //преобрзуем строковый список в масив

        for (let i = 0; i < classes.length; i++) {
            this.attr("class", classes[i], "inset", elements); //добавляем значения к атрибуту класса
        }
        //перебираем все элменты в объекте this и добавляем к каждому клас 

        return this; //возвращаем объект this 
    },

    //удаляем класс у элемента
    removeClass: function(class_name, elements = this) {
        for (let i = 0; i < elements.length; i++) {
            let classes = this.string_to_array(class_name); //преобрзуем строковый список в масив

            for (let b = 0; b < classes.length; b++) {
                elements[i].classList.remove(classes[b]);
            }


            //если после удаления класса атрибут class остался пустым то мы удаляем его
            if (elements[i].classList.length === 0) {
                elements[i].removeAttribute("class");
            }
            //если после удаления класса атрибут class остался пустым то мы удаляем его
        }
        return this; //возвращаем объект this 
    },

    //проверяет насличее классов
    hasClass: function(class_name, elements = this) {
        let classes = this.string_to_array(class_name), //преобрзуем строковый список в масив
            result; //результат проверки

        for (let i = 0; i < classes.length; i++) {
            result = elements[0].classList.contains(classes[i]);
        }

        return result; //возвращаем ответ есть клас у элмента или нет в формате bool
    },

    //добавляет или удаляет класс в зависимости отр того есть он у элемента или нет
    toggleClass: function(class_name, elements = this) {
        let classes = this.string_to_array(class_name); //преобрзуем строковый список в масив

        //перебираем все элементы для смены классов
        for (let i = 0; i < elements.length; i++) {
            //перебираем все классы для проверки
            for (let b = 0; b < classes.length; b++) {
                if (this.hasClass(classes[b], [elements[i]])) { //если такой клас есть у элемента
                    this.removeClass(classes[b], [elements[i]]); //удаляем его
                } else {
                    this.addClass(classes[b], [elements[i]]); //если такого класса нет то добавляем его
                }
            }
        }

        return this; //возвращаем объект this 
    },

    //фокусируется на первом элементе из объекта elements
    focus: function(scrolling = false, elements = this) {
        elements[0].focus({ preventScroll: scrolling }); //вокусируемся на элементе
        return this; //возвращаем объект this 
    },

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

    //внутренняя функция для получения высот и ширин таких элементов как window и document
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


    //ширина самого элемента без учёта margin border padding
    //value - значение которое нужно задать
    width: function(value = null, elements = this) {

        let result = this.win_doc_wh(elements[0], "Width", "width"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = this.getWidthOrHeight(elements[0], "width"); //получам объект с ширинами составных частей элемента таких как padding, margin и border

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

        let result = this.win_doc_wh(elements[0], "Width", "innerWidth"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = this.getWidthOrHeight(elements[0], "width"); //получам объект с ширинами составных частей элемента таких как padding, margin и border

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

        let result = this.win_doc_wh(elements[0], "Width", "outerWidth"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = this.getWidthOrHeight(elements[0], "width"); //получам объект с ширинами составных частей элемента таких как padding, margin и border

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
        let result = this.win_doc_wh(elements[0], "Height", "height"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = this.getWidthOrHeight(elements[0], "height"); //получам объект с высотой составных частей элемента таких как padding, margin и border

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
        let result = this.win_doc_wh(elements[0], "Height", "innerHeight"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = this.getWidthOrHeight(elements[0], "height"); //получам объект с высотой составных частей элемента таких как padding, margin и border

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

        let result = this.win_doc_wh(elements[0], "Height", "outerHeight"); //проверям если это window или document
        if (result !== false) {
            return result; //возвращаем заначение если это window или document
        }

        let data = this.getWidthOrHeight(elements[0], "height"); //получам объект с высотой составных частей элемента таких как padding, margin и border

        //если передано значение для установки высоты
        if (value) {
            elements[0].style.height = mrg ? value - data.margin + "px" : value + "px"; //браузер записывает в height сумму значений высот элемента его padding и border. В зависимости от того нужно ли учитывать высоту margin записываем в высоту элемента value или value + margin
            return this; //возвращаем объект this 
        }
        //если передано значение для установки высоты

        return mrg ? data.height + data.padding + data.border + data.margin : data.height + data.padding + data.border; //в зависимости от того нужно ли учитывать margin возвращаем высоту элемента с его padding и border и при необходимости c margin
    },

    //добавляем стиле элементам
    //styles название стиля занчение которого нужно получитть или если задано value то установить этим значением, или styles это может быть объект с формате {"стиль1":"значение", "стиль2":"значение"}
    //value - значение для стиля в styles
    css: function(styles, value = null, elements = this) {
        //переводим css название свойства в камелкейс формат
        //style_name - обычное название свойства css  к примеру border-radius
        let camal_case_css_property = function(style_name) {
                let css_property = style_name[0] === "-" ? style_name.slice(1) : style_name, //проверяем наличие префикса webkit и прочих и удаляем - в начале
                    arr_css_property = css_property.split("-"), //возвращаем массив
                    property = arr_css_property[0]; //конечное имя свойства css для поиска в getComputedStyle

                //если в названии свойства ольше одного слова
                if (arr_css_property.length > 1) {
                    for (let i = 1; i < arr_css_property.length; i++) {
                        property = property + arr_css_property[i][0].toUpperCase() + arr_css_property[i].slice(1); //ставим первую буклва слова в верхний регистр и то что получилось добавляем в кнец имени свойства property
                    }
                }
                //если в названии свойства ольше одного слова
                return property; //возвращаем название css свойства в нужном виде
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
    //добавляем стиле элементам






    //возвращает элементы лежащие на одном уровне с elements и фильтруются по селектору selector, если selector будет null то венёт всех соседей
    //++
    siblings: function(selector = null, elements = this) {
        let result = [], //сюда будутзаписаны все соседи
            temp_arr = [], //тут будут хранится временные данные для одной итерации
            filter_elements = []; //тут будут записаны элементы для фильтрации конечного результата

        //для каждого элемента в elements ищем соседей
        elements.each(function() {
            let parent = this[0].parentNode; //родитель текущего итерируемого элемента
            temp_arr = this.return_skleniy_arr(temp_arr, parent.children); //записываем во временный массив всех соседей текущего итерируемого элемента включая его самого

            //если задан селектор для фильтрации соседей на выходе
            if (selector) {
                temp_arr = this.return_cleaned_of_values(this, temp_arr); //удаляем из временного объекта сам итерируемый этемент, так как мы ищем его сосдей, а не его самого
                filter_elements = this.return_skleniy_arr(filter_elements, this.return_selectors_obj(selector, parent)); //записываем в массив с элементами для фильтра все удовлетворяющие selector элементы найденные в его прямом родительском элементе
            }
            //если задан селектор для фильтрации соседей на выходе

            result = this.return_skleniy_arr(result, temp_arr); //записываем в конечный результирующйи объект данные из временно объекта текущей итерации
        });
        //для каждого элемента в elements ищем соседей

        return selector ? this.return_clone_elements_arr(result, filter_elements) : this.output(result); //возвращаем всех найденых соседей если selector = null, или только те которые совпали с элементами объекта filter_elements
    },
    //возвращает элементы лежащие на одном уровне с elements и фильтруются по селектору selector, если selector будет null то венёт всех соседей

    //возвращает прямых потомков элеметов elements, фильтруемых по селектору selector
    //если selector = null то вернёт всех прямых потомков элементов elements
    //отличается от find тем что ищет только на один уровень вниз элементов elements
    //++
    children: function(selector = null, elements = this) {
        let result = [], //сюда будутзаписаны все прямые потомки
            filter_elements = []; //тут будут записаны элементы для фильтрации конечного результата

        //для каждого элемента в elements ищем прямых потомков
        elements.each(function() {
            result = this.return_skleniy_arr(result, this[0].children); //записываем в результирующий массив всех прямых потомков текущего итерируемого элемента

            //если задан силектор для фильтрации прямых потомков на выходе
            if (selector) {
                filter_elements = this.return_skleniy_arr(filter_elements, this.return_selectors_obj(selector, this[0])); //записываем в массив с элементами для фильтра все удовлетворяющие selector элементы
            }
            //если задан силектор для фильтрации прямых потомков на выходе
        });
        //для каждого элемента в elements ищем прямых потомков

        return selector ? this.return_clone_elements_arr(result, filter_elements) : this.output(result); //в завистимости от того установлен фильтр в виде селектора или нет возвращаем объект с отфильтрованными элементами полученнным вледствии нахождения одинаковых элементов в result и filter_elements или же просто всех найденых прямых потомков в видео объекта , если selector не был установлен
    },
    //возвращает прямых потомков элеметов elements, фильтруемых по селектору selector

    //производим поиск по DOM древу каждого элемента в объекта this для поиска удовлетворяющих selector-ов
    find: function(selector, elements = this) {

        let result = []; //сюда будем записывать все найденные элементы

        //перебираем объект this
        for (let i = 0; i < elements.length; i++) {
            let item = this.return_selectors_obj(selector, elements[i]); //найденый элемент

            //если элемента по selector-у найден тозаписываем его в конец массива
            if (item) {
                Array.prototype.push.apply(result, item);
            }
        }

        return this.output(result); //возвращаем функцию для пересоздания объекта this чтоб вернуть его в новом виде
    },
    //производим поиск по DOM древу каждого элемента в объекта this для поиска удовлетворяющих selector-ов

    //возвращает прямого родителя каждого elements, если задан selector то результат бюудет проверяется и на соотвествие ему
    parent: function(selector = null, elements = this) {
        let result = []; //сюда записываем родителей элементов

        //перебираем все элементы elements
        for (let i = 0; i < elements.length; i++) {
            result.push(elements[i].parentNode) //записываем в массив result родителей каждого элемент а elements
        }
        //перебираем все элементы elements

        //если задан селектор для отбора
        if (selector) {
            let all_selectors = this.return_selectors_obj(selector), //объект со всеми элементами удовлетворяющими селектор selector
                filter_result = this.return_clone_elements_arr(result, all_selectors); //получаем массив в который будут записаны одинаковые занчения найденные в массивах result и all_selectors
            return this.output(filter_result); //возвращаем объект с отфильтрованными родительскими элементами
        }
        //если задан селектор для отбора

        return this.output(result); //возвращаем объект с родительскими элементами
    },
    //возвращает прямого родителя каждого elements, если задан selector то результат бюудет проверяется и на соотвествие ему








    //возвращает всех родителей, удовлетворяющих selector
    parents: function(selector = null, elements = this) {
        let result = []; //сюда записываем всех родителей элементов

        //перебираем все элементы elements
        for (let i = 0; i < elements.length; i++) {
            let el = elements[i], //текущий итерируемый элемент родетелей которого мы ищем
                parents = []; //сюда записываем всех родетелей элемента el

            //цикл while будет выпоолняться пока мы не доберёмся до родительского элемента document
            while (el.parentNode.nodeType !== 9) {
                parents.push(el.parentNode); //записываем в массив parents каждого родитетя по очереди
                el = el.parentNode; //присваеваем текущему итерируемому элементу el его родителя чтоб обеспечить подъём вверх по DOM дереву элементов
            }
            //цикл while будет выпоолняться пока мы не доберёмся до родительского элемента document
            result = this.return_skleniy_arr(result, parents);
        }
        //перебираем все элементы elements

        //если задан селектор для отбора
        if (selector) {
            let all_selectors = document.querySelectorAll(selector), //получаем html-коллеккцию всех элементов по указаному селектору
                filter_result = this.return_clone_elements_arr(result, all_selectors); //получаем массив в который будут записаны одинаковые занчения найденные в массивах result и all_selectors
            return this.output(filter_result); //возвращаем объект с отфильтрованными родительскими элементами
        }
        //если задан селектор для отбора

        return this.output(result); //возвращаем объект с родительскими элементами
    },
    //возвращает всех родителей, удовлетворяющих selector






    //возвращает объект с элементом соответствующим индексу index в объекте elements
    //i = -1 выдаст последний элемент в наборе
    eq: function(i, elements = this) {
        let index = i === -1 ? elements.length - 1 : i,
            el = elements[index]; //получаем элемент массива по индексу index, если не нашли то получим undefined

        //если нашли
        if (el) {
            return this.output([el].slice()) //возвращаем объект сформированный на основе массиа созданного с единственным элементом el
        }
        //если нашли

        //если не нашли
        else {
            return this.output([]); //возвращаем объект сформированный на основе пустого объекта
        }
        //если не нашли
    },
    //возвращает объект с элементом соответствующим индексу index в объекте elements

    //возвращает первый элемент в объекте elements
    first: function(elements = this) {
        return this.eq(0);
    },
    //возвращает первый элемент в объекте elements

    //возвращает последний элемент в объекте elements
    last: function(elements = this) {
        return this.eq(-1);
    }
    //возвращает последний элемент в объекте elements
    //тугле
}
//объект с основными функциями

//функция инициализирует первый поиск по selector-у и возвращает сформированный объект obj с прототипом KSN_jQuery
function $(selector = null) {
    let obj = Object.create(KSN_jQuery); //создаём новый объект obj с прототипом KSN_jQuery

    //если селектор $(""), $(null), $(undefined), $(false)
    if (!selector) {
        return obj; //возвращаем наш объект obj
    }
    //если селектор $(""), $(null), $(undefined), $(false)

    //для текстовых сетекторов "#test, .class_test>div.tested, header, a[href='/wefewf/ewf']"
    if (typeof selector === "string") {
        return obj.return_selectors_obj(selector); //возвращаем наш объект obj с прототипом KSN_jQuery и всеми элементами найдеными по селекторам
    }
    //для текстовых сетекторов ".class_test>div.tested"

    //для сетекторов типа DOMElement таких как window, document...
    obj[0] = selector; //записываем объект DOMElement
    obj.length = 1;
    return obj; //возвращаем наш объект obj с прототипом KSN_jQuery
    //для сетекторов типа DOMElement таких как window, document...

}
//функция инициализирует первый поиск по selector-у и возвращает сформированный объект obj с прототипом KSN_jQuery




//console.log($(".header_menu_item, nav, body, header a[href='#'],#test"))




//console.log($(".header_menu_item").removeAttr("titlr effef").removeClass("gweg trjjt").addClass("test egwgygruygbeg").toggleClass("egwgygruygbeg itsworck").toggleClass("test itsworck"));



//$(".header_menu_item").on("click touchend", test, { passive: true });


//console.log($(".header_logo").siblings("nav, header div.header_search_button"))


//console.log($("img").parent("div, a"))
//console.log(jQuery("img").parent("div, a"))

//console.log($("header").find("img, a[href*='tel']"))
//console.log(jQuery("header").find("img, a[href*='tel']"))



//console.log($(".visible_header_part, .hidden_header_part").children("nav, .header_search_button"))
//console.log(jQuery("body").children())



//console.log($(".header_menu_item").siblings("div, a"))
//console.log($(".svg_img").siblings("div, a"))
//console.log($(".svg_img, .header_menu_item").siblings("div, a"))
//console.log(jQuery(".header_menu_item").siblings("div, a"))
//console.log(jQuery(".svg_img").siblings("div, a"))



/*
let header_menu_wrapper = $(".header_menu_wrapper"),
    hidden_header_part = $(".hidden_header_part"),
    header_burger_button = $(".header_burger_button"),
    header_search_button = $(".header_search_button"),
    search_wrapper = $(".search_wrapper"),
    search_input = $(".search_input"),
    close_search = $(".close_search");


//открываем и закрывам меню по клику на бургер кнопку
header_burger_button.on("click tochend", function() {
    header_menu_wrapper.toggleClass("active");
    setTimeout(function() {
        header_menu_wrapper.toggleClass("test");
    }, 10);

});
//открываем и закрывам меню по клику на бургер кнопку

//клик по кнопке поиска в меню
header_search_button.on("click tochend", function() {
    if (!search_wrapper.hasClass("active")) {
        search_wrapper.addClass("active"); //открываем блок с полемм ввода для поиска
        hidden_header_part.addClass("show"); //открываем блок с полемм ввода для поиска
        search_input.find("input").focus(); //ставим курсор на наше поле ввода
    } else {
        hidden_header_part.removeClass("show"); //открываем блок с полемм ввода для поиска
        setTimeout(function() {
            search_wrapper.removeClass("active"); //открываем блок с полемм ввода для поиска
        }, 200);
    }

});
//клик по кнопке поиска в меню


//клик по крестику в окне поска
close_search.on("click tochend", function() {
    let input = search_wrapper.find("input");
    //если в поле введён текст
    if (search_wrapper.find("input")[0].value.length > 0) {
        input[0].value = null; //удаляем этот текст
        input.removeClass("nachat_vvod"); //убираем клас
    }
    //если в поле введён текст

    //если в поле нет текста
    else {
        search_wrapper.removeClass("active"); //скрываем окно с полем ввода для поиска
    }
    //если в поле нет текста
});
//клик по крестику в окне поска

//меняем цвет текста и границ после начала ввода
search_wrapper.find("input")[0].oninput = function() {
    let input = search_wrapper.find("input");
    this.value.length > 0 ? input.addClass("nachat_vvod") : input.removeClass("nachat_vvod");
}
//меняем цвет текста и границ после начала ввода



// создадим элемент с прокруткой
let div = document.createElement('div');

div.style.overflowY = 'scroll';
div.style.width = '50px';
div.style.height = '50px';

// мы должны вставить элемент в документ, иначе размеры будут равны 0
document.body.append(div);
let scrollWidth = div.offsetWidth - div.clientWidth;

div.remove();

//console.log(scrollWidth)


function getScrollBarWidth() {
    var inner = document.createElement('p');
    inner.style.width = "100%";
    inner.style.height = "200px";

    var outer = document.createElement('div');
    outer.style.position = "absolute";
    outer.style.top = "0px";
    outer.style.left = "0px";
    outer.style.visibility = "hidden";
    outer.style.width = "200px";
    outer.style.height = "150px";
    outer.style.overflow = "hidden";
    outer.appendChild(inner);

    document.body.appendChild(outer);
    var w1 = inner.offsetWidth;
    outer.style.overflow = 'scroll';
    var w2 = inner.offsetWidth;
    if (w1 == w2) w2 = outer.clientWidth;

    document.body.removeChild(outer);

    return (w1 - w2);
};

//console.log(getScrollBarWidth())
*/