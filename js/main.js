(
  function(){
    const navBtn = document.querySelector('.top-header__left .nav-btn')
    const mainNav = document.querySelector('.top-header__left .main-nav')
    const mainNavCloseBtn = document.querySelector('.main-nav__close-btn')
    const mainNavContentContainer = document.querySelector('.main-nav__content-container')
    const btnCart = document.querySelector('.top-header__btn-cart')
    const cartSection = document.querySelector('.cart-section')
    const itemsCounter = document.querySelector('.top-header__btn-cart .items-quantity')
    const cartForm = document.querySelector('.cart-form')
    const inputProductQuantity = document.getElementById('product__quantity') 
    const productImage = document.querySelector('.product__image')
    
    inputProductQuantity.value = 0
    manageItemsCounter(Cart.getCartSize())
    navBtn.addEventListener('click', toggleMenu)
    mainNavCloseBtn.addEventListener('click',toggleMenu)
    btnCart.addEventListener('click', toggleCart)
    productImage.addEventListener('click', manageProductClicks)
    cartForm.addEventListener('click', manageFormClicks)
    
    function toggleMenu(){
      document.documentElement.classList.toggle('--overflow-hidden')
      document.body.classList.toggle('--overflow-hidden')
      mainNav.classList.toggle('active')
      mainNavContentContainer.classList.toggle('active')
    }
    
    function toggleCart(){
      cartSection.style.display = "block"
      setTimeout(() => cartSection.classList.toggle('active'), 100)
      let src = "images/icon-cart-black.svg"
      if(btnCart.classList.contains('active')){
        src = "images/icon-cart.svg"
      }
      btnCart.querySelector('img').src = src
      btnCart.classList.toggle('active')
    }

    function manageFormClicks(event){
      let element = event.target
      if(!element.matches('.cart-form, #product__quantity')){
        if(element.matches('img')){
          element = element.parentElement
        }
        if(element.matches('.cart-form__add-btn')){
          const notValidEntries = ['+', '-', 'e']
          let validFlag = true
          let quantity = inputProductQuantity.value
          notValidEntries.forEach(element => {
            if(quantity.indexOf(element) !== -1){
              validFlag = false
            }
          })
          if(validFlag){
            const productId = productImage.querySelector('.image').id
            if(quantity === "0"){
              alert('Please determine the product quantity.')
            }
            else{
              Cart.addNewItem(productId, quantity)
              manageItemsCounter(Cart.getCartSize())
            }
            inputProductQuantity.value = 0
          }
          else{
            alert('Invalid quantity of the product!')
          }
        }
        else{
          let newValue = 0
          if(element.classList.contains('plus-btn')){
            newValue = parseInt(inputProductQuantity.value) + 1
          }
          else if(inputProductQuantity.value != "0"){
            newValue = parseInt(inputProductQuantity.value) - 1
          }
          inputProductQuantity.value = newValue
        }
        
      }
    }

    function manageProductClicks(event){
      let element = event.target
      console.log(element)
      if(!element.matches('.image')){
        console.log('button!')
        if(element.matches('img')){
          element = element.parentElement
        }
        if(element.classList.contains('btn-previousImage')){
          console.log('previous')
        }
        else{
          console.log('next')
        }
      }
      else{
        console.log('zoom the image')
      }
    }

    function manageItemsCounter(quantity){
      itemsCounter.querySelector('.value').textContent = quantity
      if(!itemsCounter.classList.contains('active')){
        itemsCounter.classList.add('active')
      }
    }

  }
)()