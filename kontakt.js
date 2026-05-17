document.addEventListener('DOMContentLoaded', () => {

    // ============================================================
    // 1. DARK MODE TOGGLE + LOCALSTORAGE
    // ============================================================
    const darkToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Učitaj sačuvanu preferenciju pri pokretanju
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (darkToggle) darkToggle.textContent = '☀️';
    } else {
        if (darkToggle) darkToggle.textContent = '🌙';
    }

    if (darkToggle) {
        darkToggle.addEventListener('click', function () {
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
    // 2. VALIDACIJA KONTAKT FORME
    // ============================================================
    // Koristimo ID 'formaKontakt' kao u tvom drugom bloku koda
    const kontaktForma = document.getElementById('formaKontakt');

    if (kontaktForma) {
        kontaktForma.addEventListener('submit', function(event) {
            // Slanje se obavezno zaustavlja radi čiste JS validacije
            event.preventDefault();

            // Resetovanje prethodnih vizuelnih grešaka
            document.querySelectorAll('.error-text').forEach(el => {
                el.innerText = '';
                el.style.display = 'none';
            });
            document.querySelectorAll('.input-error').forEach(el => {
                el.classList.remove('input-error');
            });

            let statusForme = true; // SADA JE OVDE ISPRAVNO DEFINISANO

            // 1. Validacija: Ime i Prezime
            const imeInput = document.getElementById('ime');
            const imeVrijednost = imeInput.value.trim();
            if (imeVrijednost === "") {
                prikaziGresku(imeInput, 'error-ime', 'Ime i prezime je obavezno polje.');
                statusForme = false;
            } else if (!/^[a-zA-ZčćđšžČĆĐŠŽ\s]+$/.test(imeVrijednost)) {
                prikaziGresku(imeInput, 'error-ime', 'Ime i prezime može sadržavati samo slova!');
                statusForme = false;
            }

            // 2. Validacija: E-mail (Napredniji regex iz tvog prvog pokušaja)
            const emailInput = document.getElementById('email');
            const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail.com|yahoo.com|hotmail.com|outlook.com|icloud.com|mail.com|live.com|outlook.ba|bih.net.ba)$/i;
            if (emailInput.value.trim() === "") {
                prikaziGresku(emailInput, 'error-email', 'E-mail adresa je obavezno polje.');
                statusForme = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                prikaziGresku(emailInput, 'error-email', 'Unesite ispravan e-mail format (ime@domena.com).');
                statusForme = false;
            }

            // 3. Validacija: Broj telefona (+387 format)
            const telefonInput = document.getElementById('telefon');
            const telefonVrijednost = telefonInput.value.trim();
            const telefonRegex = /^\+387[0-9]{6,9}$/;

            if (telefonVrijednost === "" || telefonVrijednost === "+387") {
                prikaziGresku(telefonInput, 'error-telefon', 'Broj telefona je obavezno polje.');
                statusForme = false;
            } else if (/[a-zA-ZčćđšžČĆĐŠŽ]/.test(telefonVrijednost)) {
                prikaziGresku(telefonInput, 'error-telefon', 'Broj telefona ne smije sadržavati slova!');
                statusForme = false;
            } else if (!telefonRegex.test(telefonVrijednost)) {
                prikaziGresku(telefonInput, 'error-telefon', 'Broj mora biti u formatu +387XXXXXXXX (bez crtica i razmaka).');
                statusForme = false;
            }

            // 4. Validacija: Tema upita (Dropdown)
            const razlogInput = document.getElementById('razlog');
            if (razlogInput && razlogInput.value === "") {
                prikaziGresku(razlogInput, 'error-razlog', 'Molimo odaberite temu vašeg upita.');
                statusForme = false;
            }

            // 5. Validacija: Poruka
            const porukaInput = document.getElementById('poruka');
            if (porukaInput.value.trim() === "") {
                prikaziGresku(porukaInput, 'error-poruka', 'Tekst poruke je obavezan.');
                statusForme = false;
            }

            // 6. Validacija: Uslovi korištenja (Checkbox)
            const usloviInput = document.getElementById('uslovi');
            if (usloviInput && !usloviInput.checked) {
                prikaziGresku(usloviInput, 'error-uslovi', 'Morate prihvatiti uslove korištenja.');
                statusForme = false;
            }
// ============================================================
            // OVDJE JE DODANO: AKCIJA UKOLIKO JE SVE TAČNO UNESENO
            // ============================================================
            if (statusForme) {
                // 1. Iskače klasični prozorčić na ekranu
                alert("Poruka uspješno poslana!");

                // 2. Kreira se i zeleni boks na stranici radi estetike
                const staraPoruka = document.getElementById('kontakt-uspjeh');
                if (staraPoruka) staraPoruka.remove();

                const boksUspjeh = document.createElement('div');
                boksUspjeh.id = 'kontakt-uspjeh';
                boksUspjeh.style.backgroundColor = 'var(--boja-uspjeh, #28a745)';
                boksUspjeh.style.color = 'white';
                boksUspjeh.style.padding = 'var(--razmak-srednji, 15px)';
                boksUspjeh.style.borderRadius = 'var(--radius, 5px)';
                boksUspjeh.style.marginBottom = 'var(--razmak-srednji, 15px)';
                boksUspjeh.style.fontWeight = 'bold';
                boksUspjeh.innerText = `✅ Hvala vam, ${imeVrijednost}! Vaša poruka je uspješno procesirana.`;

                // Ubacuje poruku na početak forme
                kontaktForma.insertBefore(boksUspjeh, kontaktForma.firstChild);
                
                // Prazni sva polja u formi
                kontaktForma.reset(); 

                // Briše zeleni boks nakon 6 sekundi
                setTimeout(() => boksUspjeh.remove(), 6000);
            }
        });

        // RESET DUGME: Čisti unose i uklanja sve vidljive greške s ekrana
        kontaktForma.addEventListener('reset', () => {
            document.querySelectorAll('.error-text').forEach(el => {
                el.innerText = '';
                el.style.display = 'none';
            });
            document.querySelectorAll('.input-error').forEach(el => {
                el.classList.remove('input-error');
            });
            const staraPoruka = document.getElementById('kontakt-uspjeh');
            if (staraPoruka) staraPoruka.remove();
        });
    }
});

// Pomoćna funkcija za ispis greške i dodavanje CSS klase
function prikaziGresku(inputElement, errorSpanId, porukaTekst) {
    if (inputElement) inputElement.classList.add('input-error');
    const kontejnerGreske = document.getElementById(errorSpanId);
    if (kontejnerGreske) {
        kontejnerGreske.innerText = porukaTekst;
        kontejnerGreske.style.display = 'block';
    }
}