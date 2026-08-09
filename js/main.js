// Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
    console.log('PDF Converter Application Initialized');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // Tools Header Dropdown Toggle (if present)
    const toolsDropdownBtn = document.getElementById('tools-dropdown-btn');
    const toolsDropdownMenu = document.getElementById('tools-dropdown-menu');
    if (toolsDropdownBtn && toolsDropdownMenu) {
        toolsDropdownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toolsDropdownMenu.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!toolsDropdownMenu.contains(e.target) && !toolsDropdownBtn.contains(e.target)) {
                toolsDropdownMenu.classList.add('hidden');
            }
        });
    }

    // Add scroll effect to navbar
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                navbar.classList.add('shadow-md', 'bg-white/95');
                navbar.classList.remove('bg-white/70');
            } else {
                navbar.classList.remove('shadow-md', 'bg-white/95');
                navbar.classList.add('bg-white/70');
            }
        });
    }

    // Tools Page Category Filter Tabs & Real-time Search
    const tabPills = document.querySelectorAll('.tab-pill');
    const searchInput = document.getElementById('tool-search-input');
    const toolCards = document.querySelectorAll('.tool-card-item');

    let currentCategory = 'all';

    // 1. Restore persistent category selection from URL param or sessionStorage
    const urlParams = new URLSearchParams(window.location.search);
    const paramCat = urlParams.get('category');
    const storedCat = sessionStorage.getItem('selectedCategory');
    const initialCategory = paramCat || storedCat || 'all';

    function filterTools() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        toolCards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').split(' ');
            const title = (card.getAttribute('data-title') || '').toLowerCase();
            const desc = (card.getAttribute('data-desc') || '').toLowerCase();

            const matchesCategory = currentCategory === 'all' || categories.includes(currentCategory);
            const matchesQuery = !query || title.includes(query) || desc.includes(query);

            if (matchesCategory && matchesQuery) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    function setCategory(cat) {
        currentCategory = cat;
        sessionStorage.setItem('selectedCategory', cat);
        
        // Update URL query string without reloading page
        const newUrl = new URL(window.location.href);
        if (cat === 'all') {
            newUrl.searchParams.delete('category');
        } else {
            newUrl.searchParams.set('category', cat);
        }
        window.history.replaceState(null, '', newUrl.toString());

        if (tabPills.length > 0) {
            tabPills.forEach(p => {
                if (p.getAttribute('data-category') === cat) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
        }
        filterTools();
    }

    if (tabPills.length > 0) {
        tabPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const cat = pill.getAttribute('data-category') || 'all';
                setCategory(cat);
            });
        });

        // Initialize category on load
        setCategory(initialCategory);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterTools);
    }
});

// Universal Download Blob Helper
window.downloadBlob = function(blob, fileName) {
    if (!blob) return;

    // Sanitize filename to remove any invalid characters
    const safeName = (fileName || 'download').replace(/[/\\?%*:|"<>]/g, '_');

    // Create a temporary link element
    const link = document.createElement('a');
    
    // Check for native blob URL support
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        // IE11 / Edge legacy
        window.navigator.msSaveOrOpenBlob(blob, safeName);
        return;
    }

    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = safeName;

    // Append to body, trigger click, and cleanup
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 200);
};
