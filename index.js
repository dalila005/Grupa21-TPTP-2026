// ================================================================
// index.js — Šapa & Rep Pet Shop — Početna stranica
// Autori: [Ime i prezime studenata]
// Sadržaj:
//   1. Dark mode toggle + LocalStorage       (dijeli tptpskripte.js)
//   2. Dinamički status "Otvoreno/Zatvoreno"  (PDF §4.3)
//   3. Smooth scroll za bookmark navigaciju  (PDF §4.3)
//   4. Newsletter validacija (JS regex)      (PDF §3.3)
//   5. Animacija kategorija pri hover-u      (interaktivni element)
// ================================================================

// AI pomoć: Claude mi je objasnio DOMContentLoaded event.
// Razumijem da: ovaj event se pali kada browser završi parsiranje HTML-a,
// ali PRIJE nego što se učitaju slike i drugi resursi. Koristimo ga da
// smo sigurni da svi HTML elementi postoje kad pokušamo pristupiti njima.
document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. DARK MODE TOGGLE + LOCALSTORAGE
    //    Napomena: osnovna logika je u tptpskripte.js.
    //    Ovdje samo osiguravamo da dugme postoji na ovoj stranici.
    //    Obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio LocalStorage API.
    // Razumijem da: localStorage čuva podatke kao string parove ključ-vrijednost.
    // getItem(ključ) vraća string ili null ako ključ ne postoji.
    // setItem(ključ, vrijednost) sprema podatak koji ostaje i nakon zatvaranja browsera.

    var darkToggle = document.getElementById('darkModeToggle');
    var body       = document.body;

    // Učitaj sačuvanu preferenciju pri pokretanju
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (darkToggle) darkToggle.textContent = '☀️';
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', function () {
            // toggle: dodaje klasu ako je nema, uklanja ako postoji
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                localStorage.setItem('darkMode', 'enabled');
                darkToggle.textContent = '☀️';
            } else {
                localStorage.setItem('darkMode', 'disabled');
                darkToggle.textContent = '🌙';
            }
        });
    }


    // ============================================================
    // 2. DINAMIČKI STATUS "OTVORENO/ZATVORENO"
    //    Interaktivna statistika — obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio JavaScript Date objekt.
    // Razumijem da: new Date() kreira objekt sa trenutnim datumom i vremenom.
    // getDay() vraća broj dana u tjednu: 0 = nedjelja, 1 = ponedeljak, ..., 6 = subota.
    // getHours() vraća cijeli broj sata u lokalnom vremenu (0-23).
    // getMinutes() vraća minute (0-59).
    // Decimalni sat (sat + minute/60) omogućava precizno poređenje s radnim vremenom.

    function provjeriStatus() {
        var statusDot  = document.getElementById('statusDot');
        var statusText = document.getElementById('statusText');
        if (!statusDot || !statusText) return;

        var now        = new Date();
        var dan        = now.getDay();         // 0 = nedjelja, 1 = pon, ..., 6 = sub
        var sat        = now.getHours();
        var minut      = now.getMinutes();
        var vrijemeDec = sat + minut / 60;    // decimalni sat npr. 09:30 = 9.5
        var otvoreno   = false;

        if (dan >= 1 && dan <= 5) {
            // Ponedjeljak – Petak: 09:00 – 20:00
            otvoreno = (vrijemeDec >= 9 && vrijemeDec < 20);
        } else if (dan === 6) {
            // Subota: 09:00 – 17:00
            otvoreno = (vrijemeDec >= 9 && vrijemeDec < 17);
        } else {
            // Nedjelja: 10:00 – 15:00
            otvoreno = (vrijemeDec >= 10 && vrijemeDec < 15);
        }

        if (otvoreno) {
            statusDot.className    = 'status-dot open';
            statusText.textContent = '✅ Sada smo otvoreni';
            statusText.style.color = 'var(--boja-uspjeh)';
        } else {
            statusDot.className    = 'status-dot closed';
            statusText.textContent = '🔴 Trenutno zatvoreni';
            statusText.style.color = 'var(--boja-greska)';
        }
    }

    // Pozovi odmah, pa osvježi svake minute (60000 ms)
    provjeriStatus();
    setInterval(provjeriStatus, 60000);


    // ============================================================
    // 3. SMOOTH SCROLL ZA BOOKMARK NAVIGACIJU
    //    Obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio getBoundingClientRect i window.scrollTo.
    // Razumijem da: getBoundingClientRect() vraća poziciju elementa relativno
    // na viewport. window.scrollY je trenutna pozicija od vrha stranice.
    // Sabiramo ta dva da dobijemo apsolutnu poziciju, a oduzimamo offset
    // sticky headera (nav + bookmark-nav = ~130px) da element nije skriven.

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = link.getAttribute('href');
            if (targetId === '#') return; // prazan hash — ne radi ništa

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var offset = 130; // visina sticky headera + navigacije
                var elTop  = targetEl.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elTop - offset, behavior: 'smooth' });
            }
        });
    });


    // ============================================================
    // 4. NEWSLETTER VALIDACIJA — isključivo JavaScript regex
    //    Obavezni zahtjev (PDF §3.3, §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio regex pattern za email validaciju.
    // Razumijem da:
    //   ^         — početak stringa
    //   [\w.-]+   — jedno ili više: slova/cifri/underscore, tačke ili crtice
    //   @         — literal znak @
    //   [\w.-]+   — isti skup znakova za naziv domene
    //   \.        — escapeovana tačka (obična tačka znači "bilo koji znak")
    //   [a-z]{2,} — min. 2 mala slova za TLD (ba, com, org, net...)
    //   $         — kraj stringa
    //   i         — flag: case-insensitive (ignoriše velika/mala slova)
    var emailRegex = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;

    var newsletterBtn     = document.getElementById('newsletterBtn');
    var newsletterEmail   = document.getElementById('newsletterEmail');
    var newsletterError   = document.getElementById('newsletterError');
    var newsletterSuccess = document.getElementById('newsletterSuccess');
    var newsletterFormWrap = document.getElementById('newsletterFormWrap');

    // Live validacija: ukloni grešku čim korisnik počne pisati
    if (newsletterEmail) {
        newsletterEmail.addEventListener('input', function () {
            if (newsletterEmail.classList.contains('error')) {
                newsletterEmail.classList.remove('error');
                if (newsletterError) newsletterError.textContent = '';
            }
        });
    }

    if (newsletterBtn) {
        newsletterBtn.addEventListener('click', function () {
            var email = newsletterEmail ? newsletterEmail.value.trim() : '';

            // Validiraj email regex-om
            if (!emailRegex.test(email)) {
                if (newsletterEmail) newsletterEmail.classList.add('error');
                if (newsletterError) {
                    newsletterError.textContent = 'Unesite ispravnu email adresu (npr. ime@domena.ba).';
                }
                return; // zaustavi ako validacija ne prođe
            }

            // Validacija prošla — prikaži uspješnu poruku
            if (newsletterFormWrap) newsletterFormWrap.style.display = 'none';
            if (newsletterSuccess)  newsletterSuccess.style.display  = 'block';
        });
    }


    // ============================================================
    // 5. ANIMACIJA KATEGORIJA — interaktivni element (PDF §4.3)
    //    Kategorije dobivaju klasu 'cat-hovered' na hover/focus
    //    za dodatni vizualni efekat van CSS-a.
    // ============================================================

    // AI pomoć: Claude mi je objasnio mouseenter/mouseleave događaje.
    // Razumijem da: za razliku od mouseover/mouseout, mouseenter i mouseleave
    // se ne prenose na djecu (nema bubble-a), što ih čini idealnim za
    // hover animacije na roditeljskom elementu.

    var catBoxes = document.querySelectorAll('.cat-box');
    catBoxes.forEach(function (box) {
        box.addEventListener('mouseenter', function () {
            box.classList.add('cat-hovered');
        });
        box.addEventListener('mouseleave', function () {
            box.classList.remove('cat-hovered');
        });
        // Pristupačnost — isti efekat za keyboard korisnikе
        box.addEventListener('focus', function () {
            box.classList.add('cat-hovered');
        });
        box.addEventListener('blur', function () {
            box.classList.remove('cat-hovered');
        });
    });


    // ============================================================
    // 6. DINAMIČKI BROJAČ PROIZVODA NA POČETNOJ
    //    Prikazuje broj prikazanih kartica (uvijek 3 na početnoj)
    // ============================================================

    // AI pomoć: Claude mi je objasnio setTimeout funkciju.
    // Razumijem da: setTimeout(callback, ms) izvršava callback jednom,
    // nakon zadanog broja milisekundi. Koristimo ga za kratku CSS
    // animaciju scale-a na bedž elementu.

    function azurirajBrojacPocetna(broj) {
        var badge = document.getElementById('productCount');
        if (!badge) return;

        var rijec = (broj === 1) ? 'proizvod' : 'proizvoda';
        badge.textContent = broj + ' ' + rijec;

        // Kratka animacija scale
        badge.style.transform  = 'scale(1.25)';
        badge.style.transition = 'transform 0.15s ease';
        setTimeout(function () {
            badge.style.transform = 'scale(1)';
        }, 180);
    }

    // Postavi inicijalni broj vidljivih kartica
    var productGrid = document.getElementById('productGrid');
    if (productGrid) {
        var ukupno = productGrid.querySelectorAll('.product-card').length;
        azurirajBrojacPocetna(ukupno);
    }

}); // kraj DOMContentLoaded