fetch('/public/data/menuData.json')
    .then(res => {
        if(!res.ok) throw new Error(`Failed to load menuData.json: ${res.status}`);
        return res.json();
    })
    .then(menuData => {
        //Transform data
        menuData.Roll = menuData.Roll.map(item =>
            typeof item === "string"
            ? {name: item, options: ["roll", "hand roll"] }
            : {...item, options: item.options ?? ["roll", "hand roll"]}
        );

        menuData.ALaCarto = menuData.ALaCarto.map(item =>
            typeof item === "string"
            ? {name: item, options: ["Sashimi", "Sushi"] }
            : {...item, options: item.options ?? ["Sashimi", "Sushi"]}
        );

        initializeMenu(menuData);
    })
    .catch(err => {
        console.error(err);
        alert("Fialed to load menu. Please try again.");
    });

    let currentOrder = [];

    function updateOrderDisplay() {
        const orderList = document.getElementById("orderList");
        const totalItems = document.getElementById("totalItems");
        const cartCount = document.getElementById("cartCount");

        if(currentOrder.length === 0) {
            orderList.innerHTML = `<p class="text-gray-400 text-center text-sm">No Items yet</p>`;
            totalItems.textContent = "0";
            cartCount.textContent = "0";
            return;
        }

        orderList.innerHTML = "";
        currentOrder.forEach((item) => {
            const div = document.createElement("div");
            div.className = "bg-white p-2 md:p-3 rounded shadow flex justify-between items-center text-sm";
            div.innerHTML = `
                <div class="flex-1">
                    <div class="font-semibold"> ${item.name} </div>
                    <div class="text-xs text-gray-500"> ${item.category} </div>
                </div>
                <button class="text-red-500 hover:text-red-700 font-bold ml-2" onclick="removeFromOrder(${item.id})">
                    X
                </button>
            `;
            orderList.appendChild(div);
        });

        totalItems.textContent = currentOrder.length;
        cartCount.textContent = currentOrder.length;
    }

  window.addToOrder = function(category, itemName){
        const orderItem = {
            id: Date.now(),
            category: category,
            name: itemName,
            timestamp: new Date().toLocaleTimeString()
        };

        currentOrder.push(orderItem);
        updateOrderDisplay();
    }

    window.removeFromOrder = function(itemId){
        currentOrder = currentOrder.filter(item => item.id !== itemId);
        updateOrderDisplay();
    }

    function initializeMenu(menuData) {
        const categoryMenu = document.getElementById("categoryMenu");
        const itemMenu = document.getElementById("itemMenu");
        const categoryList = document.getElementById("categoryList");
        const categoryTitle = document.getElementById("categoryTitle");
        const itemGrid = document.getElementById("itemGrid");
        const menuTitle = document.getElementById("menuTitle")
        const detailMenu = document.getElementById("detailMenu");
        const detailGrid = document.getElementById("detailGrid");
        const dividerLine = document.getElementById("dividerLine");
        const orderList = document.getElementById("orderList");
        const totalItems = document.getElementById("totalItems");
        const cartCount = document.getElementById("cartCount");

        Object.keys(menuData).forEach(category => {
            const li = document.createElement("li");
            li.className = "cursor-pointer p-4 bg-white rounded shadow hover:bg-gray-100 text-center font-semibold";
            li.textContent = category;

            li.onclick = () => showItems(category);
            categoryList.appendChild(li);
        });

        function showItems(category) {
            // display smaller left category menu
            categoryMenu.classList.add("w-1/4");

            if (category === "SpecialRoll") {
                categoryTitle.textContent = "Special Roll (9pcs)"
            } else {
                categoryTitle.textContent = category;
            }
            const items = menuData[category];
            itemGrid.innerHTML = "";

            items.forEach(item => {
                const name = typeof item === "string" ? item: item.name;

                const div = document.createElement("div");
                div.className = "p-3 border rounded shadow cursor-pointer hover:bg-gray-100";
                div.textContent = name;

                div.onclick = () => {
                    if (typeof item === "object" && item.options) {
                        showSubOptions(item, category);
                    } else if (typeof item === "object" && item.desc) {
                        showDesc(item, category);
                    } else {
                        addToOrder(category, name);
                    }
                };

                itemGrid.appendChild(div);
            });

            // If mobile, hidden categoryMenu (left side)
            if (window.innerWidth < 768) {
                categoryMenu.classList.add("hidden");
            }
            itemMenu.classList.remove("hidden");
        }

        function showDesc(item, category) {
            menuTitle.textContent = item.name;
            detailGrid.innerHTML = "";
            const div = document.createElement("div");
            div.className = "p-6 border-2 rounded-lg shadow-lg bg-white max-w-2xl";
            div.innerHTML = `
                <p class="text-lg mb-6 text-gray-700 leading-relaxed"> ${item.desc} </p>
                <button class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                    onclick="addToOrder('${category}', '${item.name}')">
                    Add to Order
                </button>
            `;
            detailGrid.className = "flex justify-center items-start p-4";
            detailGrid.appendChild(div);

            detailMenu.classList.remove("hidden");
            dividerLine.classList.remove("hidden");
        }

        function showSubOptions(item, category) {
            menuTitle.textContent = item.name;
            detailGrid.innerHTML = "";
            
            item.options.forEach(option => {
                const div = document.createElement("div");
                div.className = "p-3 border rounded shadow cursor-pointer hover:bg-gray-100";
                div.textContent = option;

                div.onclick = () => {
                    addToOrder(category, `${item.name} - ${option}`);
                };
                detailGrid.appendChild(div);
            })

            // itemMenu.classList.add("hidden");
            detailMenu.classList.remove("hidden");
            dividerLine.classList.remove("hidden");
        }

        // back button 
        document.getElementById("backBtn").onclick = () => {
            itemMenu.classList.add("hidden");
            detailMenu.classList.add("hidden");
        }

        document.getElementById("backToItemsBtn").onclick = () => {
            detailMenu.classList.add("hidden");
            itemMenu.classList.remove("hidden");
        }

        //cart button
        const CartBtn = document.getElementById("CartBtn");
        const closeCart = document.getElementById("closeCart");
        const orderCart = document.getElementById("orderCart");

        function openCart() {
            orderCart.classList.remove("hidden");
            orderCart.classList.add("flex");
        }

        function closeCartFn() {
            orderCart.classList.add("hidden");
            orderCart.classList.remove("flex");
        }

        if (CartBtn) CartBtn.onclick = openCart;
        if (closeCart) closeCart.onclick = closeCartFn;

        document.getElementById("toggleCart").onclick = () => {
            orderList.classList.toggle("hidden");
        }

        document.getElementById("clearOrder").onclick = () => {
            if(confirm("Clear all items?")) {
                currentOrder = [];
                updateOrderDisplay();
            }
        }

        document.getElementById("sendOrder").onclick = () => {
            if(currentOrder.length === 0){
                alert("No items in order");
                return;
            }

            fetch("/api/order", {
                method:"POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(currentOrder)
            }).then(res => res.json())
            .then(data => {
                console.log("Order response", data)
                alert(`Order sent to POS!\n${currentOrder.length} items`);
                currentOrder = [];
                updateOrderDisplay();
            })
            .catch(err => {
                console.error("Error sending order:", err);
                alert("Failed to send order!");
            });
        }

}

