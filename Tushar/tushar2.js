document.addEventListener("DOMContentLoaded", () => {
    const priceSelect = document.getElementById("price-select");
    const qrCode = document.getElementById("qr-code");
  
    // Map price plans to QR code images
    const qrCodes = {
      individual: "qr-individual.png", // Replace with actual paths
      duo: "qr-duo.png",
      family: "qr-family.png",
      student: "qr-student.png",
    };
  
    // Change QR code image on price plan selection
    priceSelect.addEventListener("change", (event) => {
      const selectedPlan = event.target.value;
      if (qrCodes[selectedPlan]) {
        qrCode.src = qrCodes[selectedPlan];
      } else {
        qrCode.src = "default-qr.png";
      }
    });
  
    // QR Code Scanner
    let scanner = new Instascan.Scanner({ video: document.getElementById("preview") });
    
    scanner.addListener("scan", function (content) {
      document.getElementById("result").textContent = content;
      alert(`Payment Link Detected: ${content}`);
      // Redirect to the payment link
      window.location.href = content;
    });
  
    Instascan.Camera.getCameras()
      .then(function (cameras) {
        if (cameras.length > 0) {
          scanner.start(cameras[0]);
        } else {
          console.error("No cameras found.");
          alert("No cameras found on this device!");
        }
      })
      .catch(function (e) {
        console.error(e);
        alert("Camera access denied or unavailable.");
      });
  });
  