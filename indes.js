document.addEventListener("DOMContentLoaded", function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Updated Navigation menu toggle
    const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navLinks = document.querySelectorAll('.nav-links li');
        const body = document.querySelector('body');

        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');
            
            // Prevent body scroll when menu is open
            if (nav.classList.contains('nav-active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = 'auto';
            }

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                body.style.overflow = 'auto';
                navLinks.forEach(link => link.style.animation = '');
            });
        });
    }

    // Reveal elements on scroll
    const revealOnScroll = () => {
        const elements = document.querySelectorAll('.reveal');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 150) {
                element.classList.add('active');
            }
        });
    }

    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Sending...'; // Change button text to indicate loading
            submitButton.disabled = true; // Disable the button to prevent multiple submissions

            // Simulate sending the message
            setTimeout(() => {
                submitButton.textContent = 'Message Sent!'; // Change button text to confirmation
                // You can also add a class to change the button's appearance for success
                submitButton.classList.add('success');

                setTimeout(() => {
                    submitButton.textContent = originalButtonText; // Revert button text
                    submitButton.classList.remove('success'); // Remove success class
                    submitButton.disabled = false; // Enable the button
                    contactForm.reset(); // Clear the form
                }, 2000); // Revert after 2 seconds

            }, 1500); // Simulate a 1.5 second sending delay
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    navSlide();
});

