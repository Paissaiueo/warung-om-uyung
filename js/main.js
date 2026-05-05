function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loadingScreen');
  if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
    loadingScreen.classList.add('hidden');
  }
}

// Hide loading screen dengan multiple triggers untuk memastikan
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(hideLoadingScreen, 2000);
});

window.addEventListener('load', () => {
  setTimeout(hideLoadingScreen, 2000);
});

// Fallback: hide jika terlalu lama
setTimeout(hideLoadingScreen, 2000);


// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorFollow = document.getElementById('cursorFollow');
let mx = 0, my = 0, fx = 0, fy = 0;

if (cursor && cursorFollow) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = (mx - 6) + 'px';
    cursor.style.top = (my - 6) + 'px';
  });
  (function animateCursor() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    cursorFollow.style.left = (fx - 18) + 'px';
    cursorFollow.style.top = (fy - 18) + 'px';
    requestAnimationFrame(animateCursor);
  })();
  document.querySelectorAll('a, button, .menu-card, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'scale(2.5)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'scale(1)');
  });
}

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
const btt = document.getElementById('btt');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 60);
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
});

// ── HERO IMAGE SCALE ──
const heroImg = document.getElementById('heroImg');
if (heroImg) {
  const onLoad = () => heroImg.classList.add('loaded');
  if (heroImg.complete) onLoad(); else heroImg.addEventListener('load', onLoad);
}

// ── DARK/LIGHT THEME TOGGLE ──
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  // Default: dark (usually handled by attribute in HTML, but ensuring here)
  if (!html.getAttribute('data-theme')) {
    html.setAttribute('data-theme', 'dark');
  }
  themeToggle.addEventListener('click', () => {
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });
}

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
}

// ── MENU FILTER ──
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');
if (filterBtns.length && menuCards.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      menuCards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.classList.toggle('hidden', !show);
        if (show) {
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = 'fadeUp 0.4s ease forwards';
        }
      });
    });
  });
}

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 200);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObserver.observe(el));
}

// ── SMOOTH SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// 4. Gallery Lightbox Logic
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCap');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryImages = document.querySelectorAll('.galeri-item img');

let currentImgIndex = 0;

if (lightbox && galleryImages.length) {
  const openLightbox = (index) => {
    currentImgIndex = index;
    const img = galleryImages[index];
    lightboxImg.src = img.src;
    lightboxCap.innerText = img.nextElementSibling ? img.nextElementSibling.innerText : '';
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock scroll
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock scroll
  };

  const nextImg = () => {
    currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
    openLightbox(currentImgIndex);
  };

  const prevImg = () => {
    currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
    openLightbox(currentImgIndex);
  };

  galleryImages.forEach((img, index) => {
    img.parentElement.addEventListener('click', () => openLightbox(index));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImg(); });
  lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextImg(); });

  // Close on click outside
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-overlay')) {
      closeLightbox();
    }
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImg();
    if (e.key === 'ArrowLeft') prevImg();
  });
}

