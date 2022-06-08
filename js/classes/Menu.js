import config from '../config.js'
import Board from './Board.js'

class Menu extends Board {
  menuObj
  startBtn
  selectDifficulty
  karuzela
  imageObjs = []
  leftArrow
  rightArrow

  constructor () {
    super()

    this.menuObj = document.getElementById('menu')

    this.startBtn = document.getElementById('play-btn')
    this.startBtn.onclick = () => { this.resetDefaultValues() }

    // option tags are not implemented staticly because one of them needs selected atributed
    this.selectDifficulty = document.getElementById('menu-select')
    for (let i = 2; i < 26; i++) {
      const option = document.createElement('option')

      if (i === config.puzzleSize) {
        option.selected = 'selected'
      }

      option.innerText = i
      option.value = i
      this.selectDifficulty.appendChild(option)
    }

    this.selectDifficulty.oninput = (e) => {
      config.puzzleSize = Number(e.target.value)
      this.resetDefaultValues()
    }

    this.karuzela = document.getElementById('karuzela')

    this.leftArrow = document.getElementById('left-arrow-btn')
    this.leftArrow.onclick = () => { this.turnLeft() }

    // adding (if possible) default image and images next to it
    const index = config.allImages.indexOf(config.currentImage)
    let imageObj
    const images = document.getElementById('image-container')
    if (index - 1 >= 0) {
      imageObj = document.createElement('div')
      imageObj.className = 'image'
      imageObj.style.backgroundImage = `url(../../assets/${config.allImages[index - 1]})`
      this.imageObjs.push(imageObj)
      images.appendChild(imageObj)
    } else {
      imageObj = document.createElement('div')
      imageObj.className = 'image'
      this.imageObjs.push(imageObj)
      images.appendChild(imageObj)
    }

    if (config.allImages.length > 0) {
      imageObj = document.createElement('div')
      imageObj.className = 'image'
      imageObj.style.backgroundImage = `url(../../assets/${config.allImages[index]})`
      this.imageObjs.push(imageObj)
      images.appendChild(imageObj)
    }

    if (index + 1 < config.allImages.length) {
      imageObj = document.createElement('div')
      imageObj.className = 'image'
      imageObj.style.backgroundImage = `url(../../assets/${config.allImages[index + 1]})`
      this.imageObjs.push(imageObj)
      images.appendChild(imageObj)
    } else {
      imageObj = document.createElement('div')
      imageObj.className = 'image'
      this.imageObjs.push(imageObj)
      images.appendChild(imageObj)
    }

    this.rightArrow = document.getElementById('right-arrow-btn')
    this.rightArrow.onclick = () => { this.turnRight() }
  }

  turnLeft () {
    let index
    if (config.allImages.indexOf(config.currentImage) - 1 >= 0) {
      index = config.allImages.indexOf(config.currentImage) - 1
    } else {
      return false
    }

    // shifting images left if possible and reseting puzzle board
    if (index - 1 >= 0) {
      this.imageObjs[0].style.backgroundImage = `url(../../assets/${config.allImages[index - 1]})`
    } else {
      this.imageObjs[0].style.backgroundImage = ''
    }

    this.imageObjs[1].style.backgroundImage = `url(../../assets/${config.allImages[index]})`
    config.currentImage = config.allImages[index]

    if (index + 1 < config.allImages.length) {
      this.imageObjs[2].style.backgroundImage = `url(../../assets/${config.allImages[index + 1]})`
    } else {
      this.imageObjs[2].style.backgroundImage = ''
    }

    this.resetDefaultValues()
  }

  turnRight () {
    let index
    if (config.allImages.indexOf(config.currentImage) + 1 < config.allImages.length) {
      index = config.allImages.indexOf(config.currentImage) + 1
    } else {
      return false
    }

    // shifting images right if possible and reseting puzzle board
    if (index - 1 >= 0) {
      this.imageObjs[0].style.backgroundImage = `url(../../assets/${config.allImages[index - 1]})`
    } else {
      this.imageObjs[0].style.backgroundImage = ''
    }

    this.imageObjs[1].style.backgroundImage = `url(../../assets/${config.allImages[index]})`
    config.currentImage = config.allImages[index]

    if (index + 1 < config.allImages.length) {
      this.imageObjs[2].style.backgroundImage = `url(../../assets/${config.allImages[index + 1]})`
    } else {
      this.imageObjs[2].style.backgroundImage = ''
    }

    this.resetDefaultValues()
  }
}

export default Menu
