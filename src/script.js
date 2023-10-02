import { templateEngine } from './lib/templateEngine.ts'

window.app = {
    difficulty: 0,
    selected: 0,
    start: false,
    showCards: 0,
    selectedtarget: 0
}

export class CardGame {
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

        if (
            target.classList.contains('app__popUpLoss__button') ||
            target.classList.contains('app__popUpFinish__button')
        ) {
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
