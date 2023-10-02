import './style.css'
import { StopWatch } from './lib/stopwatch'
import { CardGame } from './script'

const app = document.querySelector('.app')
const game = new CardGame(app)

const indexTop = document.querySelector('.top')
const timer = new StopWatch(indexTop)

// declare global {
//     interface Window {
//       app: {
//         difficulty: 0,
//         selected: 0,
//         start: false,
//         showCards: 0
//         selectedtarget: 0,

//     }
//     }
//   }

game.subscribeStart(timer.Start)
game.subscribeStop(timer.Stop)
