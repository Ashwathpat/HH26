/**
 * ID Matrix Studio - Application Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const canvas = document.getElementById('idCardCanvas');
  const ctx = canvas.getContext('2d');
  
  const photoInput = document.getElementById('photoInput');
  const uploadZone = document.getElementById('uploadZone');
  const zoomSlider = document.getElementById('zoomSlider');
  const resetPhotoBtn = document.getElementById('resetPhotoBtn');
  const randomFrameBtn = document.getElementById('randomFrameBtn');
  const framesGrid = document.getElementById('framesGrid');
  const regenerateIdBtn = document.getElementById('regenerateIdBtn');

  // Inputs
  const fullNameInput = document.getElementById('fullName');
  const roleTitleInput = document.getElementById('roleTitle');
  const orgNameInput = document.getElementById('orgName');
  const clearanceLevelInput = document.getElementById('clearanceLevel');
  const uniqueIdInput = document.getElementById('uniqueId');
  const issueDateInput = document.getElementById('issueDate');
  const captionBox = document.getElementById('captionBox');

  // Actions
  const downloadBtn = document.getElementById('downloadBtn');
  const copyCaptionBtn = document.getElementById('copyCaptionBtn');
  const shareXBtn = document.getElementById('shareXBtn');
  const shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
  const shareInstaBtn = document.getElementById('shareInstaBtn');

  // Modal & Toast
  const instaModal = document.getElementById('instaModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const openInstaBtn = document.getElementById('openInstaBtn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  // Photo State
  let userImage = new Image();
  let imageLoaded = false;
  let photoOffset = { x: 0, y: 0 };
  let photoScale = 1;
  let isDragging = false;
  let dragStart = { x: 0, y: 0 };

  // Default Image initialization
  userImage.crossOrigin = 'Anonymous';
  // Load sample avatar or default canvas pattern
  userImage.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  userImage.onload = () => {
    imageLoaded = true;
    renderCanvas();
  };

  // Generate Initial Unique ID
  function generateUniqueId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `ID-${code}-${randNum}`;
  }

  uniqueIdInput.value = generateUniqueId();
  updateCaptionText();

  // Populate 10 Frame Selector UI
  function renderFramesGrid() {
    framesGrid.innerHTML = '';
    window.IDCardFrames.slots.forEach(slot => {
      const card = document.createElement('div');
      card.className = `frame-card ${slot.id === window.IDCardFrames.activeFrameId ? 'active' : ''}`;
      card.dataset.id = slot.id;
      
      card.innerHTML = `
        <div class="frame-card-num">FRAME ${slot.id}</div>
        <div class="frame-card-title">${slot.name}</div>
      `;

      card.addEventListener('click', () => {
        window.IDCardFrames.setActiveFrame(slot.id);
        renderFramesGrid();
        renderCanvas();
        updateCaptionText();
      });

      framesGrid.appendChild(card);
    });

    // Add Custom Frame Overlay Upload Slot
    const customSlot = document.createElement('div');
    customSlot.className = 'frame-upload-slot';
    customSlot.innerHTML = `
      <label for="frameOverlayInput" style="cursor:pointer; font-size:0.75rem; color:var(--accent-cyan); display:flex; align-items:center; justify-content:center; gap:0.4rem;">
        <i class="fa-solid fa-file-image"></i> Upload Custom Frame PNG/SVG
      </label>
      <input type="file" id="frameOverlayInput" accept="image/*" style="display:none;" />
    `;
    framesGrid.appendChild(customSlot);

    document.getElementById('frameOverlayInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            window.IDCardFrames.setSlotImage(window.IDCardFrames.activeFrameId, img);
            showToast(`Custom Frame loaded into Slot #${window.IDCardFrames.activeFrameId}!`);
            renderCanvas();
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
  }

  renderFramesGrid();

  // Handle Photo Upload
  uploadZone.addEventListener('click', () => photoInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
  });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
      handlePhotoFile(e.dataTransfer.files[0]);
    }
  });

  photoInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handlePhotoFile(e.target.files[0]);
    }
  });

  function handlePhotoFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (JPG, PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      userImage = new Image();
      userImage.onload = () => {
        imageLoaded = true;
        photoOffset = { x: 0, y: 0 };
        photoScale = 1;
        zoomSlider.value = 1;
        
        // Randomly pick a new frame on upload as per requirement!
        const randomFrameId = Math.floor(Math.random() * 10) + 1;
        window.IDCardFrames.setActiveFrame(randomFrameId);
        renderFramesGrid();
        
        renderCanvas();
        showToast('Photo uploaded & Random Frame assigned!');
      };
      userImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Photo Zoom & Pan Handlers
  zoomSlider.addEventListener('input', (e) => {
    photoScale = parseFloat(e.target.value);
    renderCanvas();
  });

  resetPhotoBtn.addEventListener('click', () => {
    photoOffset = { x: 0, y: 0 };
    photoScale = 1;
    zoomSlider.value = 1;
    renderCanvas();
  });

  randomFrameBtn.addEventListener('click', () => {
    const randomFrameId = Math.floor(Math.random() * 10) + 1;
    window.IDCardFrames.setActiveFrame(randomFrameId);
    renderFramesGrid();
    renderCanvas();
    updateCaptionText();
    showToast(`Assigned Frame #${randomFrameId}!`);
  });

  regenerateIdBtn.addEventListener('click', () => {
    uniqueIdInput.value = generateUniqueId();
    renderCanvas();
    updateCaptionText();
    showToast('New Unique Serial ID generated!');
  });

  // Canvas Drag Photo Repositioning
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = canvas.getBoundingClientRect();
    dragStart.x = e.clientX - rect.left - photoOffset.x;
    dragStart.y = e.clientY - rect.top - photoOffset.y;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const rect = canvas.getBoundingClientRect();
    photoOffset.x = e.clientX - rect.left - dragStart.x;
    photoOffset.y = e.clientY - rect.top - dragStart.y;
    renderCanvas();
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Form Inputs Auto-Update
  [fullNameInput, roleTitleInput, orgNameInput, clearanceLevelInput, issueDateInput].forEach(input => {
    input.addEventListener('input', () => {
      renderCanvas();
      updateCaptionText();
    });
  });

  // Main Canvas Rendering Engine
  function renderCanvas() {
    const width = canvas.width;  // 1200
    const height = canvas.height; // 750

    // Clear Canvas
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Card Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, '#0a0f1d');
    bgGradient.addColorStop(0.5, '#111827');
    bgGradient.addColorStop(1, '#070b14');
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, 24);
    ctx.fill();

    // Background Grid Lines Pattern
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // 2. Draw User Photo Inside Frame Photo Box
    const photoBox = { x: 70, y: 150, width: 380, height: 480 };

    ctx.save();
    // Clip to Photo Box Container with rounded corners
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 16);
    ctx.clip();

    // Fill Photo Background
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height);

    if (imageLoaded && userImage.complete) {
      const imgAspect = userImage.width / userImage.height;
      const boxAspect = photoBox.width / photoBox.height;
      
      let drawW, drawH;
      if (imgAspect > boxAspect) {
        drawH = photoBox.height * photoScale;
        drawW = drawH * imgAspect;
      } else {
        drawW = photoBox.width * photoScale;
        drawH = drawW / imgAspect;
      }

      const drawX = photoBox.x + (photoBox.width - drawW) / 2 + photoOffset.x;
      const drawY = photoBox.y + (photoBox.height - drawH) / 2 + photoOffset.y;

      ctx.drawImage(userImage, drawX, drawY, drawW, drawH);
    }

    ctx.restore();

    // Photo Box Border Line & Glow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 16);
    ctx.stroke();

    // 3. Draw Card Text Details (Right Column)
    const activeFrame = window.IDCardFrames.getActiveFrame();

    // Header Badge / Organization Name
    ctx.fillStyle = activeFrame.color;
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.fillText(orgNameInput.value.toUpperCase() || 'OFFICIAL ID BADGE', 500, 150);

    // Full Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Outfit", sans-serif';
    ctx.fillText(fullNameInput.value || 'ALEX VANCE', 500, 220);

    // Role / Title
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px "Outfit", sans-serif';
    ctx.fillText(roleTitleInput.value || 'Senior Specialist', 500, 265);

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(500, 290);
    ctx.lineTo(1120, 290);
    ctx.stroke();

    // Key Details Grid
    const details = [
      { label: 'CLEARANCE LEVEL', val: clearanceLevelInput.value },
      { label: 'SERIAL ID', val: uniqueIdInput.value },
      { label: 'ISSUE DATE', val: issueDateInput.value },
      { label: 'STATUS', val: 'ACTIVE / VERIFIED' }
    ];

    let startY = 340;
    details.forEach((d, idx) => {
      const col = idx % 2 === 0 ? 500 : 820;
      const rowY = startY + Math.floor(idx / 2) * 85;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '700 14px "Space Grotesk", sans-serif';
      ctx.fillText(d.label, col, rowY);

      ctx.fillStyle = d.label === 'SERIAL ID' ? activeFrame.color : '#f1f5f9';
      ctx.font = '800 22px "Space Grotesk", monospace';
      ctx.fillText(d.val, col, rowY + 30);
    });

    // 4. Draw Simulated Barcode & Hologram Seal
    // Barcode Container
    const barcodeY = 540;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(500, barcodeY, 420, 75);

    // Barcode Vertical Bars
    ctx.fillStyle = '#000000';
    let barX = 515;
    while (barX < 900) {
      const barW = Math.floor(Math.random() * 4) + 1;
      ctx.fillRect(barX, barcodeY + 10, barW, 42);
      barX += barW + Math.floor(Math.random() * 4) + 2;
    }

    // Barcode Text Number
    ctx.fillStyle = '#000000';
    ctx.font = '600 14px "Space Grotesk", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(uniqueIdInput.value, 710, barcodeY + 67);
    ctx.textAlign = 'left'; // reset

    // Hologram Security Badge
    ctx.save();
    const holoX = 1010;
    const holoY = 575;
    const holoGrad = ctx.createRadialGradient(holoX, holoY, 5, holoX, holoY, 45);
    holoGrad.addColorStop(0, '#67e8f9');
    holoGrad.addColorStop(0.5, '#c084fc');
    holoGrad.addColorStop(1, '#f472b6');
    ctx.fillStyle = holoGrad;
    ctx.beginPath();
    ctx.arc(holoX, holoY, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = '900 16px "Outfit", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('VERIFIED', holoX, holoY - 4);
    ctx.font = '800 10px "Space Grotesk", sans-serif';
    ctx.fillText('SECURITY', holoX, holoY + 12);
    ctx.textAlign = 'left';
    ctx.restore();

    // 5. Draw Selected Frame Template Overlay
    window.IDCardFrames.drawFrame(ctx, width, height, {
      name: fullNameInput.value,
      uniqueId: uniqueIdInput.value
    });
  }

  // Update Auto-Generated Caption Text
  function updateCaptionText() {
    const name = fullNameInput.value || 'Alex Vance';
    const role = roleTitleInput.value || 'Member';
    const org = orgNameInput.value || 'NEXUS';
    const idNum = uniqueIdInput.value;
    const frame = window.IDCardFrames.getActiveFrame();

    const caption = `🪪 Verified Official ID Badge Generated!\n\n` +
      `👤 Name: ${name}\n` +
      `💼 Role: ${role}\n` +
      `🏢 Org: ${org}\n` +
      `🔑 Unique Serial ID: ${idNum}\n` +
      `🎨 Frame Theme: #${frame.id} ${frame.name}\n\n` +
      `Generated instantly via ID Matrix Studio! 🚀\n` +
      `#IDCard #VerifiedBadge #DigitalIdentity #TechID`;

    captionBox.value = caption;
  }

  // Download ID Card as PNG
  downloadBtn.addEventListener('click', () => {
    const imageURI = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ID_CARD_${uniqueIdInput.value}.png`;
    link.href = imageURI;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('High-Resolution ID Card downloaded!');
  });

  // Copy Caption Action
  copyCaptionBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(captionBox.value);
    showToast('Caption copied to clipboard!');
  });

  // Instant Share to X.com (Twitter)
  shareXBtn.addEventListener('click', () => {
    // Copy caption to clipboard first for convenience
    navigator.clipboard.writeText(captionBox.value);
    
    // Construct X intent URL with pre-filled tweet text
    const encodedText = encodeURIComponent(captionBox.value);
    const intentUrl = `https://x.com/intent/tweet?text=${encodedText}`;
    
    window.open(intentUrl, '_blank', 'width=600,height=500');
    showToast('Opening X.com with auto-generated caption!');
  });

  // Share to WhatsApp
  shareWhatsappBtn.addEventListener('click', () => {
    const encodedText = encodeURIComponent(captionBox.value);
    const waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(waUrl, '_blank');
  });

  // Share to Instagram (Show Instructions Modal)
  shareInstaBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(captionBox.value);
    instaModal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => instaModal.classList.add('hidden'));
  openInstaBtn.addEventListener('click', () => {
    window.open('https://www.instagram.com', '_blank');
    instaModal.classList.add('hidden');
  });

  // Toast Notification Helper
  function showToast(message) {
    toastMsg.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }
});
