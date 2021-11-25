const Cart = (
  function(){
    function createItemToCart(productId, quantity){
      return {
        item_id: productId,
        quantity 
      }
    }
    function addNewItem(productId, quantity){
      const newItem = createItemToCart(productId, quantity)
      sessionStorage.setItem(newItem.item_id, JSON.stringify(newItem))
    }
    function loadAllItems(){
      //
    }
    function getCartSize(){
      let sessionStorageLength = sessionStorage.length
      let counter = 0
      for(let i = 0; i < sessionStorageLength; i++){
        let item = sessionStorage.getItem(`item-cart-${i}`)
        if(item !== null){
          item = JSON.parse(item)
          counter += parseInt(item.quantity)
        }
      }
      return counter
    }
    return {
      addNewItem,
      getCartSize
    }
  }
)()
