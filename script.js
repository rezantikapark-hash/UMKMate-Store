
// ==================================
// 1. KONFIGURASI TOKO
// ==================================

// GANTI dengan nomor WhatsApp penjual.
// Gunakan kode negara 62, tanpa tanda +.
const WHATSAPP_NUMBER = "6281549445378";

// ==================================
// 2. DATA PRODUK
// ==================================

let products = [
  {
    id: 1,
    name: "Makaroni Pedas",
    category: "Makanan",
    price: 15000,
    image: "https://images.unsplash.com/photo-1621939514649-280e2aa65f22?w=600",
    description: "Makaroni renyah dengan bumbu pedas."
  },
  {
    id: 2,
    name: "Cookies Premium",
    category: "Makanan",
    price: 25000,
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600",
    description: "Cookies homemade dengan rasa premium."
  },
  {
    id: 3,
    name: "Kopi Susu",
    category: "Minuman",
    price: 12000,
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600",
    description: "Kopi susu segar dengan rasa creamy."
  },
  {
    id: 4,
    name: "Gift Hampers",
    category: "Kerajinan",
    price: 70000,
    image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=600",
    description: "Hampers cantik untuk hadiah spesial."
  },
  {
    id: 5,
    name: "Keripik Pisang",
    category: "Makanan",
    price: 18000,
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600",
    description: "Keripik pisang renyah khas UMKM."
  },
  {
    id: 6,
    name: "Tas Rajut",
    category: "Fashion",
    price: 85000,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
    description: "Tas rajut handmade yang unik."
  },
  {
    id: 7,
    name: "Sambal Homemade",
    category: "Makanan",
    price: 20000,
    image: "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=600",
    description: "Sambal rumahan dengan cita rasa khas."
  },
  {
    id: 8,
    name: "Jus Buah",
    category: "Minuman",
    price: 14000,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600",
    description: "Minuman buah segar tanpa ribet."
  }
];


// AMBIL DATA PRODUK DARI DASHBOARD ADMIN
try {
  const savedProducts = JSON.parse(
    localStorage.getItem("umkmateProducts")
  );

  if (Array.isArray(savedProducts)) {
    products = savedProducts;
  } else {
    localStorage.setItem(
      "umkmateProducts",
      JSON.stringify(products)
    );
  }
} catch (error) {
  localStorage.setItem(
    "umkmateProducts",
    JSON.stringify(products)
  );
}

// ==================================
// 3. PENYIMPANAN KERANJANG
// ==================================

let cart = [];

try {
  cart = JSON.parse(
    localStorage.getItem("umkmate-cart")
  ) || [];
} catch (error) {
  cart = [];
}

let currentCategory = "Semua";

function saveCart() {
  localStorage.setItem(
    "umkmate-cart",
    JSON.stringify(cart)
  );
}

// ==================================
// 4. FORMAT RUPIAH
// ==================================

function rupiah(number) {
  return "Rp" + number.toLocaleString("id-ID");
}

// ==================================
// 5. MENAMPILKAN PRODUK
// ==================================

function displayProducts(data) {
  const container = document.getElementById("product-list");

  if (data.length === 0) {
    container.innerHTML =
      '<p class="empty-products">Produk tidak ditemukan.</p>';
    return;
  }

  container.innerHTML = data.map(product => `
    <div class="product-card">
      <img src="${product.image}"
        alt="${product.name}"
        loading="lazy"
        onerror="this.src='https://placehold.co/600x400/e8eee4/536b50?text=UMKMate'">

      <div class="product-info">
        <span class="product-category">
          ${product.category}
        </span>

        <h3>${product.name}</h3>
        <p>${rupiah(product.price)}</p>

        <button class="add-button"
          onclick="addToCart(${product.id})">
          + Tambah ke Keranjang
        </button>
      </div>
    </div>
  `).join("");
}

// ==================================
// 6. FILTER KATEGORI
// ==================================

function filterProducts(category) {
  currentCategory = category;

  document.querySelectorAll(".category").forEach(button => {
    button.classList.toggle(
      "active",
      button.textContent.trim() === category
    );
  });

  searchProducts();
}

// ==================================
// 7. PENCARIAN PRODUK
// ==================================

function searchProducts() {
  const keyword = document
    .getElementById("search")
    .value.toLowerCase();

  const filtered = products.filter(product => {
    const matchCategory =
      currentCategory === "Semua" ||
      product.category === currentCategory;

    const matchSearch =
      product.name.toLowerCase().includes(keyword) ||
      product.category.toLowerCase().includes(keyword);

    return matchCategory && matchSearch;
  });

  displayProducts(filtered);
}

