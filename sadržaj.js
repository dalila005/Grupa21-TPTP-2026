// ================================================================
// tptpskripte.js — Šapa & Rep Pet Shop
// Autori: [Ime i prezime studenata]
// Sadržaj:
//   1. Dark mode toggle + LocalStorage
//   2. Filtriranje kartica bez reload-a
//   3. Dinamički brojač proizvoda
//   4. Status "Otvoreno/Zatvoreno"
//   5. Smooth scroll za bookmark navigaciju
//   6. Validacija kontakt forme (JS regex)
//   7. Hamburger meni (mobilni drawer)
// ================================================================

// AI pomoć: Claude mi je objasnio DOMContentLoaded event.
// Razumijem da: ovaj event se pali kada browser završi parsiranje HTML-a,
// ali PRIJE nego što se učitaju slike i drugi resursi. Koristimo ga da
// smo sigurni da svi HTML elementi postoje kad pokušamo pristupiti njima.
document.addEventListener('DOMContentLoaded', function () {

    // ============================================================
    // 1. DARK MODE TOGGLE + LOCALSTORAGE
    //    Obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio LocalStorage API.
    // Razumijem da: localStorage čuva podatke kao string parove ključ-vrijednost.
    // getItem(ključ) vraća string ili null ako ključ ne postoji.
    // setItem(ključ, vrijednost) sprema podatak koji ostaje i nakon zatvaranja browsera.
    // Ovo je drugačije od sessionStorage koji se briše zatvaranjem taba.

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
    // 2. FILTRIRANJE KARTICA BEZ RELOAD-A
    //    Obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio dataset property.
    // Razumijem da: HTML atribut data-filter="pas" postaje dostupan u JS-u
    // kao element.dataset.filter — browser sam pretvara kebab-case u camelCase
    // (npr. data-my-value → dataset.myValue).

    var filterButtons = document.querySelectorAll('.filter-btn');
    var productGrid   = document.getElementById('productGrid');
    var noResults     = document.getElementById('noResults');

    if (filterButtons.length > 0 && productGrid) {
        filterButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {

                // Ukloni 'active' sa svih dugmadi
                filterButtons.forEach(function (b) {
                    b.classList.remove('active');
                });
                // Postavi 'active' na kliknuto dugme
                btn.classList.add('active');

                var filterVrijednost = btn.dataset.filter; // 'sve', 'pas', 'macka'...
                var kartice          = productGrid.querySelectorAll('.product-card');
                var vidljivo         = 0;

                // Prolazi kroz svaku karticu
                kartice.forEach(function (kartica) {
                    if (filterVrijednost === 'sve' || kartica.dataset.category === filterVrijednost) {
                        kartica.classList.remove('hidden');
                        vidljivo++;
                    } else {
                        kartica.classList.add('hidden');
                    }
                });

                // Ažuriraj brojač
                azurirajBrojac(vidljivo);

                // Prikaži/sakrij poruku "nema rezultata"
                if (noResults) {
                    noResults.style.display = (vidljivo === 0) ? 'block' : 'none';
                }
            });
        });
    }


    // ============================================================
    // 3. DINAMIČKI BROJAČ PROIZVODA — interaktivni element
    //    Obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio setTimeout funkciju.
    // Razumijem da: setTimeout(callback, millisekunde) izvršava callback funkciju
    // jednom, nakon zadanog broja milisekundi. Ovo koristimo za kratku
    // CSS animaciju — postavi scale na 1.25, pa vrati na 1 nakon 180ms.

    function azurirajBrojac(broj) {
        var badge = document.getElementById('productCount');
        if (!badge) return;

        // Bosanski padežni oblici
        var rijec = (broj === 1) ? 'proizvod' : 'proizvoda';
        badge.textContent = broj + ' ' + rijec;

        // Kratka animacija scale
        badge.style.transform  = 'scale(1.25)';
        badge.style.transition = 'transform 0.15s ease';
        setTimeout(function () {
            badge.style.transform = 'scale(1)';
        }, 180);
    }

    // Postavi inicijalni broj
    if (productGrid) {
        var ukupnoKartica = productGrid.querySelectorAll('.product-card').length;
        azurirajBrojac(ukupnoKartica);
    }


    // ============================================================
    // 4. STATUS "OTVORENO/ZATVORENO" — dinamički / timer element
    //    Obavezni zahtjev: interaktivna statistika (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio JavaScript Date objekt.
    // Razumijem da: new Date() kreira objekt sa trenutnim datumom i vremenom.
    // getDay() vraća broj dana u tjednu: 0 = nedjelja, 1 = ponedeljak, ..., 6 = subota.
    // getHours() vraća cijeli broj sata u lokalnom vremenu (0-23).
    // getMinutes() vraća minute (0-59).

    function provjeriStatus() {
        var statusDot  = document.querySelector('.status-dot');
        var statusText = document.getElementById('statusText');
        if (!statusDot || !statusText) return;

        var now         = new Date();
        var dan         = now.getDay();          // 0=ned, 1=pon, ..., 6=sub
        var sat         = now.getHours();
        var minut       = now.getMinutes();
        var vrijemeDec  = sat + minut / 60;      // decimalni sat za poređenje
        var otvoreno    = false;

        if (dan >= 1 && dan <= 5) {
            // Pon–Pet: 09:00–20:00
            otvoreno = (vrijemeDec >= 9 && vrijemeDec < 20);
        } else if (dan === 6) {
            // Subota: 09:00–17:00
            otvoreno = (vrijemeDec >= 9 && vrijemeDec < 17);
        } else {
            // Nedjelja: 10:00–15:00
            otvoreno = (vrijemeDec >= 10 && vrijemeDec < 15);
        }

        if (otvoreno) {
            statusDot.className    = 'status-dot open';
            statusText.textContent = 'Sada smo otvoreni';
            statusText.style.color = '#4caf7d';
        } else {
            statusDot.className    = 'status-dot closed';
            statusText.textContent = 'Trenutno zatvoreni';
            statusText.style.color = '#e05b5b';
        }
    }

    provjeriStatus();
    // Osvježi svake minute
    setInterval(provjeriStatus, 60000);


    // ============================================================
    // 5. SMOOTH SCROLL ZA BOOKMARK NAVIGACIJU
    //    Obavezni zahtjev (PDF §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio getBoundingClientRect i window.scrollTo.
    // Razumijem da: getBoundingClientRect() vraća poziciju elementa relativno
    // na viewport (vidljivi dio ekrana). window.scrollY je trenutna pozicija
    // skrolovanja od vrha stranice. Sabirajući ta dva dobijamo apsolutnu
    // poziciju na stranici, pa oduzimamo offset headera (140px) da element
    // ne bude skriven ispod sticky navigacije.

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = link.getAttribute('href');
            if (targetId === '#') return; // prazan hash — ne radi ništa

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var offset    = 130; // visina sticky headera + bookmark bara
                var elTop     = targetEl.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elTop - offset, behavior: 'smooth' });

                // Na mobilnom: zatvori drawer kada se klikne na sekciju link
                zatvoriMeni();
            }
        });
    });


    // ============================================================
    // 6. VALIDACIJA KONTAKT FORME — isključivo JavaScript
    //    Obavezni zahtjev (PDF §3.3, §4.3)
    // ============================================================

    // AI pomoć: Ovaj regex pattern za email sam pronašao/la uz pomoć Claude-a.
    // Razumijem da:
    //   ^         — početak stringa
    //   [\w.-]+   — jedno ili više: slova/cifri/underscore (\w), tačke (.) ili crtice (-)
    //   @         — literal znak @
    //   [\w.-]+   — isti skup znakova za naziv domene
    //   \.        — escapeovana tačka (obična tačka bi značila "bilo koji znak")
    //   [a-z]{2,} — min. 2 mala slova za TLD (ba, com, org, net...)
    //   $         — kraj stringa
    //   i         — flag: case-insensitive (ignoriše velika/mala slova)
    var emailRegex   = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;

    // AI pomoć: Claude mi je objasnio ovaj regex za telefon.
    // Razumijem da:
    //   ^               — početak
    //   [\d\s\-\+\(\)]+ — jedno ili više: cifri (\d), razmaka (\s),
    //                     crtice (-), plusa (+), zagrada (())
    //   {7,15}          — ukupno između 7 i 15 znakova
    //   $               — kraj
    var telefonRegex = /^[\d\s\-\+\(\)]{7,15}$/;

    var forma = document.getElementById('contactForm');
    if (!forma) return; // nije na kontakt.html — izlaz iz funkcije

    var submitBtn    = document.getElementById('submitBtn');
    var resetBtn     = document.getElementById('resetBtn');
    var successMsg   = document.getElementById('successMsg');
    var successTitle = document.getElementById('successTitle');

    // -- Pomoćna: prikaži grešku pored polja (PDF §3.3)
    function prikaziGresku(polje, tekst) {
        polje.classList.add('error');
        var errorEl = document.getElementById(polje.id + 'Error');
        if (errorEl) errorEl.textContent = tekst;
    }

    // -- Pomoćna: ukloni grešku s polja
    function ukloniGresku(polje) {
        polje.classList.remove('error');
        var errorEl = document.getElementById(polje.id + 'Error');
        if (errorEl) errorEl.textContent = '';
    }

    // -- Live validacija: ukloni grešku čim korisnik počne pisati
    ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(function (id) {
        var polje = document.getElementById(id);
        if (!polje) return;
        polje.addEventListener('input', function () {
            if (polje.classList.contains('error')) ukloniGresku(polje);
        });
        // blur — validacija pri izlasku sa polja
        polje.addEventListener('blur', function () {
            validirajPolje(polje);
        });
    });

    // -- Validacija jednog polja — vraća true/false
    function validirajPolje(polje) {
        var v = polje.value.trim(); // trim uklanja razmake s početka i kraja

        if (polje.id === 'ime' && v.length < 2) {
            prikaziGresku(polje, 'Ime mora imati najmanje 2 slova.');
            return false;
        }
        if (polje.id === 'prezime' && v.length < 2) {
            prikaziGresku(polje, 'Prezime mora imati najmanje 2 slova.');
            return false;
        }
        if (polje.id === 'email' && !emailRegex.test(v)) {
            prikaziGresku(polje, 'Unesite ispravnu email adresu (npr. ime@domena.ba).');
            return false;
        }
        if (polje.id === 'telefon' && !telefonRegex.test(v)) {
            prikaziGresku(polje, 'Telefon može sadržavati samo cifre, razmake i crtice.');
            return false;
        }
        if (polje.id === 'tema' && v === '') {
            prikaziGresku(polje, 'Odaberite temu upita.');
            return false;
        }
        if (polje.id === 'poruka' && v.length < 10) {
            prikaziGresku(polje, 'Poruka mora imati najmanje 10 znakova.');
            return false;
        }

        ukloniGresku(polje);
        return true;
    }

    // -- Submit — provjeri sva polja
    if (submitBtn) {
        submitBtn.addEventListener('click', function (e) {
            e.preventDefault(); // spriječi reload stranice

            var ids         = ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'];
            var sveIspravno = true;

            ids.forEach(function (id) {
                var polje = document.getElementById(id);
                if (polje && !validirajPolje(polje)) {
                    sveIspravno = false;
                }
            });

            if (sveIspravno) {
                // Personalizirana uspješna poruka sa imenom — obavezni zahtjev (PDF §3.3)
                var imeKorisnika = document.getElementById('ime').value.trim();
                if (successTitle) {
                    successTitle.textContent = 'Hvala, ' + imeKorisnika + '!';
                }
                forma.style.display      = 'none';
                if (successMsg) successMsg.style.display = 'block';
            } else {
                // Skroluj do prve greške
                var prvaGreska = forma.querySelector('.error');
                if (prvaGreska) {
                    prvaGreska.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    // -- Reset dugme — briše formu i sve greške (obavezni zahtjev, PDF §3.3)
    if (resetBtn) {
        resetBtn.addEventListener('click', function () {
            forma.reset(); // HTML reset — briše sve unose
            ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(function (id) {
                var polje = document.getElementById(id);
                if (polje) ukloniGresku(polje);
            });
        });
    }

    // -- "Pošalji novu poruku" — vrati formu
    var newMsgBtn = document.getElementById('newMsgBtn');
    if (newMsgBtn) {
        newMsgBtn.addEventListener('click', function () {
            forma.reset();
            if (successMsg) successMsg.style.display = 'none';
            forma.style.display = 'flex';
        });
    }


    // ============================================================
    // 7. HAMBURGER MENI — mobilni drawer (slide-in navigacija)
    //    Prikazuje se samo na ekranima ≤750px
    // ============================================================

    // AI pomoć: Claude mi je objasnio aria-expanded atribut.
    // Razumijem da: aria-expanded je ARIA atribut koji čitačima ekrana (screen readers)
    // govori da li je neka komponenta otvorena ili zatvorena.
    // Postavljamo ga na 'true' kada je meni otvoren, i 'false' kada je zatvoren.
    // Ovo je važno za pristupačnost (accessibility) web stranice.

    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var sideNav      = document.getElementById('sideNav');
    var navOverlay   = document.getElementById('navOverlay');
    var navCloseBtn  = document.getElementById('navCloseBtn');

    // Pomoćna funkcija: otvori meni
    function otvoriMeni() {
        if (!sideNav) return;
        sideNav.classList.add('nav-open');
        if (hamburgerBtn) {
            hamburgerBtn.classList.add('is-open');
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        }
        if (navOverlay) navOverlay.classList.add('visible');
        // Spriječi scroll stranice iza drawera
        body.style.overflow = 'hidden';
    }

    // Pomoćna funkcija: zatvori meni
    function zatvoriMeni() {
        if (!sideNav) return;
        sideNav.classList.remove('nav-open');
        if (hamburgerBtn) {
            hamburgerBtn.classList.remove('is-open');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
        if (navOverlay) navOverlay.classList.remove('visible');
        // Vrati scroll stranice
        body.style.overflow = '';
    }

    // Klik na hamburger dugme — toggle otvori/zatvori
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function () {
            if (sideNav.classList.contains('nav-open')) {
                zatvoriMeni();
            } else {
                otvoriMeni();
            }
        });
    }

    // Klik na X dugme unutar drawera — zatvori meni
    if (navCloseBtn) {
        navCloseBtn.addEventListener('click', zatvoriMeni);
    }

    // Klik na overlay (tamna pozadina) — zatvori meni
    if (navOverlay) {
        navOverlay.addEventListener('click', zatvoriMeni);
    }

    // Tipka Escape — zatvori meni (pristupačnost/accessibility)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sideNav && sideNav.classList.contains('nav-open')) {
            zatvoriMeni();
            // Vrati fokus na hamburger dugme
            if (hamburgerBtn) hamburgerBtn.focus();
        }
    });

    // Zatvori meni pri promjeni veličine prozora na desktop (>750px)
    // da ne ostane otvoren ako korisnik rotira uređaj ili promijeni veličinu prozora
    window.addEventListener('resize', function () {
        if (window.innerWidth > 750) {
            zatvoriMeni();
        }
    });

}); // kraj DOMContentLoaded