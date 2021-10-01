class Merchandise {
    constructor(id, name, description, unitPrice, image) {
        this.id = "";
        this.name = "";
        this.description = "";
        this.unitPrice = 0;
        this.image = "";
        this.id = id;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.image = image;
    }
}
class Service {
    constructor(id, name, description, unitPrice, image) {
        this.id = "";
        this.name = "";
        this.description = "";
        this.unitPrice = 0;
        this.image = "";
        this.contractLength = 12;
        this.id = id;
        this.name = name;
        this.description = description;
        this.unitPrice = unitPrice;
        this.image = image;
    }
}
class Vase extends Merchandise {
    calculateShipping() {
        return 4.99;
    }
}
class Lamp extends Merchandise {
    calculateShipping() {
        return 6.99;
    }
}
class Glass extends Merchandise {
    calculateShipping() {
        return 2.99;
    }
}
class ShoppingCartLineItem {
    constructor(merchandise) {
        this.merchandiseId = "";
        this.merchandiseName = "";
        this._unitPrice = 0;
        this._quantity = 0;
        this.merchandiseId = merchandise.id;
        this.merchandiseName = merchandise.name;
        this.unitPrice = merchandise.unitPrice;
        this.quantity = 1;
    }
    set unitPrice(newPrice) {
        if (newPrice >= 0) {
            this._unitPrice = newPrice;
        }
    }
    get unitPrice() {
        return this._unitPrice;
    }
    set quantity(q) {
        if (q >= 0) {
            this._quantity = q;
        }
    }
    get quantity() {
        return this._quantity;
    }
    getLineSubtotal() {
        return (this.quantity * this.unitPrice).toFixed(2);
    }
}
class ShoppingCart {
    constructor() { }
    static addItem(inventoryIndex) {
        const merchandise = inventory[inventoryIndex];
        const lineIndex = this.findItem(merchandise.id);
        if (lineIndex != -1) {
            // already exists, just increment the quantity
            ShoppingCart.lineItems[lineIndex].quantity++;
        }
        else {
            // if not already exists, create a new line item with quantity of 1
            ShoppingCart.lineItems.push(new ShoppingCartLineItem(merchandise));
        }
    }
    static decreaseItemQuantity(lineIndex) {
        ShoppingCart.lineItems[lineIndex].quantity--;
        if (ShoppingCart.lineItems[lineIndex].quantity <= 0) {
            ShoppingCart.lineItems = ShoppingCart.lineItems.filter((line, index) => index != lineIndex);
        }
    }
    static findItem(merchandiseId) {
        let testIndex = -1;
        // see if a line with that item ID is already in the array
        ShoppingCart.lineItems.forEach((line, index) => {
            if (line.merchandiseId == merchandiseId) {
                testIndex = index;
            }
        });
        return testIndex;
    }
    static getCopyOfLineItems() {
        return ShoppingCart.lineItems;
    }
    static getShoppingCartTotal() {
        let runningTotal = 0.0;
        ShoppingCart.lineItems.forEach(line => {
            runningTotal += line.unitPrice * line.quantity;
        });
        return runningTotal.toFixed(2);
    }
    static increaseItemQuantity(lineIndex) {
        ShoppingCart.lineItems[lineIndex].quantity++;
    }
}
ShoppingCart.lineItems = [];
// variables -----------------------------------------------------
const vase = new Vase("vase", "Vase", "A fine replica of the famous one in Sweden.", 29.99, "images/vase.png");
const lamp = new Lamp("lamp", "Lamp", "A hybrid of traditional and modern. Perfect for any home. 110/220V", 35.49, "images/lamp.png");
const glass = new Glass("glass", "Glass", "Matches the setting sun. Perfect for enjoying your favourite beverage while watching the sunset.", 14.99, "images/glass.png");
const protectionPlan = new Service("protect", "Protect", "Protect your purchase for 12 months.", 19.99, "images/protect.png");
var inventory = [vase, lamp, glass, protectionPlan];
// var shoppingCart = new ShoppingCart()
// functions -----------------------------------------------------
function addToShoppingCart(inventoryIndex) {
    ShoppingCart.addItem(inventoryIndex);
    buildShoppingCartTable();
}
function buildMerchandiseTable() {
    const htmlTemplate = `<td class="merchandise-image">
        <img class="merchandise-image" src="~~image~~" alt="vase">
    </td>
    <td>
        <p class="merchandise-name">~~name~~</p>
        <hr class="merchandise-hr">
        <p class="merchandise-unit-price">~~unit-price~~</p>
        <p class="merchandise-description">~~description~~</p>
    </td>
    <td class="top-align-cell">
        <a href="javascript:addToShoppingCart('~~index~~')"><img class="floating-button" src="images/blue_circle_plus.png" alt="add"></a>
    </td>`;
    let merchandiseTable = document.getElementById("merchandise-table");
    if (merchandiseTable == null)
        return;
    inventory.forEach((merchandise, index) => {
        let row = merchandiseTable.insertRow(index);
        let rowHTML = htmlTemplate.replace("~~index~~", index.toString());
        rowHTML = rowHTML.replace("~~image~~", merchandise.image);
        rowHTML = rowHTML.replace("~~name~~", merchandise.name.toUpperCase());
        rowHTML = rowHTML.replace("~~unit-price~~", "$" + merchandise.unitPrice);
        rowHTML = rowHTML.replace("~~description~~", merchandise.description);
        row.innerHTML = rowHTML;
    });
}
function buildShoppingCartTable() {
    const lineTemplate = `<td class="shopping-cart-item-name-column">~~name~~</td>
    <td class="shopping-cart-item-quantity-column"><a href="javascript:decreaseQuantity(~~lineIndex~~)">-</a> ~~quantity~~ <a href="javascript:increaseQuantity('~~lineIndex~~')">+</a></td>
    <td class="shopping-cart-item-line-total-column">~~lineItemSubtotal~~</td>
    `;
    let lineItemsTable = document.getElementById("shopping-cart-items-table");
    if (lineItemsTable == null)
        return;
    lineItemsTable.innerHTML = "";
    const copyOfLineItems = ShoppingCart.getCopyOfLineItems();
    copyOfLineItems.forEach((line, index) => {
        let row = lineItemsTable.insertRow(index);
        let rowHTML = lineTemplate.replace("~~name~~", line.merchandiseName);
        rowHTML = rowHTML.replace("~~lineIndex~~", index.toString());
        rowHTML = rowHTML.replace("~~lineIndex~~", index.toString());
        rowHTML = rowHTML.replace("~~quantity~~", (line.quantity).toString());
        rowHTML = rowHTML.replace("~~lineItemSubtotal~~", "$" + line.getLineSubtotal());
        row.innerHTML = rowHTML;
    });
    const totalElement = document.getElementById("shopping-cart-total");
    if (totalElement != null) {
        totalElement.innerHTML = "$" + ShoppingCart.getShoppingCartTotal();
    }
    const checkout_btn = document.getElementById("checkout-button");
    if (checkout_btn != null) {
        checkout_btn.style.display = copyOfLineItems.length == 0 ? "none" : "inline";
    }
}
function increaseQuantity(lineIndex) {
    ShoppingCart.increaseItemQuantity(lineIndex);
    //shoppingCart.lineItems[lineIndex].quantity++
    buildShoppingCartTable();
}
function decreaseQuantity(lineIndex) {
    ShoppingCart.decreaseItemQuantity(lineIndex);
    buildShoppingCartTable();
}
buildMerchandiseTable();
buildShoppingCartTable();
