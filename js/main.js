/* ==========================================================================
   EarnTech Front-End Client Controller
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Automatically highlight the active navigation bar link based on current page URL
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Intercept Contact Form Submissions dynamically if form exists on page
    const contactForm = document.querySelector('form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Stop standard page refreshing reload
            
            // Collect input values from form containers securely
            const formData = new FormData(contactForm);
            const formObject = Object.fromEntries(formData.entries());
            
            try {
                // Dispatching network async request payload to backend pipeline port
                const response = await fetch('http://localhost:3000/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formObject)
                });
                
                if (response.ok) {
                    alert('Success! Your details have been securely recorded.');
                    contactForm.reset(); // Clear form boxes on successful post
                } else {
                    alert('Submission error. Server returned a status failure.');
                }
            } catch (error) {
                console.error('Network Error:', error);
                alert('Unable to connect to local server backend. Make sure the Node server is running.');
            }
        });
    }
});