// ── TRANSLATIONS ──
const translations = {
  id: {
    nav_about: "Tentang",
    nav_history: "Sejarah",
    nav_menu: "Menu",
    nav_vibes: "Suasana",
    nav_gallery: "Galeri",
    nav_contact: "Kontak",
    hero_tag: "// Warung Om Uyung — Bondowoso",
    hero_title_1: "MAKAN.",
    hero_title_2: "MINUM.",
    hero_title_3: "SANTAI.",
    hero_sub: "Sosis, mie instan, kopi, dan minuman segar — semua ada buat kamu. Buka Senin - Sabtu, nongkrong sepuasnya.",
    hero_btn_menu: "Lihat Menu →",
    hero_btn_contact: "Temukan Kami",
    marquee_1: "FROZEN FOOD",
    marquee_2: "TELA TELA",
    marquee_3: "JIGOR",
    marquee_4: "TAHU CRISPY",
    marquee_5: "NUTRISARI & MARIMAS",
    marquee_6: "KOPI & TEH",
    marquee_7: "NONGKRONG ASIK",
    about_label: "// 001 — Tentang Kami",
    about_title: "BUKAN<br>SEKADAR<br><em>WARUNG.</em>",
    about_text_1: "Warung Om Uyung berdiri sebagai tempat nongkrong favorit warga Bondowoso. Dengan menu sederhana tapi penuh cita rasa — sosis, mie instan, dan kopi — kami hadir menemani harimu dari pagi hingga larut malam. Tanpa ribet, tanpa basa-basi.",
    about_text_2: "Datang, duduk, santai. Semua bisa dikerjakan di sini.",
    stat_1: "Pelanggan Setia",
    stat_2: "Menu Pilihan",
    stat_3: "Hari Buka",
    about_badge: "BUKA<br>09.00–22.00",
    sejarah_label: "// 002 — Sejarah",
    sejarah_title: "DARI BAWAH,<br>KINI <span class=\"line-red\">DI ATAS.</span>",
    timeline_1_title: "Awal Mula",
    timeline_1_text: "Om Uyung memulai usahanya bersama sang istri tercinta, Risnani. Berbekal tekad dan semangat yang kuat, keduanya merintis warung dari nol — menjajakan makanan dan minuman sederhana di atas trotoar depan rumah, tanpa gedung, tanpa fasilitas mewah. Hanya niat tulus untuk melayani dan mencari rezeki bersama.",
    timeline_2_title: "Naik ke Atas",
    timeline_2_text: "Hujan deras tak pernah jadi alasan untuk berhenti. Setiap kali hujan turun, Om Uyung dan Risnani dengan sabar mendorong seluruh dagangan dari trotoar ke atas — masuk ke halaman rumah agar tetap aman dan bisa terus berjualan. Rutinitas itu akhirnya jadi keputusan — warung resmi pindah ke atas secara permanen. Lebih terlindungi, lebih nyaman, dan makin mudah dijangkau pelanggan.",
    timeline_3_year: "Kini",
    timeline_3_title: "Warung Favorit Bondowoso",
    timeline_3_text: "Dari lapak kecil yang berdiri di bawah terik dan hujan, kini Warung Om Uyung telah tumbuh menjadi salah satu tempat nongkrong favorit warga Bondowoso. Ratusan pelanggan setia datang silih berganti — bukan hanya untuk makan dan minum, tapi juga untuk merasakan kehangatan yang selalu Om Uyung dan Risnani hadirkan setiap harinya. Sebuah perjalanan panjang yang dimulai dari kesederhanaan, dan terus bertumbuh dengan penuh rasa syukur.",
    menu_label: "// 003 — Menu Kami",
    menu_title: "PILIH<br>PUASMU",
    filter_all: "Semua",
    filter_food: "Makanan",
    filter_drink: "Minuman",
    menu_desc_frozen: "Nugget, sosis, dan kentang goreng pilihan yang gurih.",
    menu_desc_tela: "Singkong goreng bumbu renyah dengan berbagai pilihan rasa.",
    menu_desc_jigor: "Cemilan khas tahu goreng gurih dengan sambal mantap.",
    menu_desc_tahu: "Cemilan khas tahu goreng gurih dengan bumbu istimewa",
    menu_desc_mie: "Mie instan legendaris dimasak dengan bumbu rahasia Om Uyung.",
    menu_desc_snack: "Berbagai pilihan snack untuk teman ngobrol santai.",
    menu_desc_popice: "Minuman es blender dengan berbagai rasa buah dan cokelat.",
    menu_desc_nutrisari: "Minuman buah segar yang instan melepaskan dahaga.",
    menu_desc_kopi: "Kopi hitam atau kopi susu spesial buat kamu.",
    menu_teh: "Teh Hangat",
    menu_desc_teh: "Teh manis hangat atau es teh yang menenangkan.",
    menu_desc_chocolatos: "Minuman cokelat dingin yang manis dan menyegarkan, cocok buat penghilang dahaga.",
    menu_desc_joshua: "Minuman segar rasa buah yang dingin dan bikin nagih, favorit anak muda.",
    vibes_label: "// 004 — Suasana",
    vibes_title: "TEMPAT<br>KAMU <span>BETAH</span><br>BERLAMA-LAMA",
    vibes_text: "Nikmati fasilitas terbaik kami yang bikin kamu mager pulang. Warung paling asik di Bondowoso!",
    vibes_feat_1: "Tempat nyaman — buat sendiri atau rame-rame",
    vibes_feat_2: "Sejuk dan asri — udara segar alami",
    vibes_feat_3: "Banyak pepohonan — suasana hijau menenangkan",
    vibes_feat_4: "Cocok buat nongkrong sampe malem",
    gallery_label: "// 005 — Galeri",
    gallery_title: "MOMEN<br>BERSAMA",
    gallery_desc: "Teman-teman yang pernah mampir dan nongkrong bareng di Warung Om Uyung. Kapan giliran kamu?",
    gal_cap_1: "Nongkrong Bareng — Depan Warung",
    gal_cap_2: "Seru-seruan Bareng",
    gal_cap_3: "Kalangan Orang Tua Berkumpul",
    gal_cap_4: "Momen Santai",
    gal_cap_5: "Momen Sore Hari",
    gal_cap_6: "Rame dan Seru",
    gal_cap_7: "Rameee — Makin Seru!",
    contact_label: "// 006 — Kontak",
    contact_title: "MAMPIR<br><span>YUKK</span><br>LANGSUNG!",
    contact_text: "Nggak bisa pesan online — tapi bisa tanya-tanya dulu lewat WhatsApp atau langsung mampir ke warung. Kami selalu siap!",
    contact_address_label: "Alamat",
    contact_hours_label: "Jam Buka",
    contact_hours_val: "Senin - Sabtu<br>09.00 — 22.00 WIB",
    contact_wa_btn: "Chat di WhatsApp",
    map_tag: "TEMUKAN KAMI",
    footer_copy: "© 2026 Warung Om Uyung — Bondowoso, Jawa Timur<br>Makan · Minum · Santai"
  },
  en: {
    nav_about: "About",
    nav_history: "History",
    nav_menu: "Menu",
    nav_vibes: "Vibes",
    nav_gallery: "Gallery",
    nav_contact: "Contact",
    hero_tag: "// Warung Om Uyung — Bondowoso",
    hero_title_1: "EAT.",
    hero_title_2: "DRINK.",
    hero_title_3: "CHILL.",
    hero_sub: "Sausages, instant noodles, coffee, and fresh drinks — everything is here for you. Open Monday - Saturday, hang out as much as you like.",
    hero_btn_menu: "View Menu →",
    hero_btn_contact: "Find Us",
    marquee_1: "FROZEN FOOD",
    marquee_2: "TELA TELA",
    marquee_3: "JIGOR",
    marquee_4: "CRISPY TOFU",
    marquee_5: "NUTRISARI & MARIMAS",
    marquee_6: "COFFEE & TEA",
    marquee_7: "CHILL HANGOUT",
    about_label: "// 001 — About Us",
    about_title: "NOT<br>JUST A<br><em>STALL.</em>",
    about_text_1: "Warung Om Uyung stands as a favorite hangout spot for Bondowoso residents. With a simple but flavorful menu — sausages, instant noodles, and coffee — we are here to accompany your day from morning until late at night. No fuss, no nonsense.",
    about_text_2: "Come, sit, relax. Everything can be done here.",
    stat_1: "Loyal Customers",
    stat_2: "Selected Menus",
    stat_3: "Days Open",
    about_badge: "OPEN<br>09.00–22.00",
    sejarah_label: "// 002 — History",
    sejarah_title: "FROM BOTTOM,<br>NOW <span class=\"line-red\">ON TOP.</span>",
    timeline_1_title: "The Beginning",
    timeline_1_text: "Om Uyung started his business with his beloved wife, Risnani. Armed with determination and strong spirit, both started the stall from scratch — selling simple food and drinks on the sidewalk in front of their house, without a building, without fancy facilities. Only a sincere intention to serve and earn a living together.",
    timeline_2_title: "Moving Up",
    timeline_2_text: "Heavy rain was never an excuse to stop. Every time it rained, Om Uyung and Risnani patiently pushed all their merchandise from the sidewalk up — into the yard so it remained safe and they could continue selling. That routine eventually became a decision — the stall officially moved up permanently. More protected, more comfortable, and easier for customers to reach.",
    timeline_3_year: "Now",
    timeline_3_title: "Bondowoso's Favorite Stall",
    timeline_3_text: "From a small stall standing under the sun and rain, now Warung Om Uyung has grown into one of the favorite hangout spots for Bondowoso residents. Hundreds of loyal customers come and go — not just to eat and drink, but also to feel the warmth that Om Uyung and Risnani always bring every day. A long journey that started from simplicity and continues to grow with full gratitude.",
    menu_label: "// 003 — Our Menu",
    menu_title: "PICK<br>YOUR JOY",
    filter_all: "All",
    filter_food: "Food",
    filter_drink: "Drinks",
    menu_desc_frozen: "Selected savory nuggets, sausages, and french fries.",
    menu_desc_tela: "Crispy fried cassava with various flavor options.",
    menu_desc_jigor: "Typical savory fried tofu snack with great chili sauce.",
    menu_desc_tahu: "Typical savory fried tofu snack with special seasoning",
    menu_desc_mie: "Legendary instant noodles cooked with Om Uyung's secret recipe.",
    menu_desc_snack: "Various snack options for casual chatting.",
    menu_desc_popice: "Blended ice drinks with various fruit and chocolate flavors.",
    menu_desc_nutrisari: "Fresh instant fruit drinks to quench your thirst.",
    menu_desc_kopi: "Black coffee or special milk coffee for you.",
    menu_teh: "Warm Tea",
    menu_desc_teh: "Warm sweet tea or soothing iced tea.",
    menu_desc_chocolatos: "Sweet and refreshing cold chocolate drink, perfect for thirst quencher.",
    menu_desc_joshua: "Fresh fruit-flavored drink that is cold and addictive, youth's favorite.",
    vibes_label: "// 004 — Vibes",
    vibes_title: "A PLACE<br>YOU'LL <span>LOVE</span><br>TO LINGER",
    vibes_text: "Enjoy our best facilities that make you lazy to go home. The coolest stall in Bondowoso!",
    vibes_feat_1: "Comfortable place — for solo or group",
    vibes_feat_2: "Cool and beautiful — fresh natural air",
    vibes_feat_3: "Many trees — calming green atmosphere",
    vibes_feat_4: "Perfect for hanging out until night",
    gallery_label: "// 005 — Gallery",
    gallery_title: "MOMENTS<br>TOGETHER",
    gallery_desc: "Friends who have stopped by and hung out together at Warung Om Uyung. When is your turn?",
    gal_cap_1: "Hanging Out Together — Front of Stall",
    gal_cap_2: "Having Fun Together",
    gal_cap_3: "Parents Gathering",
    gal_cap_4: "Relaxing Moments",
    gal_cap_5: "Afternoon Moments",
    gal_cap_6: "Crowded and Fun",
    gal_cap_7: "Crowded — Getting More Exciting!",
    contact_label: "// 006 — Contact",
    contact_title: "DROP BY<br><span>YUKK</span><br>DIRECTLY!",
    contact_text: "Can't order online — but you can ask first via WhatsApp or drop by the stall directly. We are always ready!",
    contact_address_label: "Address",
    contact_hours_label: "Opening Hours",
    contact_hours_val: "Monday - Saturday<br>09.00 — 22.00 WIB",
    contact_wa_btn: "Chat on WhatsApp",
    map_tag: "FIND US",
    footer_copy: "© 2026 Warung Om Uyung — Bondowoso, East Java<br>Eat · Drink · Chill"
  }
};

function setLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });
  // Update toggle button text
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.querySelector('.lang-text').innerText = lang.toUpperCase();
  }
  localStorage.setItem('language', lang);
  document.documentElement.lang = lang;
}

// Language Toggle Event
const langToggle = document.getElementById('langToggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const currentLang = localStorage.getItem('language') || 'id';
    const newLang = currentLang === 'id' ? 'en' : 'id';
    setLanguage(newLang);
  });
}

// Initialize Language
const savedLang = localStorage.getItem('language') || 'id';
setLanguage(savedLang);

// ── NEW FEATURES ──

// 1. Scroll Progress Bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (scrollProgress) scrollProgress.style.width = scrolled + "%";
});


// 3. Parallax Effect
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;

  // Hero Parallax
  // const heroImg = document.querySelector('.hero-img');
  // if (heroImg) {
  //   heroImg.style.transform = `translateY(${scrolled * 0.4}px)`;
  // }

  // History Timeline Parallax
  const timelineItems = document.querySelectorAll('.timeline-item');
  timelineItems.forEach((item, index) => {
    const speed = 0.05 + (index * 0.02);
    const rect = item.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const yPos = (window.innerHeight - rect.top) * speed;
      item.style.transform = `translateY(${-yPos}px)`;
    }
  });
});

// =====================
// CART LOGIC
// =====================
let cart = [];

