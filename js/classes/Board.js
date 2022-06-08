import Cell from './Cell.js'
import config from '../config.js'

class Board {
  obj // object of puzzle board
  puzzleElements = []
  popUpWindow // object of popUpWindow shown after win

  positionOfBlankPuzzleElement = config.puzzleSize * config.puzzleSize // default last element
  /*
  * default element before last and an element level lower than a last element
  * for example (x are elements with listener and l is last element)
  * o o o
  * o o x
  * o x l
  */
  elementsWithListener = [config.puzzleSize * (config.puzzleSize - 1), (config.puzzleSize * config.puzzleSize - 1)]

  // counter how many times puzzle elements were reshuffled
  mixCounter = 0
  mixCompleted = false
  timeoutId

  constructor () {
    this.obj = document.getElementById('board')
    this.popUpWindow = document.getElementById('popUpWindow')
    this.popUpWindow.onclick = () => { this.closePopUpWindows() }

    this.createPuzzleWithPuzzleElements()
  }

  createPuzzleWithPuzzleElements () {
    let indexOfPuzzleElement = 1
    for (let i = 1; i < config.puzzleSize + 1; i++) {
      for (let j = 1; j < config.puzzleSize + 1; j++) {
        if (i === config.puzzleSize && j === config.puzzleSize) break

        const puzzleElement = new Cell(indexOfPuzzleElement)

        // assigning default listeners
        if (indexOfPuzzleElement === this.elementsWithListener[0] || indexOfPuzzleElement === this.elementsWithListener[1]) {
          puzzleElement.obj.onclick = (e) => { this.move(e) }
        }

        indexOfPuzzleElement++

        puzzleElement.obj.style.backgroundImage = `url(../assets/${config.currentImage})`

        // without increased size of background puzzle elements would not fit
        puzzleElement.obj.style.backgroundSize = `${(config.puzzleSize + 1) * 100}%`
        // assigning puzzle elements thier pictures
        puzzleElement.obj.style.backgroundPosition = (j - 1) * Math.ceil(100 / config.puzzleSize) + '% ' + (i - 1) * Math.ceil(100 / config.puzzleSize) + '%'

        this.puzzleElements.push(puzzleElement)
        this.obj.appendChild(puzzleElement.obj)
      }
    }
    // creating blank element
    const puzzleElement = new Cell(this.positionOfBlankPuzzleElement)
    this.puzzleElements.push(puzzleElement)
    this.obj.appendChild(puzzleElement.obj)
    // creating hidden element used for move
    const cell2 = new Cell()
    cell2.obj.className = ''
    cell2.obj.id = 'lastElement'
    this.obj.appendChild(cell2.obj)

    this.reshuffle()
  }

  resetDefaultValues () {
    this.obj.innerText = ''

    this.puzzleElements = []

    this.positionOfBlankPuzzleElement = config.puzzleSize * config.puzzleSize
    this.elementsWithListener = [config.puzzleSize * (config.puzzleSize - 1), (config.puzzleSize * config.puzzleSize - 1)]

    clearTimeout(this.timeoutId)
    this.mixCounter = 0
    this.mixCompleted = false

    this.createPuzzleWithPuzzleElements()
  }

