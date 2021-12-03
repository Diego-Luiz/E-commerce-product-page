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
    const productSlider = document.querySelector('.product__slider')
    const cartProducts = document.querySelector('.cart-section__products')
    const emptyMsg = document.querySelector('.empty-msg')
    const cartBody = document.querySelector('.cart-section__body')
    const lightbox = document.querySelector('.lightbox')
    
    let productIndex = 0
    inputProductQuantity.value = 0
    manageItemsCounter(cart.getCartSize())
    updateCartItems()
    navBtn.addEventListener('click', toggleMenu)
    mainNavCloseBtn.addEventListener('click',toggleMenu)
    btnCart.addEventListener('click', toggleCart)
    btnUser.addEventListener('click', toggleBtnCheckout)
    productSlider.addEventListener('click', manageProductClicks)
    cartForm.addEventListener('click', manageFormClicks)
    cartSection.addEventListener('click', manageCartClicks)
    lightbox.addEventListener('click', manageProductClicks)
    
    function toggleDocumentOverflow(){
      document.documentElement.classList.toggle('--overflow-hidden')
      document.body.classList.toggle('--overflow-hidden')
    }
    function toggleMenu(){
      toggleDocumentOverflow()
      mainNav.classList.toggle('active')
      mainNav.ariaHidden = false
      mainNav.ariaExpanded = true
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
      btnCart.classList.toggle('--active')
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
      if(!element.matches(`.cart-form, #product__quantity, .cart-form__input-container`)){
        if(element.matches(`.icon-cart, .cart-form__add-btn`)){
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
              const productId = productSlider.querySelector('.image-box__src').getAttribute('data-product-id')
              const thumbImageURL = `images/image-product-${productId.split('-')[2]}-thumbnail.jpg`
              const productName = document.querySelector('.product__name').textContent.trim()
              let discountPrice = document.querySelector('.discount-price__value').textContent.trim()
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
          if(element.matches(`.plus-item, .icon-plus`)){
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
      if(element.matches('.icon-close, .product__slider___btn-close-lightbox') || event.key === "Escape"){
        setTimeout(() => lightbox.style.display = '', 200)
        toggleDocumentOverflow()
        lightbox.children[0].remove()
        document.body.removeEventListener('keydown', manageProductClicks)
      }
      else if(element.matches(`.icon, [class*='btn']`) || event.key){
        if(element.matches('.icon')){
          element = element.closest('button')
        }
        if(event.key){
          element = element.querySelector('.lightbox .image-box__src')
        }
        else{
          element = element.parentElement.querySelector('.image-box__src')
        }
        let product = element.getAttribute('data-product-id')
        let operation = element.classList.contains('btn-nextImage') || event.key === "ArrowRight" ? '+' : '-'
        slideProductImage(operation, product, element)
      }
      else if(element.matches('[data-thumb-index]')){
        let product = element.closest('.product__slider').querySelector('.image-box__src')
        productIndex = element.getAttribute('data-thumb-index')
        slideProductImage('',product.getAttribute('data-product-id'), product)
      }
      else if(!getDocumentOverflowStatus() && element.matches('.image-box__src') && window.matchMedia(`(min-width: 992px)`).matches){
        toggleDocumentOverflow()
        zoomProductImage(element)
      }
    }
    function getDocumentOverflowStatus(){
      return document.body.classList.contains('--overflow-hidden')
    }
    function zoomProductImage(image){
      const productSlider = image.closest('.product__slider')
      const clonedElement = productSlider.cloneNode(true)
      document.body.addEventListener('keydown', manageProductClicks)
      clonedElement.classList.add('--lightbox-active')
      lightbox.appendChild(clonedElement)
      setTimeout(() => lightbox.style.display = 'flex', 200)
    }
    function slideProductImage(operator, productId, image){
      let productImagesLength = products.get(productId).length - 1
      if(operator === '+'){
        productIndex = productIndex < productImagesLength ? productIndex + 1 : 0  
      }
      else if(operator === '-'){
        productIndex = productIndex > 0 ? productIndex - 1 : productImagesLength
      }
      let {full_img_url: fullImgURL} = products.get(productId)[productIndex]
      image.classList.add('--changed')
      setTimeout(() => {
        image.classList.remove('--changed')
        image.src = fullImgURL
      }, 200)
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
          //if the element is already on the cart, just update its quantity and final price
          if(element.existsInDOM){
            const elementInDOM = document.querySelector(`[data-item-id=${element.item_id}]`)
            elementInDOM.querySelector('.price-calculation__value .quantity').textContent = element.quantity
            elementInDOM.querySelector('.final-price__span').textContent = (parseInt(element.discount_price) * parseInt(element.quantity)).toFixed(2)
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
        <a href="#" class="list-item" data-item-id=${item.item_id}>
          <img src="${item.thumb_URL}" alt="" class="product__thumb">
          <div class="list-item__abstract">
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