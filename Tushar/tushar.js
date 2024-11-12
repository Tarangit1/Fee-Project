document.addEventListener("DOMContentLoaded", () => {
    // Animate Hero Section
    const heroSection = document.querySelector(".premium-hero");
    heroSection.style.opacity = 0;
    heroSection.style.transform = "translateY(-20px)";
    setTimeout(() => {
      heroSection.style.transition = "all 1s ease";
      heroSection.style.opacity = 1;
      heroSection.style.transform = "translateY(0)";
    }, 100);
  
    // Scroll Animations for Benefits
    const benefits = document.querySelectorAll(".benefit");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.2 }
    );
  
    benefits.forEach((benefit) => {
      observer.observe(benefit);
    });
  
    // Button Click Ripple Effect
    const buttons = document.querySelectorAll(".select-button");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        button.classList.add("clicked");
        setTimeout(() => button.classList.remove("clicked"), 300);
      });
    });
  });
  