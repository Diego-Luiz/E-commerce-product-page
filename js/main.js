(
  function(){
    const navBtn = document.querySelector('.top-header__left .nav-btn')
    const mainNav = document.querySelector('.top-header__left .main-nav')
    const mainNavCloseBtn = document.querySelector('.main-nav__close-btn')
    const mainNavContentContainer = document.querySelector('.main-nav__content-container')
    const btnCart = document.querySelector('.top-header__btn-cart')
    const btnUser = document.querySelector('.top-header .user-container')
    const cartSection = document.querySelector('.cart-section')
    const itemsCounter = document.querySelector('.top-header__btn-cart .items-quantity')
    const cartForm = document.querySelector('.cart-form')
    const inputProductQuantity = document.getElementById('product__quantity') 
    const productImage = document.querySelector('.product__image')
    const cartProducts = document.querySelector('.cart-section__products')
    const emptyMsg = document.querySelector('.empty-msg')
    const cartBody = document.querySelector('.cart-section__body')

    let productIndex = 0

    inputProductQuantity.value = 0
    manageItemsCounter(cart.getCartSize())
    updateCartItems()
    navBtn.addEventListener('click', toggleMenu)
    mainNavCloseBtn.addEventListener('click',toggleMenu)
    btnCart.addEventListener('click', toggleCart)
    btnUser.addEventListener('click', toggleBtnCheckout)
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
      if(cartSection.classList.contains('active')){
        cartSection.style.display = "none"
      }
      else{
        cartSection.style.display = "block"
      }
      setTimeout(() => cartSection.classList.toggle('active'), 100)
      let src = "images/icon-cart-black.svg"
      if(btnCart.classList.contains('active')){
        src = "images/icon-cart.svg"
      }
      btnCart.querySelector('img').src = src
      btnCart.classList.toggle('active')
    }
    function toggleCartProducts(){
      if(cart.getCartSize() <= 0 && emptyMsg.classList.contains('--deactivate')){
        emptyMsg.classList.remove('--deactivate')
        cartProducts.classList.remove('--active')
        cartBody.classList.remove('--with-items')
      }
      else{
        emptyMsg.classList.add('--deactivate')
        cartProducts.classList.add('--active')
        cartBody.classList.add('--with-items')
      }
    }
    function toggleBtnCheckout(){
      const btnCheckout = document.querySelector('.cart-section__btn-checkout')
      btnCheckout.classList.toggle('--active')
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
              inputProductQuantity.value = 0
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
          }
          else{
            alert('Invalid quantity of the product!')
            inputProductQuantity.value = 0
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
      if(!element.matches('.image')){
        if(element.matches('img')){
          element = element.closest('button')
        }
        let productId = element.parentElement.querySelector('.product__image .image').id
        if(element.classList.contains('btn-previousImage')){
          slideProductImage('-', productId, element)
        }
        else{
          slideProductImage('+', productId, element)
        }
      }
      else{
        console.log('zoom the image')
      }
    }
    function slideProductImage(operator, productId, element){
      let productImagesLength = products.get(productId).length - 1
      if(operator === '+'){
        productIndex = productIndex < productImagesLength ? productIndex + 1 : 0  
      }
      else{//previous
        productIndex = productIndex > 0 ? productIndex - 1 : productImagesLength
      }
      let {full_img_url: fullImgURL} = products.get(productId)[productIndex]
      const image = element.parentElement.querySelector('.image')
      image.classList.add('--changed')
      image.src = fullImgURL
      setTimeout(() => image.classList.remove('--changed'), 200)
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
                <span class="final-price__span">${(item.discount_price * item.quantity).toFixed(2)}</span>
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