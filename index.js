// API URL to fetch cart data
const apiUrl =
  "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889";

document.addEventListener("DOMContentLoaded", () => {
  fetchCartData();
});

// Fetch cart data from API
async function fetchCartData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.items.length === 0) {
      displayEmptyCartMessage(); // Show empty cart message
    } else {
      displayCartItems(data.items); // Dynamically display cart items
      updateCartTotals(); // Update the cart totals
    }
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

// Function to display "Cart is empty" message
function displayEmptyCartMessage() {
  const cartTableBody = document.querySelector(".cart-table tbody");
  cartTableBody.innerHTML = `<tr><td colspan="5" class="text-center py-10 text-2xl font-semibold">The cart is empty</td></tr>`;
  document.querySelector(".cart-totals").style.display = "none"; // Hide the cart totals section
}

// Function to dynamically display cart items
function displayCartItems(items) {
  const cartTableBody = document.querySelector(".cart-table tbody");
  cartTableBody.innerHTML = ""; // Clear existing items

  items.forEach((item) => {
    const itemHtml = `
     <tr class="border-b">
       <td class="py-4 px-6 flex gap-4 items-center">
         <img src="${item.image}" alt="${
      item.title
    }" class="w-28 h-28 rounded-lg" />
         <h1>${item.title}</h1>
       </td>
       <td class="py-4 px-6">₹${(item.price / 100).toFixed(2)}</td>
       <td class="py-4 px-6">
         <input
           type="number"
           value="${item.quantity}"
           min="1"
           class="quantity-input w-16 p-2 border rounded text-center"
           data-id="${item.id}"
         />
       </td>
       <td class="py-4 px-6">₹${((item.quantity * item.price) / 100).toFixed(
         2
       )}</td>
       <td>
         <i class="bx bx-trash text-[#B88E2F] cursor-pointer font-bold text-xl remove-item" data-id="${
           item.id
         }"></i>
       </td>
     </tr>
   `;

    cartTableBody.insertAdjacentHTML("beforeend", itemHtml);
  });

  // Add event listeners for quantity changes and item removal
  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", handleQuantityChange);
  });

  document.querySelectorAll(".remove-item").forEach((button) => {
    button.addEventListener("click", handleItemRemove);
  });
}

// Function to handle quantity change
function handleQuantityChange(event) {
  const itemId = event.target.dataset.id;
  const newQuantity = parseInt(event.target.value);

  // Find the item row and update its subtotal
  const row = event.target.closest("tr");
  const price = parseFloat(
    row.querySelector("td:nth-child(2)").innerText.replace("₹", "")
  );
  const subtotalCell = row.querySelector("td:nth-child(4)");
  subtotalCell.innerText = `₹${(newQuantity * price).toFixed(2)}`;

  // Update the cart totals
  updateCartTotals();
}

// Function to handle item removal
function handleItemRemove(event) {
  const itemId = event.target.dataset.id;

  // Remove the item row from the DOM
  event.target.closest("tr").remove();

  // Update the cart totals
  updateCartTotals();

  // Check if the cart is empty after removal
  const cartTableBody = document.querySelector(".cart-table tbody");
  if (cartTableBody.children.length === 0) {
    displayEmptyCartMessage(); // Display empty cart message if no items left
  }
}

// Function to update cart totals
function updateCartTotals() {
  let subtotal = 0;

  document.querySelectorAll(".cart-table tbody tr").forEach((row) => {
    const itemSubtotal = parseFloat(
      row.querySelector("td:nth-child(4)").innerText.replace("₹", "")
    );
    subtotal += itemSubtotal;
  });

  const total = subtotal;

  document.querySelector(
    ".cart-totals p:nth-child(2) span"
  ).innerText = `₹${subtotal.toFixed(2)}`;
  document.querySelector(
    ".cart-totals p:nth-child(3) span"
  ).innerText = ` ₹${total.toFixed(2)}`;
}

// Checkout button action
document.querySelector(".cart-totals button").addEventListener("click", () => {
  alert("Proceeding to checkout!");
});
