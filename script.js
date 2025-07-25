document.addEventListener('DOMContentLoaded', () => {

    // --- MOCK DATA (Simulating Firebase Firestore) ---

    const mockUser = {
        id: "usr_1a2b3c4d",
        name: "Fahim Ahmed",
        currentVenueId: null, // User is not checked in initially
        currentVenueName: "Not Checked In",
    };

    const mockVenues = [
        {
            id: "venue_gloria_gulshan",
            name: "Gloria Jean's Coffees",
            area: "Gulshan",
            img: "https://images.unsplash.com/photo-1511920183353-3c7c95a5742a?q=80&w=400",
            tags: ["wifi", "group_seating"]
        },
        {
            id: "venue_north_end_dhn",
            name: "North End Coffee Roasters",
            area: "Dhanmondi",
            img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=400",
            tags: ["quiet", "premium_coffee"]
        },
        {
            id: "venue_crimson_banani",
            name: "Crimson Cup Coffee",
            area: "Banani",
            img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=400",
            tags: ["social", "outdoor"]
        },
        {
            id: "venue_atrium_uttara",
            name: "The Atrium Restaurant",
            area: "Uttara",
            img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=400",
            tags: ["business", "parking"]
        }
    ];

    const mockAvailablePeople = [
        { name: 'Sadia Islam', age: 24, profession: 'Graphic Designer', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', interests: ['Art', 'Music'] },
        { name: 'Rahim Chowdhury', age: 28, profession: 'Startup Founder', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200', interests: ['Tech', 'Finance'] },
        { name: 'Nusrat Jahan', age: 21, profession: 'University Student', photo: 'https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=200', interests: ['Books', 'Debate'] },
    ];


    // --- DOM ELEMENTS ---

    const pages = document.querySelectorAll('.page');
    const appPages = document.querySelectorAll('.app-page');
    const navLinks = document.querySelectorAll('.nav-link');
    const availabilityToggle = document.getElementById('availability-toggle');
    const availabilityStatus = document.getElementById('availability-status');
    const venueGrid = document.getElementById('venue-grid');
    const profileGrid = document.getElementById('profile-grid');
    const welcomeMessage = document.getElementById('welcome-message');
    const currentVenueDisplay = document.getElementById('current-venue-display');
    const matchingVenueName = document.getElementById('matching-venue-name');
    const loginForm = document.getElementById('login-form');


    // --- SPA (Single Page Application) LOGIC ---

    function showPage(pageId) {
        // Hide all top-level pages first
        pages.forEach(page => page.classList.remove('active'));

        const targetPage = document.getElementById(pageId);
        
        // Determine if the target is a main page or a sub-page within the app
        if (targetPage && targetPage.classList.contains('app-page')) {
            // It's a sub-page, so make sure the main app wrapper is visible
            document.getElementById('app-wrapper').classList.add('active');
            // Then show the specific sub-page
            appPages.forEach(page => page.classList.remove('active'));
            targetPage.classList.add('active');
        } else if (targetPage) {
            // It's a main page (like login or landing)
            targetPage.classList.add('active');
        } else {
            // Fallback to landing page if something goes wrong
            document.getElementById('landing-page').classList.add('active');
        }
        window.scrollTo(0, 0);
    }

    // Add click listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('href').substring(1);
            
            // If navigating to the matching page, render the profiles first
            if (pageId === 'matching-page') {
                renderProfiles(mockUser.currentVenueName);
            }
            
            showPage(pageId);
        });
    });

    // Handle smooth scrolling for anchor links on the landing page
    const scrollLinks = document.querySelectorAll('.nav-link-scroll');
    scrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
        });
    });


    // --- DYNAMIC CONTENT RENDERING ---

    function renderVenues() {
        venueGrid.innerHTML = '';
        mockVenues.forEach(venue => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${venue.img}" alt="${venue.name}" class="card-image">
                <div class="card-content">
                    <h4>${venue.name}</h4>
                    <p><strong>Area:</strong> ${venue.area}</p>
                    <div class="tags">
                        ${venue.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                mockUser.currentVenueId = venue.id;
                mockUser.currentVenueName = `${venue.name}, ${venue.area}`;
                updateDashboard();
                alert(`You have checked into ${venue.name}`);
                showPage('dashboard-page');
            });
            venueGrid.appendChild(card);
        });
    }

     function renderProfiles(venueName) {
        matchingVenueName.textContent = venueName;
        profileGrid.innerHTML = '';
        if (mockUser.currentVenueId) {
            mockAvailablePeople.forEach(person => {
                const card = document.createElement('div');
                card.className = 'card profile-card';
                card.innerHTML = `
                    <img src="${person.photo}" alt="${person.name}" class="card-image">
                    <div class="card-content">
                        <h4>${person.name}, ${person.age}</h4>
                        <p>${person.profession}</p>
                        <div class="tags">
                            ${person.interests.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary" style="margin-top: 1rem; width: 100%;">Send Invite</button>
                    </div>
                `;
                profileGrid.appendChild(card);
            });
        } else {
            profileGrid.innerHTML = `<p class="text-center" style="width: 100%;">You must check into a venue first to see available people.</p>`;
        }
    }

    // --- USER INTERACTIONS & APP LOGIC ---

    function toggleAvailability() {
        const isAvailable = availabilityToggle.classList.toggle('available');
        if (isAvailable) {
            if (!mockUser.currentVenueId) {
                alert("Please check into a venue first!");
                availabilityToggle.classList.remove('available');
                return;
            }
            availabilityToggle.textContent = "Go Offline";
            availabilityStatus.textContent = "You are now visible to others here.";
        } else {
            availabilityToggle.textContent = "I'm Available to Chat";
            availabilityStatus.textContent = "You are currently offline.";
        }
    }

    function updateDashboard() {
        welcomeMessage.textContent = `Welcome back, ${mockUser.name}!`;
        currentVenueDisplay.textContent = mockUser.currentVenueName;
    }

    function initializeApp() {
        updateDashboard();
        renderVenues();
        showPage('landing-page'); // Start on the landing page
    }

    // --- EVENT LISTENERS ---

    availabilityToggle.addEventListener('click', toggleAvailability);

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // ** FIREBASE INTEGRATION POINT **
        // On success, you would call:
        console.log("Login successful! Entering app...");
        showPage('dashboard-page');
    });

    // --- Landing Page Animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));


    // --- INITIALIZE APP ---
    initializeApp();

});