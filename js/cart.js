const cart = (
  function(){
    function createItemToCart(productId, quantity, thumbImageURL, productName, discountPrice, totalPrice){
      return {
        item_id: productId,
        quantity,
        thumb_URL: thumbImageURL,
        name: productName,
        discount_price: discountPrice,
        total_price: totalPrice
      }
    }
    function addNewItem(productId, quantity, thumbImageURL, productName, discountPrice, totalPrice){
      let item = JSON.parse(sessionStorage.getItem(productId))
      let flagAlreadyExisted = false
      if(item !== null){
        flagAlreadyExisted = true
        quantity = parseInt(quantity) + parseInt(item.quantity)
      }
      let newItem = createItemToCart(productId, quantity, thumbImageURL, productName, discountPrice, totalPrice)
      sessionStorage.setItem(newItem.item_id, JSON.stringify(newItem))
      
      newItem.existsInDOM = flagAlreadyExisted
      
      return newItem
    }
    function loadAllItems(){
      const items = []
      let sessionStorageLength = sessionStorage.length
      for(let i = 0; i <= sessionStorageLength; i++){
        let item = sessionStorage.getItem(`item-cart-${i}`)
        if(item !== null){
          item = JSON.parse(item)
          items.push(item)
        }
      }
      return items
    }
    function getCartSize(){
      const items = loadAllItems()
      let total = 0
      for(let {quantity} of items){
        total += parseInt(quantity)
      }
      return total
    }
    function deleteItem(productId){
      sessionStorage.removeItem(productId)
    }

    return {
      addNewItem,
      getCartSize,
      loadAllItems,
      deleteItem
    }
  }
)()
