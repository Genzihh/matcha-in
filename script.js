
   /* ==========================================
   1. GLOBAL DATA & INITIALIZATION
   ========================================== */
// Mengambil data dari localStorage agar tidak hilang saat pindah halaman
let cart = JSON.parse(localStorage.getItem('matchain_cart')) || [];

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan update tampilan saat halaman dibuka
    updateCartBadge();
    renderCart();
    
    // Inisialisasi fitur Home (Slider & Fading) jika elemennya ada
    const containers = document.querySelectorAll('.product-image-container');
    if (containers.length > 0) {
        initImageLoop();
    }
});

function saveCart() {
    localStorage.setItem('matchain_cart', JSON.stringify(cart));
}

/* ==========================================
   2. FUNGSI SLIDER & ANIMASI (HOME PAGE)
   ========================================== */
function slideRight() { 
    const scrollContainer = document.getElementById("productScroller");
    if (scrollContainer) scrollContainer.scrollBy({ left: 300, behavior: "smooth" }); 
}

function slideLeft() { 
    const scrollContainer = document.getElementById("productScroller");
    if (scrollContainer) scrollContainer.scrollBy({ left: -300, behavior: "smooth" }); 
}

function initImageLoop() {
    const containers = document.querySelectorAll('.product-image-container');
    let showFirst = false;

    setInterval(() => {
        containers.forEach(container => {
            const img1 = container.querySelector('.img-1');
            const img2 = container.querySelector('.img-2');
            if (img1 && img2) {
                if (showFirst) {
                    img1.style.opacity = "1";
                    img2.style.opacity = "0";
                } else {
                    img1.style.opacity = "0";
                    img2.style.opacity = "1";
                }
            }
        });
        showFirst = !showFirst;
    }, 3000);
}

/* ==========================================
   3. FUNGSI KERANJANG (LOGIKA UTAMA)
   ========================================== */
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (!drawer || !overlay) return;

    drawer.classList.toggle('active');
    
    if (drawer.classList.contains('active')) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function addToCart(name, price, image, quantity = 1) {
    const existingProduct = cart.find(item => item.name === name);
    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        cart.push({ name, price, image, quantity: quantity });
    }

    saveCart();
    renderCart();
    updateCartBadge();
    toggleCart(); // Buka drawer otomatis
}

function renderCart() {
    const cartContent = document.querySelector('.cart-content');
    const subtotalElement = document.querySelector('.subtotal-price');
    if (!cartContent) return;

    let html = '';
    let total = 0;

    if (cart.length === 0) {
        cartContent.innerHTML = '<p style="text-align:center; padding:40px; font-family:Inter; color:#666;">Keranjangmu masih kosong.</p>';
        if (subtotalElement) subtotalElement.innerText = 'Rp0';
        return;
    }

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        html += `
            <div class="cart-item" style="display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee;">
                <div class="item-image-container" style="width: 80px; height: 80px; flex-shrink: 0;">
                    <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="item-details" style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <h3 style="font-family:'Courier Prime', monospace; font-size: 1rem; margin:0;">${item.name}</h3>
                        <span style="font-weight: 600;">Rp${(item.price * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                    <p style="font-size: 0.8rem; color: #666; margin: 5px 0 10px 0;">RTD - 250ml</p>
                    <div class="quantity-selector-cart" style="display: inline-flex; border: 1px solid #ccc;">
                        <button onclick="changeQtyCart(${index}, -1)" style="width:25px; cursor:pointer; background:none; border:none;">−</button>
                        <input type="text" value="${item.quantity}" readonly style="width:30px; text-align:center; border:none;">
                        <button onclick="changeQtyCart(${index}, 1)" style="width:25px; cursor:pointer; background:none; border:none;">+</button>
                    </div>
                </div>
            </div>`;
    });

    cartContent.innerHTML = html;
    if (subtotalElement) subtotalElement.innerText = `Rp${total.toLocaleString('id-ID')}`;
}

// Fungsi ganti jumlah KHUSUS di dalam keranjang
function changeQtyCart(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart();
    renderCart();
    updateCartBadge();
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalItems;
        totalItems > 0 ? badge.classList.add('show') : badge.classList.remove('show');
    }
}

/* ==========================================
   4. FUNGSI DETAIL PRODUK (STROBERI.HTML, DLL)
   ========================================== */

// Fungsi ganti jumlah di halaman DETAIL (sebelum masuk keranjang)
function changeQtyDetail(val) {
    const input = document.getElementById('qty');
    if (!input) return;
    let current = parseInt(input.value) || 1;
    if (current + val >= 1) {
        input.value = current + val;
    }
}

function validateQty(input) {
    if (input.value < 1) input.value = 1;
}

function handleAddToCart() {
    // Mengambil data otomatis dari teks di halaman
    const name = document.querySelector('.detail-title').innerText;
    const priceText = document.querySelector('.detail-price').innerText;
    const price = parseInt(priceText.replace(/[^0-9]/g, '')); 
    const image = document.querySelector('.img-1').getAttribute('src');
    const qty = parseInt(document.getElementById('qty').value) || 1;

    // Masukkan ke sistem utama keranjang
    addToCart(name, price, image, qty);
}

let slideIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan slider jika ada di halaman tersebut
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length > 0) {
        showHeroSlides();
    }
});

function showHeroSlides() {
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");
    
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));

    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;

    slides[slideIndex - 1].classList.add("active");
    dots[slideIndex - 1].classList.add("active");

    setTimeout(showHeroSlides, 5000); // Berganti tiap 5 detik
}

function currentSlide(n) {
    slideIndex = n;
    const slides = document.querySelectorAll(".hero-slide");
    const dots = document.querySelectorAll(".dot");
    
    slides.forEach(s => s.classList.remove("active"));
    dots.forEach(d => d.classList.remove("active"));
    
    slides[n].classList.add("active");
    dots[n].classList.add("active");
}


document.addEventListener('DOMContentLoaded', () => {
    const bottomAd = document.getElementById('bottomAds');

    const observerOptions = {
        threshold: 0.2 // Banner akan muncul jika 20% bagiannya sudah terlihat
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, observerOptions);

    if (bottomAd) {
        observer.observe(bottomAd);
    }
});