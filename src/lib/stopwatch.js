import { templateEngine } from './templateEngine.ts'

export class StopWatch {
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
