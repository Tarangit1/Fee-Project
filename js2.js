document.getElementById('launchButton').addEventListener('click', () => {
  const rocket = document.querySelector('.rocket');

  // Reset animation
  rocket.style.animation = 'none';
  rocket.offsetHeight; // Trigger reflow to restart the animation
  rocket.style.animation = 'moveRocket 4s ease-in-out forwards';
});