const floatingCart = document.getElementById('floatingCart');
const navCartBtn = document.getElementById('navCartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCart');
const cartBadge = document.getElementById('cartBadge');
const navCartBadge = document.getElementById('navCartBadge');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// Function to format Rupiah
const formatRp = (num) => {
  return 'Rp ' + num.toLocaleString('id-ID');
};

// Add to Cart Event
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent card click
    const card = btn.closest('.menu-card');
    const name = card.dataset.name;
    const price = parseInt(card.dataset.price);
    const img = card.dataset.img;

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.qty += 1;
    } else {
      cart.push({ name, price, img, qty: 1 });
    }

    updateCartUI();

    // --- Fly to Cart Animation ---
    const btnRect = btn.getBoundingClientRect();
    const targetEl = document.getElementById('navCartBtn');
    const targetRect = targetEl ? targetEl.getBoundingClientRect() : null;

    if (targetRect) {
      const dot = document.createElement('div');
      dot.classList.add('fly-dot');

      // Start position: center of button
      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;

      // End position: center of navbar cart icon
      const endX = targetRect.left + targetRect.width / 2;
      const endY = targetRect.top + targetRect.height / 2;

      // Calculate distance
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      dot.style.left = startX + 'px';
      dot.style.top = startY + 'px';
      dot.style.setProperty('--fly-x', deltaX + 'px');
      dot.style.setProperty('--fly-y', deltaY + 'px');

      document.body.appendChild(dot);

      // Remove after animation
      dot.addEventListener('animationend', () => {
        dot.remove();
        // Pulse the navbar cart icon
        if (targetEl) {
          targetEl.classList.add('cart-pulse');
          setTimeout(() => targetEl.classList.remove('cart-pulse'), 400);
        }
      });
    }
    
    // Animate button text (prevent text sticking on double click)
    if (btn.dataset.animating === "true") return;
    
    btn.dataset.animating = "true";
    btn.innerText = "✓ Ditambahkan";
    btn.style.background = "#25d366";
    btn.style.color = "#fff";
    btn.style.borderColor = "#25d366";
    
    setTimeout(() => {
      btn.innerText = "+ Keranjang";
      btn.style = "";
      btn.dataset.animating = "false";
    }, 1500);
  });
});

