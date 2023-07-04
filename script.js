
let carts = [];
let discount = 0;
let couponApplied = false;
let couponCode="";
const coupons = [
    {
        code: "eid",
        discount: 10
    },
    {
        code: "ostad",
        discount: 20
    }
]

const products = [
    {
        id: 1,
        name: "Iphone 5",
        imageUrl: "https://w7.pngwing.com/pngs/298/326/png-transparent-smartphone-feature-phone-iphone-5s-iphone-5c-black-iphone-5-on-the-back-gadget-electronics-black-hair.png",
        price: 1500,
        stock: 5
    },
    {
        id: 2,
        name: "Iphone 6",
        imageUrl: "https://www.kindpng.com/picc/m/107-1071245_transparent-iphone-6-transparent-png-phone-png-transparent.png",
        price: 1600,
        stock: 3
    },
    {
        id: 3,
        name: "Iphone 11",
        imageUrl: "https://www.vhv.rs/dpng/d/583-5831368_iphone-11-purple-back-hd-png-download.png",
        price: 2500,
        stock: 5
    },
    {
        id: 4,
        name: "Iphone 12",
        imageUrl: "https://themayanagari.com/wp-content/uploads/2021/04/Apple-iPhone-12-Pro-Max-Png-Transparent.jpg",
        price: 1500,
        stock: 5
    },
    {
        id: 5,
        name: "Iphone 13",
        imageUrl: "https://w7.pngwing.com/pngs/486/588/png-transparent-iphone-13-pro-back.png",
        price: 1500,
        stock: 5
    },
]
function addToCart(id) {
   
    if (carts.filter(cart => cart.id == id).length == 0) {
        const itemToAdd = products.filter(product => product.id == id)[0];
        carts.push({
            id: itemToAdd.id,
            imageUrl: itemToAdd.imageUrl,
            qty: 1,
            price: itemToAdd.price,
            name: itemToAdd.name
        })
    }
    else {
        increment(id);
    }
    if(couponCode){
        applyCoupon(couponCode);
    }
    //update the ui
    renderCart();
}
function increment(id) {

    carts=carts.map(cart=>cart.id==id?{...cart,qty:cart.qty+1}:cart)
    if(couponCode){
        applyCoupon(couponCode);
    }
    renderCart();
}
function decrement(id) {
    //remove if existing qty=1
    if(carts.filter(cart=>cart.id==id&&cart.qty==1).length>0){
        carts=carts.filter(cart=>cart.id!=id)
    }
    else{
        carts=carts.map(cart=>cart.id==id?{...cart,qty:cart.qty-1}:cart);
    }
    if(couponCode){
        applyCoupon(couponCode);
    }
    renderCart();
}



