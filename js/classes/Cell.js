import config from '../config.js'

class Cell {
  obj
  data

  constructor (index = -1) {
    this.obj = document.createElement('div')
    this.obj.className = 'cell'

    this.data = index
    this.obj.data = index

    this.obj.style.width = `${40 / config.puzzleSize}vw`
    this.obj.style.height = `${40 / config.puzzleSize}vw`
  }
}

export default Cell
