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

    if (tabPills.length > 0) {
        tabPills.forEach(pill => {
            pill.addEventListener('click', () => {
                tabPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                currentCategory = pill.getAttribute('data-category') || 'all';
                filterTools();
            });
        });
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

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.rel = 'noopener';
    
    // Set download attribute BEFORE href to ensure Chrome/Edge respect the filename override
    link.download = safeName;
    link.setAttribute('download', safeName);
    link.href = url;

    document.body.appendChild(link);

    // Trigger click
    link.click();

    setTimeout(() => {
        if (link.parentNode) {
            link.parentNode.removeChild(link);
        }
        URL.revokeObjectURL(url);
    }, 10000);
};




