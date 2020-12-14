const items = [
    {
        "itemId": 1, "dish": "Nizami Mutton Biryani", "cost": 300
    },
    {
        "itemId": 2, "dish": "Striped Bass", "cost": 210
    },
    {
        "itemId": 3, "dish": "Smoked Salmon with Olives", "cost": 210
    },
    {
        "itemId": 4, "dish": "Linguini with Bolognese Sauce", "cost": 220
    },
    {
        "itemId": 5, "dish": "Lobster and Crab Cakes", "cost": 240
    },
    {
        "itemId": 6, "dish": "Filet Mignon with Burnt Butter Sauce", "cost": 240
    },
    {
        "itemId": 7, "dish": "Pastrami on Rye", "cost": 300
    },
    {
        "itemId": 8, "dish": "Pizza Neopolitana", "cost": 330
    }
]

const tables = [
    {
        "tableId": 1, "tableName": "Table-1", "items": [], "cost": 0
    },
    {
        "tableId": 2, "tableName": "Table-2", "items": [], "cost": 0
    },
    {
        "tableId": 3, "tableName": "Table-3", "items": [], "cost": 0
    },
    {
        "tableId": 4, "tableName": "Table-4", "items": [], "cost": 0
    },
    {
        "tableId": 5, "tableName": "Table-5", "items": [], "cost": 0
    }
]

load = () => {
    let allTables = document.getElementsByClassName("table-list")[0].getElementsByTagName("ul")[0];
    let tableList = "";
    for (let i = 0; i < tables.length; i++) {
        let sum = 0;
        for(let j = 0; j < tables[i].items.length; j++) {
            if(tables[i].items[j].quantity > 0) sum += getItemPrice(tables[i].items[j].itemId) * tables[i].items[j].quantity
            else sum += getItemPrice(tables[i].items[j].itemId)
        }
        let tableColor = tables[i].items.length > 0 ? "custom-active" : ""
        tableList += `<li class="list-group-item custom-item list-group-item-action custom-item-class-inside1 ` + tableColor + `" ondrop="drop(event)" ondragover="allowDrop(event)"
                    id="table-`+ tables[i].tableId + `" data-toggle="modal" data-target="#myModal` + tables[i].tableId + `" >` +
            `<div class="table-name">` + tables[i].tableName + `</div><br>` +
            `<div class="table-details"> ₹` + sum + ` | Items: ` + tables[i].items.length + `</div>` +
            `</li>`;
    }
    allTables.innerHTML += tableList;
    let modalBlock = document.getElementsByClassName("modal-block")[0];
    let modalList = ``;
    for (let i = 0; i < tables.length; i++) {
        modalList += popUpTable(i);
    }
    modalBlock.innerHTML += modalList;
    let menu = document.getElementsByClassName("item-list")[0].getElementsByTagName("ul")[0];
    let itemList = "";
    for (let i = 0; i < items.length; i++) {
        itemList += `<li class="list-group-item list-group-item-action custom-item custom-item-class-inside1 " draggable="true" ondragstart="drag(event)" id="item-`+ items[i].itemId + `">` +
            `<div class="item-name">` + items[i].dish + `</div> <br/><br/>` +
            `<div class="item-details"> ₹` + items[i].cost + `</div>` +
            `</li>`;
    }
    menu.innerHTML += itemList;
}

findTable = () => {
    let inputValue = document.getElementById("table-search").value.toUpperCase();
    let tableNames = document.getElementsByClassName("table-name");
    for (let i = 0; i < tableNames.length; i++) {
        let tableName = tableNames[i].textContent || tableNames[i].innerText;
        if (tableName.toUpperCase().indexOf(inputValue) > -1) {
            tableNames[i].parentElement.style.display = "";
        } else {
            tableNames[i].parentElement.style.display = "none";
        }
    }
}

findItem = () => {
    let inputValue = document.getElementById("item-search").value.toUpperCase();
    let dishes = document.getElementsByClassName("item-name");
    for (let i = 0; i < dishes.length; i++) {
        let dish = dishes[i].textContent || dishes[i].innerText;
        if (dish.toUpperCase().indexOf(inputValue) > -1) dishes[i].parentElement.style.display = "";
        else dishes[i].parentElement.style.display = "none";
    }
}

checkForNegativeNumber = (table) => {
    for(let i = 0; i < table.items.length; i++) {
        if(table.items[i].quantity <= 0) {
            alert("the number cannot be less than one")
            table.items[i].quantity = 1 
        }
    }
} 

popUpTable = (i) => {
    let generateButton = tables[i].items.length > 0 ? "" : "disabled";
    checkForNegativeNumber(tables[i])
    return `<div class="modal" id="myModal` + tables[i].tableId + `">
                <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header blue">
                        <h4 class="modal-title">`+ tables[i].tableName + ` | Order Details</h4>
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                    </div>`+
                    `<div class="modal-body">
                        <table class="table table-borderless">
                            <thead>
                            <tr>
                                <th scope="col">S.No</th>
                                <th scope="col">Item</th>
                                <th scope="col">Price</th>
                                <th scope="col">No of Servings</th>
                                <th scope="col"></th>
                            </tr>
                            </thead>
                            <tbody>`
                                + popUpTableItems(i) +
                            `</tbody>
                        </table>            
                    </div>` +
                `<div class="modal-footer border-class">
                        <button type="button" class="btn btn-custom" id="bill-`+ tables[i].tableId + `" data-dismiss="modal"
                                `+ generateButton + ` onclick=clearTable(` + tables[i].tableId + `)>
                            Close Session (Generate Bill)
                        </button>
                    </div>
                </div>
                </div>
            </div>`
}

