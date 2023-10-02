/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/style.css":
/*!***********************!*\
  !*** ./src/style.css ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/lib/stopwatch.js":
/*!******************************!*\
  !*** ./src/lib/stopwatch.js ***!
  \******************************/
/***/ (() => {

// import {templateEngine} from "./templateEngine.js"

// export
class StopWatch {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error('Передан не HTML элемент')
        }
        if (element.tagName !== 'DIV') {
            throw new Error('Поддерживается только div')
        }
        this.element = element
        this.seconds = 0
        this.minutes = 0
        this.hours = 0
        this.interval
        this.started = false
        this.pause

        this.render()

        this.onSubmit = this.onSubmit.bind(this)
        this.Start = this.Start.bind(this)
        this.Reload = this.Reload.bind(this)
        this.Stop = this.Stop.bind(this)

        this.updateTime = this.updateTime.bind(this)

        this.element.addEventListener('submit', this.onSubmit)
    }

    render() {
        this.element.innerHTML = ''
        // eslint-disable-next-line no-undef
        this.element.appendChild(templateEngine(StopWatch.template))

        this.stopwatch = document.querySelector('.box__stopwatch__time')
        console.dir(this.stopwatch)
        console.log(this.stopwatch.textContent)
    }

    onSubmit(event) {
        event.preventDefault()
        console.log('сумбит')
        this.Reload()
    }

    updateTime() {
        this.seconds++
        if (this.seconds === 60) {
            this.minutes++
            this.seconds = 0
        }
        if (this.minutes === 60) {
            this.hours++
            this.minutes = 0
        }

        this.stopwatch.textContent = `${this.minutes
            .toString()
            .padStart(2, '0')}.${this.seconds.toString().padStart(2, '0')}`
    }

    Start() {
        this.started = true
        this.interval = setInterval(this.updateTime, 1000)
    }

    Reload() {
        location.reload()
    }
    Stop() {
        this.pause = `${this.minutes.toString().padStart(2, '0')}.${this.seconds
            .toString()
            .padStart(2, '0')}`

        clearInterval(this.interval)

        this.started = false
        this.seconds = 0
        this.minutes = 0
        this.hours = 0

        this.stopwatch.textContent = '00.00'

        return this.pause
    }
}

StopWatch.template = {
    tag: 'form',
    cls: 'box',
    content: [
        {
            tag: 'div',
            cls: 'box__stopwatch',
            content: [
                {
                    tag: 'div',
                    cls: 'box__stopwatch__title',
                    content: [
                        {
                            tag: 'div',
                            cls: 'box__stopwatch__title__min',
                            content: 'min'
                        },
                        {
                            tag: 'div',
                            cls: 'box__stopwatch__title__sec',
                            content: 'sec'
                        }
                    ]
                },
                {
                    tag: 'div',
                    cls: 'box__stopwatch__time',
                    content: '00.00'
                }
            ]
        },

        {
            tag: 'button',
            cls: 'box__button',
            content: 'Начать заново'
        }
    ]
}