// ==================================
// 8. TAMBAH KE KERANJANG
// ==================================

function addToCart(id) {
  const product = products.find(p => p.id === id);

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveCart();
  updateCart();

  toggleCart(true);
}

// ==================================
// 9. UPDATE KERANJANG
// ==================================

function updateCart() {
  const container = document.getElementById("cart-items");

  let total = 0;
  let count = 0;

  if (cart.length === 0) {
    container.innerHTML =
      '<p class="empty-products">Keranjang masih kosong.</p>';
  } else {
    container.innerHTML = cart.map(item => {
      const product = products.find(p => p.id === item.id);

      if (!product) return "";

      total += product.price * item.quantity;
      count += item.quantity;

      return `
        <div class="cart-item">
          <img src="${product.image}" alt="${product.name}">

          <div class="cart-item-info">
            <h4>${product.name}</h4>
            <p>${rupiah(product.price)}</p>

            <div class="quantity-controls">
              <button onclick="changeQuantity(${item.id}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
          </div>

          <button class="remove-button"
            onclick="removeFromCart(${item.id})">
            Hapus
          </button>
        </div>
      `;
    }).join("");
  }

  document.getElementById("cart-count").textContent = count;
  document.getElementById("cart-total").textContent = rupiah(total);

  saveCart();
}

// ==================================
// 10. UBAH JUMLAH PRODUK
// ==================================

function changeQuantity(id, change) {
  const item = cart.find(p => p.id === id);

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  updateCart();
}

// ==================================
// 11. HAPUS PRODUK
// ==================================

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// ==================================
// 12. BUKA DAN TUTUP KERANJANG
// ==================================

function toggleCart(forceOpen) {
  const panel = document.getElementById("cart-panel");
  const overlay = document.getElementById("overlay");

  const shouldOpen =
    typeof forceOpen === "boolean"
      ? forceOpen
      : !panel.classList.contains("show");

  panel.classList.toggle("show", shouldOpen);
  overlay.classList.toggle("show", shouldOpen);
}

// ==================================
// 13. CHECKOUT
// ==================================

function openCheckout() {
  if (cart.length === 0) {
    alert("Keranjang belanja masih kosong!");
    return;
  }

  toggleCart(false);

  document
    .getElementById("checkout-modal")
    .classList.add("show");
}

function closeCheckout() {
  document
    .getElementById("checkout-modal")
    .classList.remove("show");
}

// ==================================
// 14. KIRIM PESANAN KE WHATSAPP
// ==================================

document
  .getElementById("checkout-form")
  .addEventListener("submit", function(event) {

    event.preventDefault();

    if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
      alert("Nomor WhatsApp toko belum dikonfigurasi dengan benar.");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang belanja masih kosong!");
      closeCheckout();
      return;
    }

    const name = document
      .getElementById("customer-name").value.trim();

    const phone = document
      .getElementById("customer-phone").value.trim();

    const address = document
      .getElementById("customer-address").value.trim();

    const note = document
      .getElementById("customer-note").value.trim();

    const phoneDigits = phone.replace(/\D/g, "");

    if (!/^\d{9,15}$/.test(phoneDigits)) {
      alert("Masukkan nomor WhatsApp yang valid.");
      return;
    }

    let total = 0;

    let message =
      "HALO UMKMATE STORE!\n\n" +
      "Saya ingin memesan produk berikut:\n\n";

    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);

      if (!product) return;

      const subtotal = product.price * item.quantity;
      total += subtotal;

      message +=
        product.name + "\n" +
        "Jumlah: " + item.quantity + "\n" +
        "Harga: " + rupiah(subtotal) + "\n\n";
    });

    message +=
      "TOTAL: " + rupiah(total) + "\n\n" +
      "DATA PEMBELI\n" +
      "Nama: " + name + "\n" +
      "Nomor WhatsApp: " + phone + "\n" +
      "Alamat: " + address + "\n" +
      "Catatan: " + (note || "-") + "\n\n" +
      "Mohon konfirmasi pesanan dan ongkos kirim. Terima kasih!";

    const whatsappURL =
      "https://wa.me/" + WHATSAPP_NUMBER +
      "?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");

    closeCheckout();
  });

// ==================================
// 15. JALANKAN WEBSITE
// ==================================

displayProducts(products);
updateCart();