popUpTableItems = (i) => {
    let tableItems = ``;
    for (let idx = 0; idx < tables[i].items.length; idx++) {
        let item = getItemByItemId(tables[i].items[idx].itemId);
        tableItems += `<tr> ` +
            `<th scope="row">` + (idx + 1) + `</th>` +
            `<td>` + item.dish + `</td>` +
            `<td>` + item.cost + `</td>` +
            `<td>` +
            `<input type="number" id="quantity-` + tables[i].tableId + `-` + tables[i].items[idx].itemId +
            `" placeholder="quantity" min="1" onchange=editTableItemQuantity(` + tables[i].tableId + `,` + tables[i].items[idx].itemId + `) value= "` + tables[i].items[idx].quantity + `" />` +
            `</td>` +
            `<td>` + `<i class="fa fa-trash" onclick="deleteTableItem(` + tables[i].tableId + `,` + tables[i].items[idx].itemId + `)"></i>` + `</td>` +
            `</tr>`
    }
    tableItems += `<tr> ` +
        `<td></td>` +
        `<th scope="row" style="text-align:right;"> Total Cost </th>` +
        `<td colspan="3">` + getTotalCostByTableId(tables[i].tableId) + `</td>` +
        `</tr>`
    return tableItems;
}

clearPage = () => {
    for (let index = 0; index < tables.length; index++) {
        document.getElementById("table-" + tables[index].tableId).remove();
    }
    for (let index = 0; index < tables.length; index++) {
        document.getElementById("myModal" + tables[index].tableId).remove();
    }
    for (let index = 0; index < items.length; index++) {
        document.getElementById("item-" + items[index].itemId).remove();
    }
    let fadeElements = document.getElementsByClassName("modal-backdrop show");
    for (let index = 0; index < fadeElements.length; index++) {
        fadeElements[index].remove();
    }
}

editTableItemQuantity = (tableId, itemId) => {
    let updatedQuantity = document.getElementById("quantity-" + tableId + "-" + itemId).value;
    editOrderItemQuantity(tableId, itemId, updatedQuantity);
    clearPage();
    load();
    document.getElementById("table-" + tableId).click();
}

editOrderItemQuantity = (tableId, itemId, updatedQuantity) => {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].tableId == tableId) {
            for (let itemIndex = 0; itemIndex < tables[i].items.length; itemIndex++) {
                if (tables[i].items[itemIndex].itemId == itemId) {
                    tables[i].cost = (getItemByItemId(itemId).cost) * (updatedQuantity);
                    tables[i].items[itemIndex].quantity = updatedQuantity;
                }
            }
        }
    }
}

deleteTableItem = (tableId, itemId) => {
    deleteOrderItem(tableId, itemId);
    clearPage();
    load();
    document.getElementById("table-" + tableId).click();
}

deleteOrderItem = (tableId, itemId) => {
    for (let index = 0; index < tables.length; index++) {
        if (tables[index].tableId == tableId) {
            for (let itemIndex = 0; itemIndex < tables[index].items.length; itemIndex++) {
                if (tables[index].items[itemIndex].itemId == itemId) {
                    let quantity = tables[index].items[itemIndex].quantity;
                    tables[index].items.splice(itemIndex, 1);
                    tables[index].cost -= (getItemByItemId(itemId).cost * quantity);
                }
            }
        }
    }
}

clearTable = (tableId) => {
    alert("Total Cost. ₹" + getTotalCostByTableId(tableId) + "/-");
    for (let index = 0; index < tables.length; index++) {
        if (tables[index].tableId == tableId) {
            tables[index].items = [];
            tables[index].cost = 0;
        }
    }
    clearPage();
    load();
}

drag = event => event.dataTransfer.setData("item", event.target.id)

allowDrop = event => event.preventDefault()

drop = (event) => {
    event.preventDefault();
    let itemId = parseInt(event.dataTransfer.getData("item").split("-")[1]);
    let tableId = parseInt(event.target.id.split("-")[1]);
    let cost = getItemPrice(itemId);
    if (cost != -1) {
        for (let index = 0; index < tables.length; index++) {
            if (tables[index].tableId == tableId) {
                if (contains(tables[index].items, itemId)) {
                    alert("Dish already present");
                    return;
                }
                tables[index].items.push({ "itemId": itemId, "quantity": 1 });
                tables[index].cost += cost;
            }
        }
        clearPage();
        load();
    }
}

getItemPrice = (itemId) => {
    let item = getItemByItemId(itemId);
    if (Object.keys(item).length === 0) return -1;
    return item.cost;
}

getItemByItemId = (itemId) => {
    for (let i = 0; i < items.length; i++) {
        if (items[i].itemId == itemId) return items[i];
    }
    return {};
}

contains = (items, itemId) => {
    for(let i = 0; i < items.length; i++) {
        if (items[i].itemId == itemId) return true;
    }
    return false;
}

getTableByTableId = (tableId) => {
    for (let i = 0; i < tables.length; i++) {
        if (tables[i].tableId == tableId) return tables[i]
    }
    return {};
}

getTotalCostByTableId = (tableId) => {
    let total = 0;
    let table = getTableByTableId(tableId);
    for (let i = 0; i < table.items.length; i++) {
        total += getItemPrice(table.items[i].itemId) * (table.items[i].quantity);
    }
    return total;
}