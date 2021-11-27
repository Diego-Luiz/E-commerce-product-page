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
    manageItemsCounter(cart.getCartSize())
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
              const thumbImageURL = `images/image-product-${productId.split('-')[2]}.thumbnail.jpg`
              const productName = document.querySelector('.product__name').textContent.trim()
              let discountPrice = document.querySelector('.price-discount').textContent.trim()
              discountPrice = discountPrice.replace('$', '')
              let totalPrice = document.querySelector('.full-price').textContent.trim()
              totalPrice = totalPrice.replace('$', '')
              cart.addNewItem(productId, quantity, thumbImageURL, productName, discountPrice, totalPrice)
              manageItemsCounter(cart.getCartSize())
              updateCartItems()
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
    }

    function updateCartItems(){
      const items = cart.loadAllItems()
      items.forEach((element) => {
        createDOMCartElement(element)
      })
    }

    // <section class="cart-section">
    //   <h3 class="cart-section__title">Cart</h3>
    //   <div class="cart-section__body">
    //     <p class="empty-msg">Your cart is empty.</p>
    //     <ul class="cart-section__products">
    //       <li>
    //         <a href="#" class="product">
    //           <img src="images/image-product-1-thumbnail.jpg" alt="" class="product__thumb">
    //           <div class="product__abstract">
    //             <h4 class="title">Autumn Limited Edition</h4>
    //             <div class="price-calculation">
    //               <div class="price-calculation__value">
    //                 &dollar;
    //                 <span class="value__span">125.00</span>
    //                 <span class="sr-only">dollars</span>
    //                 <span class="sr-only">by</span>
    //                 <span aria-hidden="true">x</span>
    //                 <span class="quantity">3</span>
    //               </div>
    //             </div>
    //             <p class="price-calculation__final-price">
    //               &dollar; 
    //               <span class="final-price__span">375.00</span>
    //               <span class="sr-only">dollars on total</span> 
    //             </p>
    //           </div>
    //           <button type="button" class="btn-del-product">
    //             <span class="sr-only">Delete this product</span>
    //             <img src="images/icon-delete.svg" alt="">
    //           </button>
    //         </a>
    //       </li>
    //     </ul>

    //     <button type="button" class="cart-section__btn-checkout">Checkout</button>
    //   </div>

    // item_id: productId,
    // quantity,
    // thumb_URL: thumbImageURL,
    // name: productName,
    // discount_price: discountPrice,
    // total_price: totalPrice

    // </section>
    function createDOMCartElement(item){
      console.log(item)
      const li = document.createElement('li')
      const productContainerA = document.createElement('a')
      const imgProduct = document.createElement('img')
      const productAbstractDiv = document.createElement('div')
      const productTitle = document.createElement('h4')
      const priceCalculationDiv = document.createElement('div')
      const dollarEntity = "&dollar;"
      const priceValueDiv = document.createElement('div')
      const valueSpan = document.createElement('span')
      const dollarsSpan1 = document.createElement('span')
      const bySpan = document.createElement('span')
      const xSpan = document.createElement('span')
      const quantitySpan = document.createElement('span')
      const finalPriceP = document.createElement('p')
      const finalSpan = document.createElement('span')
      const textTotalDollarsSpan = document.createElement('span')
      const deleteProductBtn = document.createElement('button')
      const textDeleteSpan = document.createElement('span')
      const imgDelete = document.createElement('img')

      productContainerA.href = "#"
      productContainerA.className = "product"
      imgProduct.src = item.thumb_URL
      imgProduct.className = "product__thumb"
      productAbstractDiv.className = "product__abstract"
      productTitle.className = "title"
      productTitle.textContent = item.name

      priceCalculationDiv.className = "price-calculation"
      
      priceValueDiv.className = "price-calculation__value"
      valueSpan.className = "value__span"
      valueSpan.textContent = item.discount_price
      dollarsSpan1.className = "sr-only"
      dollarsSpan1.textContent = "dollars"
      bySpan.className = "sr-only"
      bySpan.textContent = "by"
      xSpan.ariaHidden = true
      xSpan.textContent = "x"
      quantitySpan.className = "quantity"
      quantitySpan.textContent = item.quantity

      finalPriceP.className = "price-calculation__final-price"
      finalSpan.className = "final-price__span"
      finalSpan.textContent = item.total_price
      textTotalDollarsSpan.className = "sr-only"
      textTotalDollarsSpan.textContent = "dollars on total"

      deleteProductBtn.type = "button"
      deleteProductBtn.className = "btn-del-product"
      textDeleteSpan.className = "sr-only"
      textDeleteSpan.textContent = "Delete this product"
      imgDelete.src = "images/icon-delete.svg"


      deleteProductBtn.appendChild(textDeleteSpan)
      deleteProductBtn.appendChild(imgDelete)

      finalPriceP.innerHTML = dollarEntity
      finalPriceP.appendChild(finalSpan)
      finalPriceP.appendChild(textTotalDollarsSpan)

      priceValueDiv.innerHTML = dollarEntity
      priceValueDiv.appendChild(valueSpan)
      priceValueDiv.appendChild(dollarsSpan1)
      priceValueDiv.appendChild(bySpan)
      priceValueDiv.appendChild(xSpan)
      priceValueDiv.appendChild(quantitySpan)

      priceCalculationDiv.appendChild(priceValueDiv)
    }

  }
)()