/**
 * Canvas View - High-Resolution Graphics Renderer (1200 x 750)
 */
export class CanvasView {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = 1200;
    this.height = 750;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  render(model, frameModel) {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

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

    // Background Grid Pattern
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

    // 2. Draw User Photo Inside Container Box
    const photoBox = { x: 70, y: 150, width: 380, height: 480 };

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 16);
    ctx.clip();

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height);

    if (model.imageLoaded && model.userImage.complete) {
      const imgAspect = model.userImage.width / model.userImage.height;
      const boxAspect = photoBox.width / photoBox.height;

      let drawW, drawH;
      if (imgAspect > boxAspect) {
        drawH = photoBox.height * model.photoScale;
        drawW = drawH * imgAspect;
      } else {
        drawW = photoBox.width * model.photoScale;
        drawH = drawW / imgAspect;
      }

      const drawX = photoBox.x + (photoBox.width - drawW) / 2 + model.photoOffset.x;
      const drawY = photoBox.y + (photoBox.height - drawH) / 2 + model.photoOffset.y;

      ctx.drawImage(model.userImage, drawX, drawY, drawW, drawH);
    }
    ctx.restore();

    // Photo Box Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 16);
    ctx.stroke();

    // 3. Draw Card Text Details
    const activeFrame = frameModel.getActiveFrame();

    // Organization Header
    ctx.fillStyle = activeFrame.color;
    ctx.font = '800 24px "Space Grotesk", sans-serif';
    ctx.fillText(model.orgName.toUpperCase() || 'OFFICIAL ID BADGE', 500, 150);

    // Full Name
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 48px "Outfit", sans-serif';
    ctx.fillText(model.fullName || 'ALEX VANCE', 500, 220);

    // Designation / Role
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 26px "Outfit", sans-serif';
    ctx.fillText(model.roleTitle || 'Senior Specialist', 500, 265);

    // Divider Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(500, 290);
    ctx.lineTo(1120, 290);
    ctx.stroke();

    // Key Details Grid
    const details = [
      { label: 'CLEARANCE LEVEL', val: model.clearanceLevel },
      { label: 'SERIAL ID', val: model.uniqueId },
      { label: 'ISSUE DATE', val: model.issueDate },
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

    // 4. Draw Simulated Barcode & Security Hologram
    const barcodeY = 540;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(500, barcodeY, 420, 75);

    ctx.fillStyle = '#000000';
    let barX = 515;
    while (barX < 900) {
      const barW = Math.floor(Math.random() * 4) + 1;
      ctx.fillRect(barX, barcodeY + 10, barW, 42);
      barX += barW + Math.floor(Math.random() * 4) + 2;
    }

    ctx.fillStyle = '#000000';
    ctx.font = '600 14px "Space Grotesk", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(model.uniqueId, 710, barcodeY + 67);
    ctx.textAlign = 'left';

    // Hologram Seal
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

    // 5. Draw Frame Overlay
    this.drawFrameOverlay(activeFrame);
  }

  drawFrameOverlay(frame) {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;

    // Custom uploaded frame image overlay
    if (frame.image) {
      ctx.drawImage(frame.image, 0, 0, width, height);
      return;
    }

    // Default vector frame graphics
    ctx.save();
    ctx.lineWidth = 12;
    ctx.strokeStyle = frame.color;
    ctx.shadowColor = frame.color;
    ctx.shadowBlur = 20;

    ctx.beginPath();
    ctx.roundRect(10, 10, width - 20, height - 20, 24);
    ctx.stroke();

    ctx.shadowBlur = 0;

    const cornerSize = 40;
    ctx.fillStyle = frame.color;

    ctx.fillRect(10, 10, cornerSize, 6);
    ctx.fillRect(10, 10, 6, cornerSize);

    ctx.fillRect(width - 10 - cornerSize, 10, cornerSize, 6);
    ctx.fillRect(width - 16, 10, 6, cornerSize);

    ctx.fillRect(10, height - 16, cornerSize, 6);
    ctx.fillRect(10, height - 10 - cornerSize, 6, cornerSize);

    ctx.fillRect(width - 10 - cornerSize, height - 16, cornerSize, 6);
    ctx.fillRect(width - 16, height - 10 - cornerSize, 6, cornerSize);

    ctx.fillStyle = frame.color;
    ctx.beginPath();
    ctx.roundRect(40, 25, 260, 36, 8);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText(`FRAME #${frame.id}: ${frame.name.toUpperCase()}`, 55, 48);

    ctx.restore();
  }
}