function removeFromCart(id) {
    carts = carts.filter(cart => cart.id != id);
    if(couponCode){
        applyCoupon(couponCode);
    }
    renderCart();

}
function clearCart() {
    carts=[];
    discount=0;
    couponApplied=false;
    couponCode="";
    renderCart();

}
function applyCoupon(code) {
    //if code exist in coupon array
    const coupon = coupons.filter(coupon => coupon.code == code)[0];
    if (coupon) {
        //discount percentage on total
        const total=carts.reduce((acc, cart) => acc + cart.price * cart.qty, 0);
        if(total>0){
            discount=total*coupon.discount/100;
            couponApplied = true;
            couponCode=code;
        }
        else{
            removeCoupon()
        }
       
    }
    else{
        alert("coupon not found")
    }
   
}
function removeCoupon() {
    discount=0;
    couponApplied=false;
    couponCode="";
    renderCart();
}
function renderCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";
    for (let i = 0; i < carts.length; i++) {
        let cartContainer = document.createElement("div");
        //image
        cartContainer.classList.add("card","mb-2","py-2","px-3")

        let imageContainer = document.createElement("div");
        imageContainer.classList.add("position-relative")
        let cartImage = document.createElement("img");
        cartImage.setAttribute("loading","lazy")
        cartImage.src = carts[i].imageUrl;
        cartImage.classList.add("cart-image")

        //remove button
        let removeButton = document.createElement("button");
        removeButton.innerHTML = "X";
        removeButton.classList.add("btn","btn-sm", "btn-danger","position-absolute","right-2","top-1");
        removeButton.addEventListener("click", function () {
            removeFromCart(carts[i].id)
        });

        imageContainer.appendChild(cartImage);
        imageContainer.appendChild(removeButton);
        //qtyContainer
        let nameSpan=document.createElement("span");
        document.createElement("span");
        nameSpan.innerHTML=carts[i].name;
        nameSpan.classList.add("font-weight-bold");
        let priceSpan=document.createElement("span");
        priceSpan.innerHTML="$"+carts[i].price;
        priceSpan.classList.add("bold");
        let priceAndNameContainer=document.createElement("div");
        priceAndNameContainer.classList.add("d-flex","justify-content-between");
        priceAndNameContainer.appendChild(nameSpan);
        priceAndNameContainer.appendChild(priceSpan);
        cartContainer.appendChild(priceAndNameContainer);
        let qtyContainer = document.createElement("div");
        let decrementButton = document.createElement("button");
        decrementButton.classList.add("btn", "btn-info");
        decrementButton.innerHTML = "-";
        decrementButton.addEventListener("click", function () {
            decrement(carts[i].id);
        })

        let currentQty = document.createElement("span");
        currentQty.innerHTML = carts[i].qty;
        currentQty.classList.add("mx-2","bold")

        let incrementButton = document.createElement("button");
        incrementButton.innerHTML = "+";
        incrementButton.classList.add("btn", "btn-info");
        incrementButton.addEventListener("click", function () {
            increment(carts[i].id);
        })
        qtyContainer.appendChild(decrementButton);
        qtyContainer.appendChild(currentQty);

        qtyContainer.appendChild(incrementButton);

        cartContainer.appendChild(imageContainer);
        cartContainer.appendChild(qtyContainer);
        //buttons
        cartList.appendChild(cartContainer)

    }
    //show cart total
    let summaryContainer = document.createElement("div");
    summaryContainer.classList.add("summary-container");
    let discountSpan = document.createElement("span");
    discountSpan.innerHTML = "Discount: $" + discount;
    discountSpan.classList.add("font-weight-bold","text-white","d-block");
    
    let cartTotal = document.createElement("span");
    cartTotal.innerHTML = "Cart Total: $" + (carts.reduce((acc, cart) => acc + cart.price * cart.qty, 0)-discount);
    cartTotal.classList.add("font-weight-bold","text-white");
    if(couponApplied==false){
        let couponInput = document.createElement("input");
        couponInput.classList.add("form-control","mt-2");
        couponInput.placeholder = "eid for 10% ostad for 20%";
        let applyCouponButton = document.createElement("button");
        applyCouponButton.classList.add("btn", "btn-primary","d-block","mb-2","mt-2");
        applyCouponButton.innerHTML = "Apply Coupon";
        applyCouponButton.addEventListener("click", function () {
            applyCoupon(couponInput.value);
            renderCart();
        })
        summaryContainer.appendChild(couponInput);
        summaryContainer.appendChild(applyCouponButton);
    }
    else{
        //show applied code
        let appliedCode = document.createElement("span");
        appliedCode.innerHTML="Applied Code: "+couponCode;
        appliedCode.classList.add("font-weight-bold","text-white");
        summaryContainer.appendChild(appliedCode);
        //remove button
        let removeCouponButton = document.createElement("button");
        removeCouponButton.classList.add("btn", "btn-danger");
        removeCouponButton.innerHTML = "Remove Coupon";
            removeCouponButton.addEventListener("click", function () {
            removeCoupon();
        })
        summaryContainer.appendChild(removeCouponButton);
    }
    //clear cart button
    let clearCartButton = document.createElement("button");
    clearCartButton.classList.add("btn", "btn-danger","d-block");
    clearCartButton.innerHTML = "Clear Cart";
    clearCartButton.addEventListener("click", function () {
        clearCart();
    });
    summaryContainer.appendChild(clearCartButton)
    summaryContainer.appendChild(discountSpan);
    summaryContainer.appendChild(cartTotal)
    cartList.appendChild(summaryContainer)
}
const productList = document.getElementById("product-list");
for (let i = 0; i < products.length; i++) {
    let productContainer = document.createElement("div");
    productContainer.classList.add("card","d-flex","align-items-center","mb-3","p-2");
    //title element
    let productTitle = document.createElement("h1");
    productTitle.innerHTML = products[i].name;
    productTitle.classList.add("card-title","text-center");
    //image
    let productImage = document.createElement("img");
    productImage.src = products[i].imageUrl;
    productImage.classList.add("product-image")

    //price
    let productPrice = document.createElement("span");
    productPrice.innerHTML = "<br>$" + products[i].price;

    //add to cart button
    let cartButton = document.createElement("button");
    cartButton.innerHTML = "Add to cart";
    cartButton.classList.add("btn", "btn-primary");
    cartButton.addEventListener("click", function () {
        addToCart(products[i].id)
    });
    //append to container
    productContainer.appendChild(productTitle);
    productContainer.appendChild(productImage);
    productContainer.appendChild(productPrice);
    productContainer.appendChild(cartButton);
    productList.appendChild(productContainer);
}