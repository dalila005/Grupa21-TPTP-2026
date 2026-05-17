// ================================================================
// tptpskripte.js — Šapa & Rep Pet Shop
// Zajednička JavaScript datoteka za sve stranice:
//   • index.html      (početna stranica)
//   • kontakt.html    (kontakt stranica)
//   • sadrzaj.html    (stranica sa sadržajem)
//
// Sadržaj:
//   1.  Dark mode toggle + LocalStorage
//   2.  Smooth scroll za bookmark navigaciju
//   3.  Hamburger meni (mobilni drawer)
//   4.  Filtriranje kartica bez reload-a       [sadrzaj.html]
//   5.  Dinamički brojač proizvoda             [sadrzaj.html + index.html]
//   6.  Animacija kategorija (hover/focus)     [index.html]
//   7.  Newsletter validacija (JS regex)       [index.html]
//   8.  Validacija kontakt forme — tptpskripte [sadrzaj.html / contactForm]
//   9.  Validacija kontakt forme — kontakt.js  [kontakt.html / formaKontakt]
// ================================================================

// AI pomoć: Claude mi je objasnio DOMContentLoaded event.
// Razumijem da: ovaj event se pali kada browser završi parsiranje HTML-a,
// ali PRIJE nego što se učitaju slike i drugi resursi. Koristimo ga da
// smo sigurni da svi HTML elementi postoje kad pokušamo pristupiti njima.
document.addEventListener('DOMContentLoaded', function () {


    // ============================================================
    // 1. DARK MODE TOGGLE + LOCALSTORAGE
    //    Obavezni zahtjev (PDF §4.3)
    //    Radi na svim stranicama.
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
    } else {
        if (darkToggle) darkToggle.textContent = '🌙';
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
    // 2. SMOOTH SCROLL ZA BOOKMARK NAVIGACIJU
    //    Obavezni zahtjev (PDF §4.3)
    //    Radi na svim stranicama koje imaju anchor linkove.
    // ============================================================

    // AI pomoć: Claude mi je objasnio getBoundingClientRect i window.scrollTo.
    // Razumijem da: getBoundingClientRect() vraća poziciju elementa relativno
    // na viewport (vidljivi dio ekrana). window.scrollY je trenutna pozicija
    // skrolovanja od vrha stranice. Sabirajući ta dva dobijamo apsolutnu
    // poziciju na stranici, pa oduzimamo offset headera (130px) da element
    // ne bude skriven ispod sticky navigacije.

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var targetId = link.getAttribute('href');
            if (targetId === '#') return; // prazan hash — ne radi ništa

            var targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                var offset = 130; // visina sticky headera + bookmark bara
                var elTop  = targetEl.getBoundingClientRect().top + window.scrollY;
                window.scrollTo({ top: elTop - offset, behavior: 'smooth' });

                // Na mobilnom: zatvori drawer kada se klikne na sekciju link
                zatvoriMeni();
            }
        });
    });


    // ============================================================
    // 3. HAMBURGER MENI — mobilni drawer (slide-in navigacija)
    //    Prikazuje se samo na ekranima ≤750px.
    //    Radi na svim stranicama koje imaju side-nav.
    // ============================================================

    // AI pomoć: Claude mi je objasnio aria-expanded atribut.
    // Razumijem da: aria-expanded je ARIA atribut koji čitačima ekrana
    // govori da li je neka komponenta otvorena ili zatvorena.
    // Postavljamo ga na 'true' kada je meni otvoren, 'false' kada je zatvoren.
    // Ovo je važno za pristupačnost (accessibility) web stranice.

    var hamburgerBtn = document.getElementById('hamburgerBtn');
    var sideNav      = document.getElementById('sideNav');
    var navOverlay   = document.getElementById('navOverlay');
    var navCloseBtn  = document.getElementById('navCloseBtn');

    // Pomoćna funkcija: otvori meni — definisana ovdje da je dostupna
    // i smooth scroll-u iznad (zatvoriMeni poziv)
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
            if (sideNav && sideNav.classList.contains('nav-open')) {
                zatvoriMeni();
            } else {
                otvoriMeni();
            }
        });
    }

    // Klik na X dugme unutar drawera
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
            if (hamburgerBtn) hamburgerBtn.focus();
        }
    });

    // Zatvori meni pri proširenju prozora na desktop (>750px)
    window.addEventListener('resize', function () {
        if (window.innerWidth > 750) {
            zatvoriMeni();
        }
    });


    // ============================================================
    // 4. FILTRIRANJE KARTICA BEZ RELOAD-A
    //    Obavezni zahtjev (PDF §4.3)
    //    Aktivan samo na stranicama koje imaju filter dugmad i productGrid.
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

                kartice.forEach(function (kartica) {
                    if (filterVrijednost === 'sve' || kartica.dataset.category === filterVrijednost) {
                        kartica.classList.remove('hidden');
                        vidljivo++;
                    } else {
                        kartica.classList.add('hidden');
                    }
                });

                // Ažuriraj brojač i "nema rezultata" poruku
                azurirajBrojac(vidljivo);
                if (noResults) {
                    noResults.style.display = (vidljivo === 0) ? 'block' : 'none';
                }
            });
        });
    }


    // ============================================================
    // 5. DINAMIČKI BROJAČ PROIZVODA
    //    Obavezni zahtjev (PDF §4.3)
    //    Radi i na sadrzaj.html (s filterima) i na index.html (bez filtera).
    // ============================================================

    // AI pomoć: Claude mi je objasnio setTimeout funkciju.
    // Razumijem da: setTimeout(callback, millisekunde) izvršava callback funkciju
    // jednom, nakon zadanog broja milisekundi. Koristimo ga za kratku
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

    // Postavi inicijalni broj vidljivih kartica (radi na svim stranicama)
    if (productGrid) {
        var ukupnoKartica = productGrid.querySelectorAll('.product-card').length;
        azurirajBrojac(ukupnoKartica);
    }


    // ============================================================
    // 6. ANIMACIJA KATEGORIJA — hover/focus efekat
    //    Aktivan samo na index.html (gdje postoje .cat-box elementi).
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
        // Pristupačnost — isti efekat za keyboard korisnike
        box.addEventListener('focus', function () {
            box.classList.add('cat-hovered');
        });
        box.addEventListener('blur', function () {
            box.classList.remove('cat-hovered');
        });
    });


    // ============================================================
    // 7. NEWSLETTER VALIDACIJA — isključivo JavaScript regex
    //    Obavezni zahtjev (PDF §3.3, §4.3)
    //    Aktivan samo na index.html.
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
    var emailRegexNewsletter = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;

    var newsletterBtn      = document.getElementById('newsletterBtn');
    var newsletterEmail    = document.getElementById('newsletterEmail');
    var newsletterError    = document.getElementById('newsletterError');
    var newsletterSuccess  = document.getElementById('newsletterSuccess');
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

            if (!emailRegexNewsletter.test(email)) {
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
    // 8. VALIDACIJA KONTAKT FORME — verzija A (contactForm)
    //    Za sadrzaj.html ili kontakt.html koji koriste id="contactForm".
    //    Obavezni zahtjev (PDF §3.3, §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio ovaj regex za telefon.
    // Razumijem da:
    //   ^               — početak
    //   [\d\s\-\+\(\)]+ — jedno ili više: cifri, razmaka, crtice, plusa, zagrada
    //   {7,15}          — ukupno između 7 i 15 znakova
    //   $               — kraj
    var emailRegexKontakt = /^[\w.-]+@[\w.-]+\.[a-z]{2,}$/i;
    var telefonRegex      = /^[\d\s\-\+\(\)]{7,15}$/;

    var contactForm = document.getElementById('contactForm');

    if (contactForm) {

        var submitBtn    = document.getElementById('submitBtn');
        var resetBtn     = document.getElementById('resetBtn');
        var successMsg   = document.getElementById('successMsg');
        var successTitle = document.getElementById('successTitle');

        // -- Pomoćna: prikaži grešku pored polja
        function prikaziGreskuA(polje, tekst) {
            polje.classList.add('error');
            var errorEl = document.getElementById(polje.id + 'Error');
            if (errorEl) errorEl.textContent = tekst;
        }

        // -- Pomoćna: ukloni grešku s polja
        function ukloniGreskuA(polje) {
            polje.classList.remove('error');
            var errorEl = document.getElementById(polje.id + 'Error');
            if (errorEl) errorEl.textContent = '';
        }

        // -- Validacija jednog polja — vraća true/false
        function validirajPoljeA(polje) {
            var v = polje.value.trim();

            if (polje.id === 'ime' && v.length < 2) {
                prikaziGreskuA(polje, 'Ime mora imati najmanje 2 slova.');
                return false;
            }
            if (polje.id === 'prezime' && v.length < 2) {
                prikaziGreskuA(polje, 'Prezime mora imati najmanje 2 slova.');
                return false;
            }
            if (polje.id === 'email' && !emailRegexKontakt.test(v)) {
                prikaziGreskuA(polje, 'Unesite ispravnu email adresu (npr. ime@domena.ba).');
                return false;
            }
            if (polje.id === 'telefon' && !telefonRegex.test(v)) {
                prikaziGreskuA(polje, 'Telefon može sadržavati samo cifre, razmake i crtice.');
                return false;
            }
            if (polje.id === 'tema' && v === '') {
                prikaziGreskuA(polje, 'Odaberite temu upita.');
                return false;
            }
            if (polje.id === 'poruka' && v.length < 10) {
                prikaziGreskuA(polje, 'Poruka mora imati najmanje 10 znakova.');
                return false;
            }

            ukloniGreskuA(polje);
            return true;
        }

        // Live validacija + blur validacija po polju
        ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(function (id) {
            var polje = document.getElementById(id);
            if (!polje) return;
            polje.addEventListener('input', function () {
                if (polje.classList.contains('error')) ukloniGreskuA(polje);
            });
            polje.addEventListener('blur', function () {
                validirajPoljeA(polje);
            });
        });

        // Submit — provjeri sva polja
        if (submitBtn) {
            submitBtn.addEventListener('click', function (e) {
                e.preventDefault();

                var ids         = ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'];
                var sveIspravno = true;

                ids.forEach(function (id) {
                    var polje = document.getElementById(id);
                    if (polje && !validirajPoljeA(polje)) {
                        sveIspravno = false;
                    }
                });

                if (sveIspravno) {
                    // Personalizirana uspješna poruka sa imenom (PDF §3.3)
                    var imeKorisnika = document.getElementById('ime').value.trim();
                    if (successTitle) {
                        successTitle.textContent = 'Hvala, ' + imeKorisnika + '!';
                    }
                    contactForm.style.display   = 'none';
                    if (successMsg) successMsg.style.display = 'block';
                } else {
                    // Skroluj do prve greške
                    var prvaGreska = contactForm.querySelector('.error');
                    if (prvaGreska) {
                        prvaGreska.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }
            });
        }

        // Reset dugme — briše formu i sve greške
        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                contactForm.reset();
                ['ime', 'prezime', 'email', 'telefon', 'tema', 'poruka'].forEach(function (id) {
                    var polje = document.getElementById(id);
                    if (polje) ukloniGreskuA(polje);
                });
            });
        }

        // "Pošalji novu poruku" dugme — vrati formu
        var newMsgBtn = document.getElementById('newMsgBtn');
        if (newMsgBtn) {
            newMsgBtn.addEventListener('click', function () {
                contactForm.reset();
                if (successMsg) successMsg.style.display = 'none';
                contactForm.style.display = 'flex';
            });
        }
    }


    // ============================================================
    // 9. VALIDACIJA KONTAKT FORME — verzija B (formaKontakt)
    //    Za kontakt.html koji koristi id="formaKontakt".
    //    Obavezni zahtjev (PDF §3.3, §4.3)
    // ============================================================

    // AI pomoć: Claude mi je objasnio razliku između innerText i textContent.
    // Razumijem da: textContent vraća sav tekst uključujući skrivene elemente,
    // dok innerText vraća samo vidljivi tekst i uzima u obzir CSS stilove.
    // Za postavljanje poruka grešaka koristimo innerText jer je čitljivije.

    var emailRegexB = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|icloud\.com|mail\.com|live\.com|outlook\.ba|bih\.net\.ba)$/i;

    var kontaktForma = document.getElementById('formaKontakt');

    if (kontaktForma) {

        kontaktForma.addEventListener('submit', function (event) {
            event.preventDefault(); // Spriječi reload stranice

            // Resetuj prethodne vizuelne greške
            document.querySelectorAll('.error-text').forEach(function (el) {
                el.innerText   = '';
                el.style.display = 'none';
            });
            document.querySelectorAll('.input-error').forEach(function (el) {
                el.classList.remove('input-error');
            });

            var statusForme = true;

            // 1. Validacija: Ime i Prezime
            var imeInput      = document.getElementById('ime');
            var imeVrijednost = imeInput ? imeInput.value.trim() : '';
            if (imeVrijednost === '') {
                prikaziGreskuB(imeInput, 'error-ime', 'Ime i prezime je obavezno polje.');
                statusForme = false;
            } else if (!/^[a-zA-ZčćđšžČĆĐŠŽ\s]+$/.test(imeVrijednost)) {
                prikaziGreskuB(imeInput, 'error-ime', 'Ime i prezime može sadržavati samo slova!');
                statusForme = false;
            }

            // 2. Validacija: E-mail
            var emailInput = document.getElementById('email');
            if (emailInput) {
                if (emailInput.value.trim() === '') {
                    prikaziGreskuB(emailInput, 'error-email', 'E-mail adresa je obavezno polje.');
                    statusForme = false;
                } else if (!emailRegexB.test(emailInput.value.trim())) {
                    prikaziGreskuB(emailInput, 'error-email', 'Unesite ispravan e-mail format (ime@domena.com).');
                    statusForme = false;
                }
            }

            // 3. Validacija: Broj telefona (+387 format)
            var telefonInput      = document.getElementById('telefon');
            var telefonVrijednost = telefonInput ? telefonInput.value.trim() : '';
            var telefonRegexB     = /^\+387[0-9]{6,9}$/;

            if (telefonVrijednost === '' || telefonVrijednost === '+387') {
                prikaziGreskuB(telefonInput, 'error-telefon', 'Broj telefona je obavezno polje.');
                statusForme = false;
            } else if (/[a-zA-ZčćđšžČĆĐŠŽ]/.test(telefonVrijednost)) {
                prikaziGreskuB(telefonInput, 'error-telefon', 'Broj telefona ne smije sadržavati slova!');
                statusForme = false;
            } else if (!telefonRegexB.test(telefonVrijednost)) {
                prikaziGreskuB(telefonInput, 'error-telefon', 'Broj mora biti u formatu +387XXXXXXXX (bez crtica i razmaka).');
                statusForme = false;
            }

            // 4. Validacija: Tema upita (Dropdown)
            var razlogInput = document.getElementById('razlog');
            if (razlogInput && razlogInput.value === '') {
                prikaziGreskuB(razlogInput, 'error-razlog', 'Molimo odaberite temu vašeg upita.');
                statusForme = false;
            }

            // 5. Validacija: Poruka
            var porukaInput = document.getElementById('poruka');
            if (porukaInput && porukaInput.value.trim() === '') {
                prikaziGreskuB(porukaInput, 'error-poruka', 'Tekst poruke je obavezan.');
                statusForme = false;
            }

            // 6. Validacija: Uslovi korištenja (Checkbox)
            var usloviInput = document.getElementById('uslovi');
            if (usloviInput && !usloviInput.checked) {
                prikaziGreskuB(usloviInput, 'error-uslovi', 'Morate prihvatiti uslove korištenja.');
                statusForme = false;
            }

            // Akcija kada je sve ispravno uneseno
            if (statusForme) {
                alert('Poruka uspješno poslana!');

                // Ukloni prethodni boks uspjeha ako postoji
                var staraPoruka = document.getElementById('kontakt-uspjeh');
                if (staraPoruka) staraPoruka.remove();

                // Kreiraj zeleni boks potvrde
                var boksUspjeh = document.createElement('div');
                boksUspjeh.id                    = 'kontakt-uspjeh';
                boksUspjeh.style.backgroundColor = 'var(--boja-uspjeh, #28a745)';
                boksUspjeh.style.color           = 'white';
                boksUspjeh.style.padding         = 'var(--razmak-srednji, 15px)';
                boksUspjeh.style.borderRadius    = 'var(--radius, 5px)';
                boksUspjeh.style.marginBottom    = 'var(--razmak-srednji, 15px)';
                boksUspjeh.style.fontWeight      = 'bold';
                boksUspjeh.innerText             = '✅ Hvala vam, ' + imeVrijednost + '! Vaša poruka je uspješno procesirana.';

                // Ubaci boks na početak forme
                kontaktForma.insertBefore(boksUspjeh, kontaktForma.firstChild);

                // Resetuj sva polja u formi
                kontaktForma.reset();

                // Ukloni zeleni boks nakon 6 sekundi
                setTimeout(function () {
                    boksUspjeh.remove();
                }, 6000);
            }
        });

        // Reset dugme — čisti unose i uklanja sve greške
        kontaktForma.addEventListener('reset', function () {
            document.querySelectorAll('.error-text').forEach(function (el) {
                el.innerText     = '';
                el.style.display = 'none';
            });
            document.querySelectorAll('.input-error').forEach(function (el) {
                el.classList.remove('input-error');
            });
            var staraPoruka = document.getElementById('kontakt-uspjeh');
            if (staraPoruka) staraPoruka.remove();
        });
    }


}); // kraj DOMContentLoaded


// ================================================================
// POMOĆNA FUNKCIJA — prikaziGreskuB
// Definisana van DOMContentLoaded da bude globalno dostupna
// u slučaju da se poziva iz inline HTML-a.
// Koristi se isključivo uz formaKontakt (Verzija B).
// ================================================================
function prikaziGreskuB(inputElement, errorSpanId, porukaTekst) {
    if (inputElement) inputElement.classList.add('input-error');
    var kontejnerGreske = document.getElementById(errorSpanId);
    if (kontejnerGreske) {
        kontejnerGreske.innerText    = porukaTekst;
        kontejnerGreske.style.display = 'block';
    }
}