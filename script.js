/* ==========================================================================
VALIDACIJA I UPRAVLJANJE KONTAKT FORMOM
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
const kontaktForma = document.querySelector('.kontakt-forma');

// Provjeravamo da li se uopšte nalazimo na kontakt stranici (da ne pravi grešku na početnoj)
if (kontaktForma) {
kontaktForma.addEventListener('submit', function(event) {
// Zaustavljamo standardno osvježavanje stranice
event.preventDefault();

// Kupljenje vrijednosti iz polja
const ime = document.getElementById('ime').value.trim();
const email = document.getElementById('email').value.trim();
const telefon = document.getElementById('telefon').value.trim();
const poruka = document.getElementById('poruka').value.trim();

// 1. Osnovna provjera praznih polja (iako imamo required, sigurnost na prvom mjestu)
if (ime === "" || email === "" || telefon === "" || poruka === "") {
alert("Molimo vas da popunite sva obavezna polja označena sa zvjezdicom (*).");
return;
}

// 2. Regex provjera telefona (Poklapa se sa patternom iz HTML-a: 06X-XXX-XXX)
const telefonRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{3,4}$/;
if (!telefonRegex.test(telefon)) {
alert("Broj telefona nije u ispravnom formatu! Unesite ga kao: 061-123-456");
return;
}

// 3. Ako je sve u redu, ispisujemo poruku o uspjehu na ekranu (dinamički)
// Kreiramo element za poruku
const uspjesnaPoruka = document.createElement('div');
uspjesnaPoruka.style.backgroundColor = 'var(--boja-uspjeh)';
uspjesnaPoruka.style.color = 'white';
uspjesnaPoruka.style.padding = 'var(--razmak-srednji)';
uspjesnaPoruka.style.borderRadius = 'var(--radius)';
uspjesnaPoruka.style.marginTop = 'var(--razmak-srednji)';
uspjesnaPoruka.style.fontWeight = 'bold';
uspjesnaPoruka.innerHTML = `✅ Hvala vam, ${ime}! Vaša poruka je uspješno poslana. Odgovorićemo vam na email (${email}) uskoro.`;

// Ubacujemo poruku odmah iznad forme
kontaktForma.insertBefore(uspjesnaPoruka, kontaktForma.firstChild);

// Resetujemo formu (praznimo sva polja) nakon uspješnog slanja
kontaktForma.reset();

// Nakon 5 sekundi sklanjamo poruku o uspjehu sa ekrana
setTimeout(() => {
uspjesnaPoruka.remove();
}, 5000);
});
}
});

/* ==========================================================================
DOKUMENTACIJA UPOTREBE AI ALATA (Zahtjev projekta - Stavka 5)
Razumijem sljedeće regularne izraze (Regex) napisane uz pomoć AI asistenta:
1. emailRegex: Provjerava da li tekst sadrži karaktere prije i poslije znaka '@',
kao i validnu domenu iza tačke (npr. .com, .ba).
2. telefonRegex: ^[0-9]{3}-[0-9]{3}-[0-9]{3,4}$
Provjerava da li unos počinje sa 3 cifre, ima crticu, zatim još 3 cifre,
crticu, te završava sa 3 ili 4 cifre (isključivo format 06X-XXX-XXX).
========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
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

let statusForme = true;

// 1. Validacija: Ime i Prezime (Ne smije biti prazno i ne smije sadržavati samo brojeve)
const imeInput = document.getElementById('ime');
const imeVrijednost = imeInput.value.trim();
if (imeVrijednost === "") {
prikaziGresku(imeInput, 'error-ime', 'Ime i prezime je obavezno polje.');
statusForme = false;
} else if (!isNaN(imeVrijednost)) {
prikaziGresku(imeInput, 'error-ime', 'Ime i prezime ne može sadržavati samo cifre!');
statusForme = false;
}

// 2. Validacija: E-mail (Regex provjera formata)
const emailInput = document.getElementById('email');
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (emailInput.value.trim() === "") {
prikaziGresku(emailInput, 'error-email', 'E-mail adresa je obavezno polje.');
statusForme = false;
} else if (!emailRegex.test(emailInput.value.trim())) {
prikaziGresku(emailInput, 'error-email', 'Unesite ispravan e-mail format (ime@domena.com).');
statusForme = false;
}

// 3. Validacija: Broj telefona (Samo cifre sa crticama)
const telefonInput = document.getElementById('telefon');
const telefonRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{3,4}$/;
if (telefonInput.value.trim() === "") {
prikaziGresku(telefonInput, 'error-telefon', 'Broj telefona je obavezno polje.');
statusForme = false;
} else if (!telefonRegex.test(telefonInput.value.trim())) {
prikaziGresku(telefonInput, 'error-telefon', 'Broj mora biti u ispravnom formatu: 06X-XXX-XXX.');
statusForme = false;
}

// 4. Validacija: Tema upita (Dropdown dropdown)
const razlogInput = document.getElementById('razlog');
if (razlogInput.value === "") {
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
if (!usloviInput.checked) {
prikaziGresku(usloviInput, 'error-uslovi', 'Morate prihvatiti uslove korištenja.');
statusForme = false;
}

// AKCIJA UKOLIKO JE SVE ISPRAVNO: Prikaz personalizovane uspješne poruke na ekranu
if (statusForme) {
const staraPoruka = document.getElementById('kontakt-uspjeh');
if (staraPoruka) staraPoruka.remove();

const boksUspjeh = document.createElement('div');
boksUspjeh.id = 'kontakt-uspjeh';
boksUspjeh.style.backgroundColor = 'var(--boja-uspjeh)';
boksUspjeh.style.color = 'white';
boksUspjeh.style.padding = 'var(--razmak-srednji)';
boksUspjeh.style.borderRadius = 'var(--radius)';
boksUspjeh.style.marginBottom = 'var(--razmak-srednji)';
boksUspjeh.style.fontWeight = 'bold';
boksUspjeh.innerText = `✅ Hvala vam, ${imeVrijednost}! Vaša poruka je uspješno procesirana.`;

kontaktForma.insertBefore(boksUspjeh, kontaktForma.firstChild);
kontaktForma.reset(); // Potpuno pražnjenje forme nakon uspjeha

setTimeout(() => boksUspjeh.remove(), 6000);
}
});

// Pomoćna funkcija za ispis greške i dodavanje CSS klase
function prikaziGresku(inputElement, errorSpanId, porukaTekst) {
inputElement.classList.add('input-error');
const kontejnerGreske = document.getElementById(errorSpanId);
if (kontejnerGreske) {
kontejnerGreske.innerText = porukaTekst;
kontejnerGreske.style.display = 'block';
}
}

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

// ==========================================
// KOD ZA TAMNI/SVIJETLI MOD (Sa localStorage)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
const prekidacTemi = document.getElementById('dark-mode-toggle');

// 1. Provjeri da li je korisnik ranije izabrao tamni mod (da se ne ugasi kad osvježi)
if (localStorage.getItem('tema') === 'dark') {
document.body.classList.add('dark-mode');
}

// 2. Klik na dugme pali/gasi tamni mod
if (prekidacTemi) {
prekidacTemi.addEventListener('click', () => {
document.body.classList.toggle('dark-mode');

// 3. Spasi trenutno stanje u memoriju browsera
if (document.body.classList.contains('dark-mode')) {
localStorage.setItem('tema', 'dark');
} else {
localStorage.setItem('tema', 'light');
}
});
}
});