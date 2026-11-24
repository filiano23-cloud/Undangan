// ===== Elemen =====
const lagu     = document.getElementById('lagu');
const hero     = document.getElementById('hero');
const undangan = document.getElementById('undangan');
const btnBuka  = document.getElementById('btnBuka');
const btnMute  = document.getElementById('btnMute');

// ===== Pengaturan lagu =====
lagu.loop   = true;   // diulang terus
lagu.volume = 0.3;    // 0 sampai 1

// ===== Nama tamu dari link: index.html?to=Budi+Santoso =====
const nama = new URLSearchParams(window.location.search).get('to');
if (nama) {
  document.getElementById('namaTamu').textContent = nama;
}

// ===== Buka undangan: sampul memudar, isi muncul =====
btnBuka.addEventListener('click', function () {
  lagu.play().catch(function () {});     // abaikan error jika file lagu tidak ada
  btnMute.classList.remove('d-none');

  // isi undangan disiapkan di bawah sampul
  undangan.classList.remove('d-none');
  window.scrollTo(0, 0);

  // jeda satu frame agar transisi sempat berjalan
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      hero.classList.add('keluar');      // sampul meluncur ke atas
      undangan.classList.add('tampil');  // isi memudar masuk
    });
  });

  // sembunyikan sampul setelah selesai meluncur (1s, sama dengan CSS)
  setTimeout(function () {
    hero.classList.add('d-none');
  }, 1000);
});

// ===== Tombol mute (disk) =====
btnMute.addEventListener('click', function () {
  lagu.muted = !lagu.muted;
  btnMute.classList.toggle('mati', lagu.muted);
});

// ===== Animasi muncul saat di-scroll =====
const elemenReveal = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const pengamat = new IntersectionObserver(function (daftar) {
    daftar.forEach(function (item) {
      if (item.isIntersecting) {
        item.target.classList.add('terlihat');
        pengamat.unobserve(item.target);   // animasi sekali saja
      }
    });
  }, { threshold: 0.15 });

  elemenReveal.forEach(function (el) { pengamat.observe(el); });
} else {
  // browser lama: tampilkan semuanya langsung
  elemenReveal.forEach(function (el) { el.classList.add('terlihat'); });
}

// ===== RSVP: kirim lewat WhatsApp =====
const NOMOR_WA = '6281234567890';   // GANTI dengan nomor WhatsApp penerima (kode negara, tanpa + dan tanpa 0 di depan)

const formRsvp = document.getElementById('formRsvp');
const rsvpNama = document.getElementById('rsvpNama');
const rsvpPesan = document.getElementById('rsvpPesan');

if (nama) rsvpNama.value = nama;   // isi otomatis dari link ?to=

formRsvp.addEventListener('submit', function (e) {
  e.preventDefault();

  const hadir  = document.getElementById('rsvpHadir').value;
  const jumlah = document.getElementById('rsvpJumlah').value;
  const ucapan = document.getElementById('rsvpUcapan').value.trim();

  if (!rsvpNama.value.trim() || !hadir) {
    rsvpPesan.classList.remove('d-none');
    return;
  }
  rsvpPesan.classList.add('d-none');

  const teks =
    'Konfirmasi kehadiran undangan pernikahan\n' +
    'Nama: ' + rsvpNama.value.trim() + '\n' +
    'Kehadiran: ' + hadir + '\n' +
    'Jumlah tamu: ' + jumlah + '\n' +
    'Ucapan: ' + (ucapan || '-');

  window.open('https://wa.me/' + NOMOR_WA + '?text=' + encodeURIComponent(teks), '_blank');
});

// ===== Salin nomor rekening =====
document.querySelectorAll('.btn-salin').forEach(function (tombol) {
  tombol.addEventListener('click', function () {
    const teks = document.getElementById(tombol.dataset.salin).textContent.trim();
    const teksAwal = tombol.textContent;

    function berhasil() {
      tombol.textContent = 'Tersalin!';
      tombol.classList.add('berhasil');
      setTimeout(function () {
        tombol.textContent = teksAwal;
        tombol.classList.remove('berhasil');
      }, 2000);
    }

    function cadangan() {   // untuk browser/koneksi yang tidak mendukung clipboard API
      const t = document.createElement('textarea');
      t.value = teks;
      t.style.position = 'fixed';
      t.style.opacity = '0';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); berhasil(); } catch (err) {}
      document.body.removeChild(t);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(teks).then(berhasil).catch(cadangan);
    } else {
      cadangan();
    }
  });
});