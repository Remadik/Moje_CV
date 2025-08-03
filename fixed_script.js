document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const body = document.body;
    
    // Funkcja do zamykania panelu
    function closeSidebar() {
        body.classList.remove('sidebar-open');
        sidebar.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
    }

    // Obsługa przycisku menu
    menuToggle.addEventListener('click', function() {
        body.classList.toggle('sidebar-open');
        sidebar.classList.toggle('active');
        
        const icon = this.querySelector('i');
        if (body.classList.contains('sidebar-open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Funkcja do obsługi kliknięć w menu bocznym
    function setupNavLinks() {
        const navLinks = document.querySelectorAll('#sidebar .lang-content.active a');
        
        navLinks.forEach(link => {
            link.removeEventListener('click', handleNavClick);
            link.addEventListener('click', handleNavClick);
        });
    }
    
    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        // Znajdź aktywną zawartość główną (nie sidebar)
        const activeMainContent = document.querySelector('#content .lang-content.active');
        const targetSection = activeMainContent.querySelector(targetId);
        
        closeSidebar();
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    }

    // Przełączanie języków
    function changeLanguage(lang) {
        // Ukryj wszystkie treści językowe
        document.querySelectorAll('.lang-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Pokaż wybraną wersję językową
        const activeContent = document.getElementById(`content-${lang}`);
        if (activeContent) {
            activeContent.classList.add('active');
        }
        
        const activeSidebar = document.getElementById(`sidebar-${lang}`);
        if (activeSidebar) {
            activeSidebar.classList.add('active');
        }
        
        // Aktualizuj przyciski
        document.querySelectorAll('.language-switcher button').forEach(btn => {
            btn.classList.toggle('active-lang', btn.dataset.lang === lang);
        });
        
        // Zapisz wybrany język
        localStorage.setItem('language', lang);
        
        // Ponownie ustaw linki nawigacyjne
        setupNavLinks();
        
        // Ponownie inicjuj karuzele
        initCarousels();
        
        // Ponownie inicjuj zakładki dla nowej wersji językowej
        initTabs();
        
        // Ponownie inicjuj przyciski kontaktowe
        setTimeout(initContactButtons, 50);
    }

    // Inicjalizacja języka
    const savedLang = localStorage.getItem('language') || 'pl';
    changeLanguage(savedLang);

    // Obsługa przycisków językowych
    document.querySelectorAll('.language-switcher button').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.dataset.lang;
            changeLanguage(lang);
        });
    });

    // Obsługa zakładek
    function initTabs() {
        // Usuń stare event listenery ze wszystkich przycisków zakładek
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        // Dodaj nowe event listenery
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', function() {
                // Znajdź rodzica (sekcję skills) tego przycisku
                const skillsSection = this.closest('.section');
                
                // Usuń klasę active ze wszystkich przycisków w tej sekcji
                skillsSection.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Dodaj klasę active do klikniętego przycisku
                this.classList.add('active');

                // Ukryj wszystkie treści zakładek w tej sekcji
                skillsSection.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Pokaż odpowiednią treść
                const tabId = this.dataset.tab;
                const targetTab = skillsSection.querySelector(`#${tabId}`);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }

    // Funkcja do inicjalizacji karuzeli
    function initCarousels() {
        document.querySelectorAll('.carousel').forEach(carousel => {
            // Usuń stare event listeners
            const prevBtn = carousel.querySelector('.prev');
            const nextBtn = carousel.querySelector('.next');
            
            if (prevBtn) prevBtn.removeEventListener('click', null);
            if (nextBtn) nextBtn.removeEventListener('click', null);
            
            const items = carousel.querySelector('.carousel-items');
            
            if (!items || items.children.length === 0) return;
            
            const itemWidth = items.querySelector('.skill-card').offsetWidth + 24;
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    items.scrollBy({ left: -itemWidth, behavior: 'smooth' });
                });
            }
            
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    items.scrollBy({ left: itemWidth, behavior: 'smooth' });
                });
            }
            
            if (items) {
                // Automatyczne ukrywanie przycisków na krawędziach
                items.addEventListener('scroll', () => {
                    if (prevBtn) {
                        prevBtn.style.visibility = items.scrollLeft > 10 ? 'visible' : 'hidden';
                    }
                    if (nextBtn) {
                        nextBtn.style.visibility = items.scrollLeft < items.scrollWidth - items.clientWidth - 10 ? 'visible' : 'hidden';
                    }
                });
                
                // Inicjalna widoczność
                if (prevBtn) prevBtn.style.visibility = 'hidden';
                if (nextBtn) nextBtn.style.visibility = items.scrollWidth > items.clientWidth ? 'visible' : 'hidden';
            }
        });
    }

    // Inicjalizuj karuzele i obsługę kontaktu przy starcie
    initCarousels();
    setupNavLinks();
    initTabs();
});