  move (e) {
    // getting current blank element
    const currentBlankElement = this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === this.positionOfBlankPuzzleElement)[0]
    // getting future blank element
    const futureBlankElement = this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === e.target.data)[0]
    // getting element after current blank element
    let elementAfterCurrentBlankElement = { obj: '' }
    if (this.positionOfBlankPuzzleElement === config.puzzleSize * config.puzzleSize) {
      elementAfterCurrentBlankElement.obj = document.getElementById('lastElement')
    } else {
      elementAfterCurrentBlankElement = this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === this.positionOfBlankPuzzleElement + 1)[0]
    }
    // getting element after future blank element
    let elementAfterFutureBlankElement = { obj: '' }
    if (e.target.data === config.puzzleSize * config.puzzleSize) {
      elementAfterFutureBlankElement.obj = document.getElementById('lastElement')
    } else {
      elementAfterFutureBlankElement = this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === e.target.data + 1)[0]
    }
    // swapping position of current blank element and future blank element
    const temp = this.positionOfBlankPuzzleElement
    if (futureBlankElement === undefined) {
      console.log(e.target.data)
    }

    this.positionOfBlankPuzzleElement = e.target.data
    currentBlankElement.obj.data = e.target.data
    futureBlankElement.obj.data = temp
    // getting parent node of thiese elements
    const parentNode = currentBlankElement.obj.parentNode
    // swapping current blank element and future blank element in DOM tree
    parentNode.insertBefore(futureBlankElement.obj, elementAfterCurrentBlankElement.obj)
    parentNode.insertBefore(currentBlankElement.obj, elementAfterFutureBlankElement.obj)
    // checking for win and if not than changing listeners
    if (this.checkIfWin() && this.mixCompleted) this.win()
    else this.changeListeners()
  }

  changeListeners () {
    // removing all listeners
    this.elementsWithListener.forEach((el) => { this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === el)[0].obj.onclick = '' })
    this.elementsWithListener = []

    // checking data of elements around new blank element and if element with given data exists he gets listener
    if (this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === this.positionOfBlankPuzzleElement - config.puzzleSize)[0] !== undefined) {
      this.elementsWithListener.push(this.positionOfBlankPuzzleElement - config.puzzleSize)
    }
    if (this.positionOfBlankPuzzleElement % config.puzzleSize !== 0) {
      this.elementsWithListener.push(this.positionOfBlankPuzzleElement + 1)
    }
    if (this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === this.positionOfBlankPuzzleElement + config.puzzleSize)[0] !== undefined) {
      this.elementsWithListener.push(this.positionOfBlankPuzzleElement + config.puzzleSize)
    }
    if ((this.positionOfBlankPuzzleElement % config.puzzleSize) - 1 !== 0) {
      this.elementsWithListener.push(this.positionOfBlankPuzzleElement - 1)
    }

    this.elementsWithListener.forEach(el => { this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === el)[0].obj.onclick = (e) => { this.move(e) } })
  }

  checkIfWin () {
    /*
    * when moving program only changes element.obj.data and element.data stays the same
    * to win every elements obj.data have to match with its data
    */
    for (let i = 0; i < this.puzzleElements.length; i++) {
      if (this.puzzleElements[i].data !== this.puzzleElements[i].obj.data) return false
    }

    return true
  }

  win () {
    this.puzzleElements.forEach((puzzleElement) => { puzzleElement.obj.onclick = '' })
    this.elementsWithListener = []

    this.popUpWindow.style.display = 'block'
  }

  reshuffle () {
    // variable with such structure is expected by move function
    const element = {
      target: {
        data: 0
      }
    }

    /*
    * getting random number which will represent one of elements around current blank element
    * for egzample (x is a current blank element, numbers from 0 to 3 are element around, '.' is any other element)
    * . 0 .
    * 3 x 1
    * . 2 .
    * than while loop will check if element with given position exists and if it does program will make a move
    * if it doesnt it will get new random direction
    */
    let direction = Math.floor(Math.random() * 4)
    let breakFromLoop = false

    while (!breakFromLoop) {
      switch (direction) {
        case 0:
          if (this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === this.positionOfBlankPuzzleElement - config.puzzleSize)[0] !== undefined) {
            element.target.data = this.positionOfBlankPuzzleElement - config.puzzleSize
            breakFromLoop = true
          } else {
            direction = Math.floor(Math.random() * 3)
          }
          continue
        case 1:
          if (this.positionOfBlankPuzzleElement % config.puzzleSize !== 0) {
            element.target.data = this.positionOfBlankPuzzleElement + 1
            breakFromLoop = true
          } else {
            direction = Math.floor(Math.random() * 3)
          }
          continue
        case 2:
          if (this.puzzleElements.filter(puzzleElement => puzzleElement.obj.data === this.positionOfBlankPuzzleElement + config.puzzleSize)[0] !== undefined) {
            element.target.data = this.positionOfBlankPuzzleElement + config.puzzleSize
            breakFromLoop = true
          } else {
            direction = Math.floor(Math.random() * 3)
          }
          continue

        case 3:
          if (this.positionOfBlankPuzzleElement % config.puzzleSize - 1 !== 0) {
            element.target.data = this.positionOfBlankPuzzleElement - 1
            breakFromLoop = true
          } else {
            direction = Math.floor(Math.random() * 3)
          }
          continue
      }
    }

    // timeout wchich will make random moves till board is reshuffled
    this.timeoutId = setTimeout(() => {
      // board will reshuffle till mixCounter is equal to config.puzzleSize * config.puzzleSize * 4
      if (this.mixCounter === config.puzzleSize * config.puzzleSize * 4) {
        this.mixCounter = 0
        this.mixCompleted = true
        return true
      }
      this.mixCounter++

      this.move(element)
      this.reshuffle()
    }, 100 / config.puzzleSize) // the more elements the faster reshuffle needs to be
  }

  closePopUpWindows () {
    this.popUpWindow.style.display = 'none'
  }
}

export default Board