// Update Cart UI
function updateCartUI() {
  // Update Badge
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  if(cartBadge) cartBadge.innerText = totalItems;
  if(navCartBadge) {
    navCartBadge.innerText = totalItems;
    if (totalItems > 0) {
      navCartBadge.classList.add('visible');
    } else {
      navCartBadge.classList.remove('visible');
    }
  }

  if (totalItems > 0) {
    if(floatingCart) floatingCart.classList.add('visible');
    if(checkoutBtn) checkoutBtn.disabled = false;
  } else {
    if(floatingCart) floatingCart.classList.remove('visible');
    if(checkoutBtn) checkoutBtn.disabled = true;
  }

  // Update Items List
  if(!cartItemsContainer) return;
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="cart-empty">Keranjang masih kosong</div>';
    if(cartTotalEl) cartTotalEl.innerText = formatRp(0);
    return;
  }

  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.qty;
    
    const itemEl = document.createElement('div');
    itemEl.classList.add('cart-item');
    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatRp(item.price)}</div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
        <span class="item-qty">${item.qty}</span>
        <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
      </div>
    `;
    cartItemsContainer.appendChild(itemEl);
  });

  if(cartTotalEl) cartTotalEl.innerText = formatRp(totalPrice);
}

// Update Quantity globally
window.updateQty = (index, change) => {
  if (cart[index]) {
    cart[index].qty += change;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCartUI();
  }
};

// Open/Close Cart
const openCart = () => {
  cartSidebar.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
};

if (floatingCart) floatingCart.addEventListener('click', openCart);
if (navCartBtn) navCartBtn.addEventListener('click', openCart);

const closeCart = () => {
  if(cartSidebar) cartSidebar.classList.remove('active');
  if(cartOverlay) cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
};

if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Checkout via WhatsApp
if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) return;

    const customerName = document.getElementById('customerName')?.value.trim() || '';
    const customerNotes = document.getElementById('customerNotes')?.value.trim() || '';

    let text = "Halo Om Uyung! Saya ingin memesan menu berikut:%0A%0A";
    
    if (customerName) {
      text = `Halo Om Uyung!%0A%0A*Nama Pemesan:* ${customerName}%0A%0APesanan:%0A`;
    }

    let total = 0;
    
    cart.forEach(item => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;
      text += `- ${item.qty}x ${item.name} (Rp ${item.price.toLocaleString('id-ID')})%0A`;
    });
    
    text += `%0A*Total: Rp ${total.toLocaleString('id-ID')}*`;

    if (customerNotes) {
      text += `%0A%0A*Catatan:* ${customerNotes}`;
    }

    text += `%0A%0AMohon disiapkan ya! 🙏`;
    
    const waNumber = "6282142182427";
    const waLink = `https://wa.me/${waNumber}?text=${text}`;
    
    window.open(waLink, '_blank');
  });
}