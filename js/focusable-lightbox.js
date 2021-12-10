class Modal{
  #keysPressed
  constructor(element){
    this.lightbox = element
    this.handlerPressed = this.keyPressed.bind(this)
    this.handlerReleased = this.keyReleased.bind(this)
    this.lightbox.addEventListener('keydown', this.handlerPressed, true)
    this.lightbox.addEventListener('keyup', this.handlerReleased, true)
    this.focusableElements = element.querySelectorAll(`
      button:not([disabled]), a[href]:not([disabled]), input:not([disabled]), 
      select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])`
    )
    this.focusableElements = Array.from(this.focusableElements).filter( element => {
      if(element.matches(`.image-box__src`)){
        element.removeAttribute('tabindex')
      }
      else{
        return element
      }
    })
    this.focusableElements[0].focus()
    this.actualIndex = 0
    this.lastElementIndex = this.focusableElements.length - 1
    this.#keysPressed = {}
  }
  
  keyPressed(event){
    this.#keysPressed[event.key] = true
    if(this.#keysPressed['Shift'] && this.#keysPressed['Tab']){
      if(this.actualIndex === 0){
        event.preventDefault()
        this.actualIndex = this.lastElementIndex
        this.focusableElements[this.actualIndex].focus()
      }
      else{
        this.actualIndex = this.actualIndex - 1
      }
    }
    else if(this.#keysPressed['Tab']){
      if(this.actualIndex === this.lastElementIndex){
        event.preventDefault()
        this.actualIndex = 0
        this.focusableElements[this.actualIndex].focus()
      }
      else{
        this.actualIndex = this.actualIndex + 1
      }
    }
    else if(this.#keysPressed['Escape']){
      setTimeout(() => {
        this.lightbox.style.display = ''
        this.removeEvents()
        mainJs.toggleDocumentOverflow()
      }, 200)
    }
  }
  keyReleased(event){
    delete this.#keysPressed[event.key]
  }
  removeEvents(){
    this.lightbox.removeEventListener('keydown', this.handlerPressed, true)
    this.lightbox.removeEventListener('keyup', this.handlerReleased, true)
  }
}