// Obsługa kontaktu - funkcja uniwersalna dla obu języków
function initContactButtons() {
    // Znajdź wszystkie przyciski kontaktowe w obu wersjach językowych
    const contactToggles = document.querySelectorAll('#contact-toggle');
    
    contactToggles.forEach((contactToggle, index) => {
        // Znajdź odpowiednie elementy dla tego przycisku
        const section = contactToggle.closest('.lang-content');
        const contactDetails = section.querySelector('#contact-details');
        const contactContent = section.querySelector('#contact-content');
        const clickCounter = section.querySelector('#click-counter');
        
        // Pobierz zapisaną liczbę kliknięć lub ustaw na 0
        let clickCount = parseInt(localStorage.getItem('contactClickCount')) || 0;
        
        // Ukryj licznik dla zwykłych użytkowników
        if (clickCounter) clickCounter.style.display = 'none';
        
        // Flaga wskazująca czy admin jest zalogowany
        let isAdmin = false;
        
        // Funkcja do logowania admina
        function adminLogin() {
            const password = prompt('Wprowadź hasło administracyjne:');
            if (password === 'HasloCV') {
                isAdmin = true;
                if (clickCounter) {
                    clickCounter.style.display = 'inline-flex';
                    clickCounter.textContent = `(${clickCount})`;
                }
                alert('Tryb administratora włączony');
            } else {
                alert('Nieprawidłowe hasło');
            }
        }
        
        // Usuń stare event listenery
        contactToggle.replaceWith(contactToggle.cloneNode(true));
        const newContactToggle = section.querySelector('#contact-toggle');
        
        // Dodaj nowy event listener
        newContactToggle.addEventListener('click', function() {
            // Sprawdź czy to długie kliknięcie (3s)
            let pressTimer = setTimeout(() => {
                adminLogin();
            }, 3000);
            
            const cancelPressTimer = () => {
                clearTimeout(pressTimer);
                newContactToggle.removeEventListener('mouseup', cancelPressTimer);
                newContactToggle.removeEventListener('mouseleave', cancelPressTimer);
            };
            
            newContactToggle.addEventListener('mouseup', cancelPressTimer);
            newContactToggle.addEventListener('mouseleave', cancelPressTimer);
            
            // Przełącz widoczność
            const isVisible = contactDetails.style.display === 'block';
            contactDetails.style.display = isVisible ? 'none' : 'block';
            
            // Określ język na podstawie sekcji
            const isEnglish = section.id === 'content-en';
            
            if (!isVisible) {
                contactContent.classList.remove('slide-down');
                void contactContent.offsetWidth;
                contactContent.classList.add('slide-down');
                
                // Zwiększ i zapisz licznik
                clickCount++;
                localStorage.setItem('contactClickCount', clickCount);
                
                // Aktualizuj licznik tylko dla admina
                if (isAdmin && clickCounter) {
                    clickCounter.textContent = `(${clickCount})`;
                }
                
                // Zmień tekst przycisku w odpowiednim języku
                const hideText = isEnglish ? 'Hide contact' : 'Ukryj kontakt';
                this.innerHTML = isAdmin ? 
                    `${hideText} <span id="click-counter">(${clickCount})</span>` : 
                    hideText;
            } else {
                const showText = isEnglish ? 'View contact' : 'Wyświetl kontakt';
                this.innerHTML = isAdmin ? 
                    `${showText} <span id="click-counter">(${clickCount})</span>` : 
                    showText;
            }
        });
    });
}

// Inicjalizuj przyciski kontaktowe po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initContactButtons, 100); // Małe opóźnienie dla pewności
});
