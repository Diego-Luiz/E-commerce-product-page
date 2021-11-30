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
    const cartProducts = document.querySelector('.cart-section__products')
    const emptyMsg = document.querySelector('.empty-msg')
    const btnCheckout = document.querySelector('.cart-section__btn-checkout')
    const cartBody = document.querySelector('.cart-section__body')

    inputProductQuantity.value = 0
    manageItemsCounter(cart.getCartSize())
    updateCartItems()
    navBtn.addEventListener('click', toggleMenu)
    mainNavCloseBtn.addEventListener('click',toggleMenu)
    btnCart.addEventListener('click', toggleCart)
    productImage.addEventListener('click', manageProductClicks)
    cartForm.addEventListener('click', manageFormClicks)
    cartSection.addEventListener('click', manageCartClicks)
    
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
            if(quantity === "0"){
              alert('Please determine the product quantity.')
            }
            else{
              const productId = productImage.querySelector('.image').id
              const thumbImageURL = `images/image-product-${productId.split('-')[2]}-thumbnail.jpg`
              const productName = document.querySelector('.product__name').textContent.trim()
              let discountPrice = document.querySelector('.price-discount').textContent.trim()
              discountPrice = discountPrice.replace('$', '')
              let totalPrice = document.querySelector('.full-price').textContent.trim()
              totalPrice = totalPrice.replace('$', '')
              const newItem = cart.addNewItem(productId, quantity, thumbImageURL, productName, discountPrice, totalPrice)
              manageItemsCounter(cart.getCartSize())
              updateCartItems([newItem])
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
      if(!itemsCounter.classList.contains('active') && quantity > 0){
        itemsCounter.classList.add('active')
      }
      else if(quantity <= 0){
        itemsCounter.classList.remove('active')
      }
    }

    function manageCartClicks(event){
      let element = event.target 
      if(element.matches("img:not(.product__thumb)")){
        element = element.parentElement
      }
      if(element.classList.contains('btn-del-product')){
        const itemToDelete = element.closest('[data-item-id]')
        cart.deleteItem(itemToDelete.getAttribute('data-item-id'))
        itemToDelete.parentElement.remove()
        manageItemsCounter(cart.getCartSize())
        toggleCartProducts()
      }
    }
    function updateCartItems(item){
      const items = item || cart.loadAllItems()
      if(items.length > 0){
        
        // btnCheckout.classList.add('--active')
        toggleCartProducts()
        items.forEach(element => {
          //if the element is already on the cart, just update its quantity
          if(element.existsInDOM){
            const elementQuantity = document.querySelector(
              `[data-item-id=${element.item_id}] .price-calculation__value .quantity`
            )
            elementQuantity.textContent = element.quantity
          }
          else{
            cartProducts.appendChild(createDOMCartElement(element))
          }
        })
      }
      
    }
    function toggleCartProducts(){
      emptyMsg.classList.toggle('--deactivate')
      cartProducts.classList.toggle('--active')
      cartBody.classList.toggle('--with-items')
    }
    function createDOMCartElement(item){
      const li = document.createElement('li')
      const liContent = `
        <a href="#" class="product" data-item-id=${item.item_id}>
          <img src="${item.thumb_URL}" alt="" class="product__thumb">
          <div class="product__abstract">
            <h4 class="title">${item.name}</h4>
              <div class="price-calculation">
                <div class="price-calculation__value">
                  &dollar;
                  <span class="value__span">${item.discount_price}</span>
                  <span class="sr-only">dollars</span>
                  <span class="sr-only">by</span>
                  <span aria-hidden="true">x</span>
                  <span class="quantity">${item.quantity}</span>
                </div>
              </div>
              <p class="price-calculation__final-price">
                &dollar; 
                <span class="final-price__span">${item.total_price}</span>
                <span class="sr-only">dollars on total</span> 
              </p>
          </div>
          <button type="button" class="btn-del-product">
            <span class="sr-only">Delete this product</span>
            <img src="images/icon-delete.svg" alt="">
          </button>
        </a>
      `
      li.innerHTML = liContent
      return li
    }

    

  }
)()