/***/ }),

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ (() => {

// import {templateEngine} from "./lib/templateEngine.js"

// export
class CardGame {
    constructor(element) {
        if (!(element instanceof HTMLElement)) {
            throw new Error('Передан не HTML элемент')
        }

        if (element.tagName !== 'DIV') {
            throw new Error('Поддерживается только div')
        }

        this.element = element
        this.cards = [
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
            20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
        ]

        this.onClick = this.onClick.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.render(CardGame.popUp)

        this.element.addEventListener('click', this.onClick)
        this.element.addEventListener('submit', this.onSubmit)
    }

    subscribeStart(fun) {
        this.startWatch = fun
    }

    subscribeStop(fun) {
        this.stopTime = fun
    }

    onSubmit(event) {
        event.preventDefault()

        console.log(window.app)

        if (window.app.difficulty !== 0) {
            document.querySelector('.top').classList.remove('hidden')

            this.cards.sort(() => Math.random() - 0.5)
            this.arr = this.cards.slice(0, window.app.difficulty * 3)
            this.arr = this.arr.concat(this.arr)
            this.arr.sort(() => Math.random() - 0.5)
            console.log(this.arr)

            this.element.innerHTML = ''

            for (let i = 0; i < this.arr.length; i++) {
                this.render(CardGame.playField(i + 1, this.arr[i]))
            }

            setTimeout(() => {
                this.element.innerHTML = ''
                for (let i = 0; i < this.arr.length; i++) {
                    this.render(CardGame.playField(this.arr[i], 'rub'))
                }
                this.startWatch()
                window.app.start = 'true'
                window.app.selected = 0
            }, 1000)
        } else alert('выберите уровень сложности')
    }

    render(block) {
        // eslint-disable-next-line no-undef
        this.element.appendChild(templateEngine(block))
    }

    checkGame() {
        if (window.app.showCards === this.arr.length) {
            this.timeGame = this.stopTime()
            this.render(CardGame.popUpFinish(this.timeGame))
        }
    }

    onClick(event) {
        const target = event.target

        if (target.classList.contains('app__popUpLoss__button')) {
            location.reload()
        }

        if (target.classList.contains('app__popup__difficulty__item')) {
            this.element
                .querySelectorAll('.app__popup__difficulty__item')
                .forEach((element) => {
                    element.classList.remove(
                        'app__popup__difficulty__item_selected'
                    )
                    window.app.difficulty = 0
                })

            target.classList.add('app__popup__difficulty__item_selected')

            window.app.difficulty = target.dataset.id
        }

        if (target.classList.contains('app__card') && window.app.start) {
            // if (window.app.selectedtarget === target)
            if (
                window.app.selected > 0 &&
                window.app.selectedtarget !== target
            ) {
                if (window.app.selected === target.dataset.id) {
                    target.setAttribute(
                        `style`,
                        `background-image: url(./src/img/${target.dataset.id}.png)`
                    )

                    window.app.selected = 0
                    window.app.showCards++

                    this.checkGame()
                } else {
                    this.timeGame = this.stopTime()

                    this.render(CardGame.popUpLoss(this.timeGame))
                }
            } else {
                window.app.selected = target.dataset.id
                target.setAttribute(
                    'style',
                    `background-image: url(./src/img/${target.dataset.id}.png)`
                )
                window.app.showCards++

                window.app.selected = target.dataset.id
                window.app.selectedtarget = target
            }
        }
    }
}

CardGame.popUp = {
    tag: 'form',
    cls: 'app__popup',
    content: [
        {
            tag: 'div',
            cls: 'app__popup__text',
            content: ['Выбери сложность']
        },
        {
            tag: 'div',
            cls: 'app__popup__difficulty',
            content: [
                {
                    tag: 'div',
                    cls: [
                        'app__popup__difficulty__item',
                        'app__popup__difficulty__1'
                    ],
                    content: ['1'],
                    attrs: { 'data-id': 1 }
                },
                {
                    tag: 'div',
                    cls: [
                        'app__popup__difficulty__item',
                        'app__popup__difficulty__2'
                    ],
                    content: ['2'],
                    attrs: { 'data-id': 2 }
                },
                {
                    tag: 'div',
                    cls: [
                        'app__popup__difficulty__item',
                        'app__popup__difficulty__3'
                    ],
                    content: ['3'],
                    attrs: { 'data-id': 3 }
                }
            ]
        },
        {
            tag: 'button',
            cls: 'app__popup__button',
            content: ['Старт']
        }
    ]
}

CardGame.playField = function (i, random) {
    return {
        tag: 'div',
        cls: 'app__card',
        attrs: {
            style: `background-image: url(./src/img/${random}.png);`,
            'data-id': i
        }
    }
}

CardGame.popUpFinish = function (time) {
    return {
        tag: 'form',
        cls: 'app__popUpFinish',
        content: [
            {
                tag: 'div',
                cls: 'app__popUpFinish__head',
                content: [
                    {
                        tag: 'img',
                        cls: 'app__popUpFinish__head__img',
                        attrs: { src: './src/img/logo.png' }
                    },
                    {
                        tag: 'div',
                        cls: 'app__popUpFinish__head__text',
                        content: ['Вы выиграли!']
                    }
                ]
            },
            {
                tag: 'div',
                cls: 'app__popUpFinish__titleTime',
                content: ['Затраченное время:']
            },
            {
                tag: 'div',
                cls: 'app__popUpFinish__time',
                content: [`${time}`]
            },
            {
                tag: 'button',
                cls: 'app__popUpFinish__button',
                content: ['Играть снова']
            }
        ]
    }
}

CardGame.popUpLoss = function (time) {
    return {
        tag: 'form',
        cls: 'app__popUpFinish',
        content: [
            {
                tag: 'div',
                cls: 'app__popUpFinish__head',
                content: [
                    {
                        tag: 'img',
                        cls: 'app__popUpFinish__head__img',
                        attrs: { src: './src/img/logo_loss.png' }
                    },
                    {
                        tag: 'div',
                        cls: 'app__popUpFinish__head__text',
                        content: ['Вы проиграли!']
                    }
                ]
            },
            {
                tag: 'div',
                cls: 'app__popUpFinish__titleTime',
                content: ['Затраченное время:']
            },
            {
                tag: 'div',
                cls: 'app__popUpFinish__time',
                content: [`${time}`]
            },
            {
                tag: 'button',
                cls: 'app__popUpLoss__button',
                content: ['Играть снова']
            }
        ]
    }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.css */ "./src/style.css");
/* harmony import */ var _lib_stopwatch_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/stopwatch.js */ "./src/lib/stopwatch.js");
/* harmony import */ var _lib_stopwatch_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lib_stopwatch_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _script_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./script.js */ "./src/script.js");
/* harmony import */ var _script_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_script_js__WEBPACK_IMPORTED_MODULE_2__);




const app = document.querySelector('.app')
const game = new _script_js__WEBPACK_IMPORTED_MODULE_2__.CardGame(app)

const indexTop = document.querySelector('.top')
const timer = new _lib_stopwatch_js__WEBPACK_IMPORTED_MODULE_1__.StopWatch(indexTop)

window.app = {
    difficulty: 0,
    selected: 0,
    start: false,
    showCards: 0
}

game.subscribeStart(timer.Start)
game.subscribeStop(timer.Stop)

})();

/******/ })()
;