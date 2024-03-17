// since we use async aatribute i.e. JavaScript file and html file load at the same time so we check if the current state of html document is still loading while our JavaScript file has completely loaded, which means that JavaScript won't be able to find the html elements that we are accessing, since the html document is still being loaded
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready) // add an event listener which listens for DOMContentLoaded event, i.e. the html is now fully loaded, and when this event occurs, call the 'ready' function
} else {
    ready() // if condition is false i.e. html document has already been loaded, run the ready function anyway, without waiting for the DOMContentLoaded event (because this event has already occured in case html file loads before JavaScript file)
}

function ready() { // has the code for our button
    // Removing item form cart
    var removeCartItemButtons = document.getElementsByClassName("btn-danger") // get all buttons with this class name
    for (var i = 0; i < removeCartItemButtons.length; i++) { // loop through the buttons
        var button = removeCartItemButtons[i] // get the current button
        button.addEventListener("click", removeCartItem) // listen for the "click" event for the button, and remove item from cart
    }

    // Updating total price if quantity is changed
    var quantityInputs = document.getElementsByClassName("cart-quantity-input") // get quantity input elements
    for (var i = 0; i < quantityInputs.length; i++) { // loop through the inputs
        var input = quantityInputs[i] // get the current input element
        input.addEventListener("change", quantityChanged) // listen for the "change" event, and use changed quantity to update total
    }

    // Adding item to cart
    var addToCartButtons = document.getElementsByClassName("shop-item-button") // get all ADD TO CART buttons
    for (var i = 0; i < addToCartButtons.length; i++) { // loop through the buttons
        var button = addToCartButtons[i] // get the current button
        button.addEventListener("click", addToCartClicked) // listen for the click event, and call this function
    }

    // Purchase button
    document.getElementsByClassName("btn-purchase")[0].addEventListener("click", purchaseClicked)
}

function purchaseClicked() {
    alert("Thank you for your purchase")
    var cartItems = document.getElementsByClassName("cart-items")[0] // get the first one of cart-items
    while (cartItems.hasChildNodes()) { // returns whether node has children
        cartItems.removeChild(cartItems.firstChild) // firstChild returns the first child and removeChild removes a child
    }
    updateCartTotal()
}

function removeCartItem(event) { // event object has all the information about the event occured (e.g. button clicked)
    var buttonClicked = event.target // target attribute returns the DOM element that triggered the event (e.g. button)
    buttonClicked.parentElement.parentElement.remove() // removing the parent to parent element of the clicked (REMOVE) button
    updateCartTotal()
}

function quantityChanged(event) { 
    var input = event.target // get the target input element that triggered the event
    if (isNaN(input.value) || input.value <= 0) { // if the input value in not a number (i.e. blank), or if it is a negative no.
        input.value = 1 // set it back to 1, which is the lowest possible quantity of an item that someone can buy
    }
    updateCartTotal()
}

function addToCartClicked(event) { // function that gets the details of the item we want to add to cart
    var button = event.target // get the target button that triggered the event
    var shopItem = button.parentElement.parentElement // get the parent to parent element of the ADD TO CART button, i.e. shop-item class, which has the title, price and image of the item
    var title = shopItem.getElementsByClassName("shop-item-title")[0].innerText // get inner text of first element in the array
    var price = shopItem.getElementsByClassName("shop-item-price")[0].innerText
    var imageSrc = shopItem.getElementsByClassName("shop-item-image")[0].src
    addItemToCart(title, price, imageSrc) // function that adds the item to cart
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    // checking if we've already added that element to the cart
    var cartItemNames = document.getElementsByClassName("cart-item-title") // using titles for this check
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) { // if it's equal to the title of our current item that we want to add
            alert ("This item has already been added to the cart") // then alert the user, alert is just a pop up box that user can click OK to exit from
            return // return from this addItemToCartFunction and don't execute the rest of the code of this function, i.e. don't add item to cart
        }
    }

    // DOM Manipulation
    var cartItems = document.getElementsByClassName("cart-items")[0]
    var cartRow = document.createElement("div")
    cartRow.setAttribute("class", "cart-row")
    var cartItem = document.createElement("div")
    cartItem.setAttribute("class", "cart-item cart-column")
    var cartItemImage = document.createElement("img")
    cartItemImage.setAttribute("class", "cart-item-image")
    cartItemImage.setAttribute("src", imageSrc)
    var cartItemTitle = document.createElement("span")
    cartItemTitle.setAttribute("class", "cart-item-title")
    cartItemTitle.innerText = title
    var cartPrice = document.createElement("span")
    cartPrice.setAttribute("class", "cart-price cart-column")
    cartPrice.innerText = price
    var cartQuantity = document.createElement("div")
    cartQuantity.setAttribute("class", "cart-quantity cart-column")
    var cartQuantityInput = document.createElement("input")
    cartQuantityInput.setAttribute("class", "cart-quantity-input")
    cartQuantityInput.setAttribute("type", "number")
    cartQuantityInput.setAttribute("value", "1")
    var removeButton = document.createElement("button")
    removeButton.setAttribute("class", "btn btn-danger")
    removeButton.setAttribute("type", "button")
    removeButton.innerText = "REMOVE"
    
    cartItem.append(cartItemImage, cartItemTitle)
    cartQuantity.append(cartQuantityInput, removeButton)
    cartRow.append(cartItem, cartPrice, cartQuantity)
    cartItems.append(cartRow)

    // add an event listener for the remove button and the quantity change for this newly added item to the cart
    cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", removeCartItem)
    cartRow.getElementsByClassName("cart-quantity-input")[0].addEventListener("change", quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName("cart-items")[0] // get the first container (getElements return an array of elements, but we only want the first one)
    var cartRows = cartItemContainer.getElementsByClassName("cart-row") // get all cart rows
    total = 0
    for (var i = 0; i < cartRows.length; i++) { // loop through the cart rows
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName("cart-price")[0] // get price element (the first one)
        var quantityElement = cartRow.getElementsByClassName("cart-quantity-input")[0] // get quantity element (the first one)
        var price = parseFloat(priceElement.innerText.replace("$", "")) // get inner text of price element, replace $ with empty string so that we can perform operations on the text, and convert the text to float using parseFloat
        var quantity = quantityElement.value // quantity is an input element and input elements have values so get that value
        total += price * quantity // add in the total
    }
    total = Math.round(total * 100) / 100 // Math.round rounds a value to the nearest integer, but we want to round to only two decimal places so multiply total by 100 and then round it to the nearest integer and then divide by 100 (e.g. 19.78999*100 = 1978.99, round it up to the nearest integer i.e. 1979 / 100 = 19.79)
    // Another way to round the total up to 2 decimal places is to use toFixed(2) method, but it returns a string, so convert it back to a float i.e. total = parseFloat(total.toFixed(2))
    document.getElementsByClassName("cart-total-price")[0].innerText = "$" + total // get the inner text of total price element and update it with our calculated total (concatenate the $ sign)
}