


// DATA AWAL PRODUK
const defaultProducts = [
  {
    id: 1,
    name: "Makaroni Pedas",
    category: "Makanan",
    price: 15000,
    image: "https://i.pinimg.com/736x/36/bf/39/36bf39fb8a93718f0eecfe8c8935a629.jpg",
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
    image: "https://i.pinimg.com/736x/6a/5a/51/6a5a515af9bbfbd981df115366976505.jpg",
    description: "Hampers cantik untuk hadiah spesial."
  },
  {
    id: 5,
    name: "Keripik Pisang",
    category: "Makanan",
    price: 18000,
    image: "https://i.pinimg.com/1200x/8b/8d/75/8b8d755cf166ccd7e0d6efda0662c39c.jpg",
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
    image: "https://i.pinimg.com/1200x/7c/36/07/7c360794a54169435b3d7b2bf6f7dea1.jpg",
    description: "Sambal rumahan dengan cita rasa khas."
  },
  {
    id: 8,
    name: "Jus Buah",
    category: "Minuman",
    price: 14000,
    image: "https://i.pinimg.com/1200x/ba/0c/12/ba0c12b771ed1a1a25e8aaad733c5c85.jpg",
    description: "Minuman buah segar tanpa ribet."
  }
];

let adminProducts = [];

try {
  const savedProducts = JSON.parse(
    localStorage.getItem("umkmateProducts")
  );

  adminProducts = Array.isArray(savedProducts)
    ? savedProducts
    : defaultProducts.map(product => ({ ...product }));

  if (!Array.isArray(savedProducts)) {
    localStorage.setItem(
      "umkmateProducts",
      JSON.stringify(adminProducts)
    );
  }
} catch (error) {
  adminProducts = defaultProducts.map(product => ({ ...product }));
}

function saveProducts() {
  localStorage.setItem(
    "umkmateProducts",
    JSON.stringify(adminProducts)
  );
}

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(price);
}

// TAMPILKAN DAFTAR PRODUK
function renderAdminProducts() {
  const productList = document.getElementById("admin-product-list");
  const totalProducts = document.getElementById("total-products");

  totalProducts.textContent = adminProducts.length;

  if (adminProducts.length === 0) {
    productList.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">
          Belum ada produk. Silakan tambahkan produk.
        </td>
      </tr>
    `;
    return;
  }

  productList.innerHTML = adminProducts.map(product => `
    <tr>
      <td>
        <div class="product-cell">
          <img
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            onerror="this.src='https://placehold.co/100x100/e8ede3/65765d?text=UMKM'">
          <span>${escapeHTML(product.name)}</span>
        </div>
      </td>
      <td>${escapeHTML(product.category)}</td>
      <td>${formatPrice(product.price)}</td>
      <td>
        <button class="edit-button" onclick="editProduct(${product.id})">
          Edit
        </button>
        <button class="delete-button" onclick="deleteProduct(${product.id})">
          Hapus
        </button>
      </td>
    </tr>
  `).join("");
}

// AMANKAN TEKS YANG DITAMPILKAN
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}

// BUKA FORM PRODUK
function openProductForm() {
  document.getElementById("product-form").reset();
  document.getElementById("product-id").value = "";
  document.getElementById("form-title").textContent = "Tambah Produk";
  document.getElementById("product-modal").classList.add("show");
}

// TUTUP FORM PRODUK
function closeProductForm() {
  document.getElementById("product-modal").classList.remove("show");
}

// EDIT PRODUK
function editProduct(id) {
  const product = adminProducts.find(item => item.id === id);

  if (!product) return;

  document.getElementById("product-id").value = product.id;
  document.getElementById("product-name").value = product.name;
  document.getElementById("product-category").value = product.category;
  document.getElementById("product-price").value = product.price;
  document.getElementById("product-image").value = product.image;

  document.getElementById("form-title").textContent = "Edit Produk";
  document.getElementById("product-modal").classList.add("show");
}

// SIMPAN PRODUK BARU ATAU PERUBAHAN
document.getElementById("product-form").addEventListener("submit", function(event) {
  event.preventDefault();

  const idValue = document.getElementById("product-id").value;
  const name = document.getElementById("product-name").value.trim();
  const category = document.getElementById("product-category").value;
  const price = Number(document.getElementById("product-price").value);
  const image = document.getElementById("product-image").value.trim();

  if (!name || !category || !image || !Number.isFinite(price) || price <= 0) {
    alert("Mohon isi semua data produk dengan benar.");
    return;
  }

  if (idValue) {
    const product = adminProducts.find(item => item.id === Number(idValue));

    if (product) {
      product.name = name;
      product.category = category;
      product.price = price;
      product.image = image;
    }
  } else {
    const newProduct = {
      id: Date.now(),
      name,
      category,
      price,
      image
    };

    adminProducts.push(newProduct);
  }

  saveProducts();
  renderAdminProducts();
  closeProductForm();

  alert("Data produk berhasil disimpan!");
});

// HAPUS PRODUK
function deleteProduct(id) {
  const confirmation = confirm("Apakah kamu yakin ingin menghapus produk ini?");

  if (!confirmation) return;

  adminProducts = adminProducts.filter(product => product.id !== id);

  saveProducts();
  renderAdminProducts();

  alert("Produk berhasil dihapus.");
}

// TAMPILKAN DATA SAAT DASHBOARD DIBUKA
renderAdminProducts();
