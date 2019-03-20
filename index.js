(function memoji() {
    let data = ["🐶","🐱","🐭","🐹","🐰"," 🐻","🐼","🐨","🐯","🦁","🐮","🐷","🐸","🐙","🐵","🦄","🐞","🦀","🐟","🐊","🐓","🦃","🐿"];
    let emoji = chooseSix(data); // Выбираем 6 случайных эмоджи
    let cards = addOrderNumberToCards(mixCards(makeCards(emoji))); // Список всех карточек
    let justSelectedCards = []; // Здесь хранятся 2 карточки, на которых был произведен клик
    let justSelectedCardsOrders = []; // Здесь храним порядковые номера карточек
    let cardsDOM = document.querySelectorAll(".card"); // Список всех карточек в DOM-дереве
    let justSelectedCardsDOM = []; // Здесь хранятся 2 карточки, на которых был произведен клик
    let justSelectedCardsOrdersDOM = []; // Здесь храним порядковые номера карточек
    let order = null; // Здесь хранится порядковый номер элемента, по которому был совершен клик (см.функцию getOrderNumber)
    let closedCards = cards.length; // Количество карт, которые осталось открыть
    let timer = new Timer(60); // Таймер
    let showTimeId; // Идентификатор интервала врмени (см.функцию timerStart)
    document.querySelector('.newGame').addEventListener('click', newGame); // Кнопка "Новая игра"


    /**
     * Выбирает 6 случайных emoji из набора
     * @param set
     * @returns {*}
     */
    function chooseSix(set) {
        let allEmojies = Array.prototype.slice.call(set); // Получаем массив элементов
        let uniqe12 = []; // Массив, куда мы сложим 12 случайных элементов из списка
        let count = allEmojies.length; // Количество элементов в исходной библиотеке эмоджи

        // Возвращает случайное целое число между min (включительно) и max (не включая max)
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
        // Оставляет только уникальные элементы в массиве
        function unique(arr) {
            var obj = {};
            for (var i = 0; i < arr.length; i++) {
                var str = arr[i];
                obj[str] = true;
            }
            return Object.keys(obj);
        }
        // Выбираем 12 случайных эмоджи (могут повторяться), затем просеиваем их через объект для устранения одинаковых
        for (let i = 0; i < 12; i++) {
            uniqe12.push(allEmojies[getRandomInt(0,count)]);
        }
        // Выбираем 6 уникальных эмоджи
        return unique(uniqe12).slice(0,6);
    }


    /**
     * Конструктор карточек. Определяем свойства, которые есть у карточки
     * value - значение карточки
     * opened - определяет, открыта сейчас карточка или нет
     * finished - определяет, найдена ли для карточки пара
     * @constructor
     */
    function Card() {
        this.order = null;
        this.value = null;
        this.opened = false;
        this.finished = false;
    }


    /**
     * Создает набор карточек, исходя из набора переданных базовых значений
     * @returns {[]} Массив с картами
     * @param values Массив со значениями
     * @param repeat Количество "повторок", по умолчанию 2
     */
    function makeCards(values, repeat) {
        let arrayOfValues = Array.prototype.slice.call(values);
        let set = [];
        if (repeat === undefined) {
            repeat = 2;
        }
        for (let i = 1; i <= repeat; i++) {
            arrayOfValues.forEach(function (cardValue) {
                let card = new Card();
                card.value = cardValue;
                set.push(card);
            });
        }
        return set;
    }


    /**
     * Тасует колоду карточек в случайном порядке
     * @param set - Набор карточек
     * @returns {Array} - Набор карточек
     */
    function mixCards(set) {
        let cards = Array.prototype.slice.call(set);
        function compareRandom(a, b) {
            return Math.random() - 0.5;
        }
        cards.sort(compareRandom);
        return cards;
    }


    /**
     * Добавляем массиву карточек порядковый номер
     * @param set
     */
    function addOrderNumberToCards(set) {
        let cards = Array.prototype.slice.call(set);
        let order = 0;
        cards.forEach(function(card) {
            card.order = order;
            order++;
        });
        return cards;
    }


    /**
     * После клика по карточке меняем ей статус в коллекции карточек на открытую
     */
    function changedOpenStatus() {
        cards[order].opened = true;
    }


    /**
     * Сравнение выбранных карточек
     */
    function comparingOpenedCards() {
        // Если карточек меньше 2х, то добавляем их в массив для сравнения
        if (justSelectedCards.length <= 1) {
            justSelectedCards.push(cards[Number(order)]);
            justSelectedCardsOrders.push(Number(order));
        }
        // Когда открыто две карточки
        if (justSelectedCards.length === 2) {

            // Если карточки одинаковые, то устанавливаем им статус "Завершеннные"
            if (comparePair(justSelectedCards[0].value, justSelectedCards[1].value)) {
                cards[justSelectedCardsOrders[0]].finished = true;
                cards[justSelectedCardsOrders[1]].finished = true;
                closedCards = closedCards - 2;
                (closedCards === 0) ? checkCards() : {};
            }
            else {
            // Если карточки разные, то возвращаем им статус "Закрытые"
                cards[justSelectedCardsOrders[0]].opened = false;
                cards[justSelectedCardsOrders[1]].opened = false;
            }
            justSelectedCards = [];
            justSelectedCardsOrders = [];
        }
    }


    /**
     * Сравнивает два элемента
     * @param a
     * @param b
     * @returns {boolean}
     */
    function comparePair(a, b) {
        return (a === b);
    }


    /**
     *
     * Манипуляции с DOM-деревом
     *
     */


    /**
     * Добавляем карточкам порядковый номер (DOM)
     */
    (function addOrderNumberToCardsDom() {
        let order = 0;
        cardsDOM.forEach(function(card){
            card.dataset.order = order;
            order++;
        });
    })();


    /**
     * Возвращает порядковый номер элемента, по которому был совершен клик
     */
    function getOrderNumber() {
        order = this.dataset.order;
    }


    /**
     * Установка картинки в data-value
     */
    function setDataValue() {
        this.dataset.value = cards[order].value;
    }


    /**
     * Открывает/закрывает карту
     */
    function openCloseCard(obj) {
        // Добавим возможность приема аргументов
        if (obj.constructor === HTMLDivElement) {
            if (!obj.classList.contains('opened')) {
                obj.classList.add('opened');
            } else  {
                obj.classList.remove('opened');
            }
        } else {
            if (!this.classList.contains('opened')) {
                this.classList.add('opened');
            } else  {
                this.classList.remove('opened');
            }
        }
    }


    /**
     * Закрытие всех карточек
     */
    function closeAllCards() {
        cardsDOM.forEach(function(card){
            if(card.classList.contains('opened')) {
                card.classList.remove('opened');
            }
        });
    }


    /**
     * Блокировка карты
     * @param obj
     */
    function cardBlocked(obj) {
        obj.removeEventListener('click', getOrderNumber);
        obj.removeEventListener('click', changedOpenStatus);
        obj.removeEventListener('click', comparingOpenedCards); // Активация функции сравнения
        obj.removeEventListener('click', setDataValue);
        obj.removeEventListener('click', openCloseCard);
        obj.removeEventListener('click', compareCards); // Активация сравнения карточек
    }


    /**
     * Блокировка всех карточек (по завершении игры)
     */
    function cardBlockedAll(){
        cardsDOM.forEach(function(card){
           cardBlocked(card);
        });
    }


    /**
     * Разблокировка карты
     * @param obj
     */
    function cardUnblocked(obj) {
        obj.addEventListener('click', getOrderNumber);
        obj.addEventListener('click', changedOpenStatus);
        obj.addEventListener('click', comparingOpenedCards); // Активация функции сравнения
        obj.addEventListener('click', setDataValue);
        obj.addEventListener('click', openCloseCard);
        obj.addEventListener('click', compareCards); // Активация сравнения карточек
    }


    /**
     * Разблокировка всех карточек (для начала новой игры)
     */
    function cardUnblockedAll(){
        cardsDOM.forEach(function(card){
            cardUnblocked(card);
        });
    }


    /**
     * Сравнение карточек
     */
    function compareCards() {
        // Если открыто меньше трех карт
        if (justSelectedCardsDOM.length <= 2) {
            justSelectedCardsDOM.push(this);
            justSelectedCardsOrdersDOM.push(order);
            cardBlocked(this);
        }
        // Если открыто 2 карты
        if (justSelectedCardsDOM.length === 2) {
            // Сравниваем значения у исходных объектов
            if (comparePair(cards[justSelectedCardsOrdersDOM[0]].value, cards[justSelectedCardsOrdersDOM[1]].value)) {
                cardBlocked(justSelectedCardsDOM[0]);
                cardBlocked(justSelectedCardsDOM[1]);
                justSelectedCardsDOM = [];
                justSelectedCardsOrdersDOM = [];
            }
        }
        // Если открыто 3 карты
        if (justSelectedCardsDOM.length === 3) {
            cardUnblocked(justSelectedCardsDOM[0]);
            cardUnblocked(justSelectedCardsDOM[1]);
            openCloseCard(justSelectedCardsDOM[0]);
            openCloseCard(justSelectedCardsDOM[1]);
            justSelectedCardsDOM.splice(0,2);
            justSelectedCardsOrdersDOM.splice(0,2);
        }
    }


    /**
     * Подключение обработчиков событий при нажатии на карту
     */
    cardsDOM.forEach(function(card) {
        card.addEventListener('click', getOrderNumber); // Возврат порядкового элемента, на котором был клик
        card.addEventListener('click', changedOpenStatus); // Смена статуса на "Открыт"
        card.addEventListener('click', comparingOpenedCards); // Активация функции сравнения
        card.addEventListener('click', setDataValue); // Установка картинки для карточки
        card.addEventListener('click', openCloseCard); // Активация функции открытия карточки
        card.addEventListener('click', compareCards); // Активация сравнения карточек
    });


    /**
     *
     * Результатная часть (время и сообщения)
     *
     */


    /**
     * Конструктор таймера
     * @constructor
     */
    function Timer(sec) {
        let self = this;
        this.seconds = sec;
        let timerId = null;
        let afterTimer = null;

        // Метод вычитания
        this.subtract = function() {
            self.seconds--;
            // console.log(self.seconds);
            if (self.seconds === 0) {
                clearInterval(timerId);
            }
            return self;
        };

        // Метод запуска
        this.start = function() {
            // console.log(self.seconds);
            timerId = setInterval(this.subtract, 1000);
            return self;
        };

        // Метод паузы
        this.stop = function() {
            clearInterval(timerId);
            clearTimeout(afterTimer);
            return self
        };

        // По завершении работы счетчика
        this.after = function(func) {
            afterTimer = setTimeout(func, this.seconds * 1000);
            return self;
        };

        // Метод сброса таймера
        this.reset = function() {
            this.seconds = sec;
            return self;
        }
    }


    /**
     * Проверка, были ли открыты все карточки
     */
    function checkCards() {
        if (closedCards === 0) {
            timer.stop();
            gameOver(1);
        } else {
            gameOver();
        }
    }


    /**
     * Функция, срабатывающая при завершении игры
     */
    function gameOver(result) {
        setTimeout(cardBlockedAll, 1000);
        let message = null;
        switch (result) {
            case 1:
               message = "Win";
               break;
            default:
                message = "Lose";
        }

        function decorateFinalCaption() {
            let letters = message.split('');
            let i = 0;
            document.querySelector('.message').innerHTML = "";
            letters.forEach(function (letter) {
                document.querySelector('.message').innerHTML += `<div class="letter">${letter}</div>`;
                document.querySelectorAll('.letter')[i].style.animation = "dancingCaption";
                document.querySelectorAll('.letter')[i].style.animationDuration = "0.5s";
                document.querySelectorAll('.letter')[i].style.animationDirection = "alternate";
                document.querySelectorAll('.letter')[i].style.animationIterationCount = "infinite";
                document.querySelectorAll('.letter')[i].style.animationDelay = `${i/10}s`;
                i++;
            });
        }

        function endScreen() {
            document.querySelector('.gameOver').classList.add('show');

        }
        hideTime();
        setTimeout(endScreen, 1000);
        decorateFinalCaption();
    }


    /**
     * Принимает в себя экземлпяр таймера, возвращает преобразованную в цифровой вид строку
     * @param timer
     * @returns {string}
     */
    function digitalTimeFormat(timer) {
        let minutes = Math.floor(timer.seconds / 60);
        let seconds = timer.seconds % 60;
        if (minutes <= 9) {
            minutes = "0" + minutes;
        }
        if (seconds <= 9) {
            seconds = "0" + seconds;
        }
        return `${minutes}:${seconds}`;
    }


    /**
     * Выводим время на страницу в определенном формате
     */
    function showTime() {
        document.querySelector('.time').classList.add('show');
        document.querySelector('.time').innerHTML = digitalTimeFormat(timer);
    }


    /**
     * Убирает время со страницы
     */
    function hideTime() {
        clearInterval(showTimeId);
        document.querySelector('.time').classList.remove('show');
    }


    /**
     * Запускаем счетчик и функцию, которая сработает по окончании таймера
     */
    function timerStart() {
        // Убираем с кнопки событие инициализации таймера
        removeTimerListenerFromTheFirstClick();
        // Запускаем таймер
        timer.reset().start().after(checkCards);
        // Выводим исходное время в DOM-дерево
        showTime();
        // Запускаем обновление времение в DOM-дерево
        showTimeId = setInterval(showTime, 1000);
    }


    /**
     * Инициирует запуск таймера по первому клику по карточке
     */
    function startTimerOnFirstClick() {
        cardsDOM.forEach(function(card) {
            card.addEventListener('click', timerStart);
        });
    }


    /**
     * Отключает инициализацию таймера по клику на карточку
     */
    function removeTimerListenerFromTheFirstClick() {
        cardsDOM.forEach(function(card) {
            card.removeEventListener('click', timerStart);
        });
    }


    /**
     * Новая игра
     */
    function newGame() {
        // Убираем окно "Игра окончена"
        document.querySelector('.gameOver').classList.remove('show');
        // Закрываем все карточки
        closeAllCards();
        // Заново инициализируем все основные переменные
        emoji = chooseSix(data);
        cards = addOrderNumberToCards(mixCards(makeCards(emoji)));
        justSelectedCards = []; // Здесь хранятся 2 карточки, на которых был произведен клик
        justSelectedCardsOrders = []; // Здесь храним порядковые номера карточек
        cardsDOM = document.querySelectorAll(".card"); // Список всех карточек в DOM-дереве
        justSelectedCardsDOM = []; // Здесь хранятся 2 карточки, на которых был произведен клик
        justSelectedCardsOrdersDOM = []; // Здесь храним порядковые номера карточек
        order = null;
        closedCards = cards.length;
        // Сбрасываем счетчик времени
        timer.reset();
        // Показываем время
        showTime();
        // Разблокируем карточки
        cardUnblockedAll();
        // Ожидаем клика по карточке для запуска таймера
        startTimerOnFirstClick();
    }


    newGame(); // Инициализация новой игры


})();