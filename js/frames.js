/**
 * Frame Manager & Template Engine
 * Supports 10 customizable frame slots where users can upload or select custom PNG/SVG card frame designs.
 */

window.IDCardFrames = {
  // 10 Frame Configuration Slots
  slots: [
    { id: 1, name: 'Cyberpunk Neon', color: '#06b6d4', image: null },
    { id: 2, name: 'VIP Gold Spec', color: '#f59e0b', image: null },
    { id: 3, name: 'Deep Space', color: '#8b5cf6', image: null },
    { id: 4, name: 'Matrix Tech', color: '#10b981', image: null },
    { id: 5, name: 'Sleek Dark', color: '#64748b', image: null },
    { id: 6, name: 'Synthwave 80s', color: '#ec4899', image: null },
    { id: 7, name: 'Glassmorphism', color: '#3b82f6', image: null },
    { id: 8, name: 'Quantum Shield', color: '#0284c7', image: null },
    { id: 9, name: 'Executive Platinum', color: '#e2e8f0', image: null },
    { id: 10, name: 'Tactical Spec', color: '#84cc16', image: null }
  ],

  activeFrameId: 1,

  getActiveFrame() {
    return this.slots.find(s => s.id === this.activeFrameId) || this.slots[0];
  },

  setActiveFrame(id) {
    this.activeFrameId = parseInt(id, 10);
  },

  // Set custom image for a frame slot (PNG, SVG, JPG)
  setSlotImage(slotId, imageElement) {
    const slot = this.slots.find(s => s.id === parseInt(slotId, 10));
    if (slot) {
      slot.image = imageElement;
    }
  },

  /**
   * Draw Frame Overlay onto the Canvas
   * If user loaded a custom frame image, draw that image stretched/fitted over the canvas (1200x750).
   * Otherwise, draw a clean vector frame design layout.
   */
  drawFrame(ctx, width, height, data) {
    const frame = this.getActiveFrame();

    // 1. If custom frame image exists, render it as top layer overlay
    if (frame.image) {
      ctx.drawImage(frame.image, 0, 0, width, height);
      return;
    }

    // 2. Fallback / Base Frame layout design structure
    ctx.save();
    
    // Outer Frame Border & Glow
    ctx.lineWidth = 12;
    ctx.strokeStyle = frame.color;
    ctx.shadowColor = frame.color;
    ctx.shadowBlur = 20;
    
    // Draw Card Outer Boundary
    ctx.beginPath();
    ctx.roundRect(10, 10, width - 20, height - 20, 24);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;

    // Corner Decorative Accents
    const cornerSize = 40;
    ctx.fillStyle = frame.color;

    // Top-Left Corner Bracket
    ctx.fillRect(10, 10, cornerSize, 6);
    ctx.fillRect(10, 10, 6, cornerSize);

    // Top-Right Corner Bracket
    ctx.fillRect(width - 10 - cornerSize, 10, cornerSize, 6);
    ctx.fillRect(width - 16, 10, 6, cornerSize);

    // Bottom-Left Corner Bracket
    ctx.fillRect(10, height - 16, cornerSize, 6);
    ctx.fillRect(10, height - 10 - cornerSize, 6, cornerSize);

    // Bottom-Right Corner Bracket
    ctx.fillRect(width - 10 - cornerSize, height - 16, cornerSize, 6);
    ctx.fillRect(width - 16, height - 10 - cornerSize, 6, cornerSize);

    // Frame Header Tag Banner
    ctx.fillStyle = frame.color;
    ctx.beginPath();
    ctx.roundRect(40, 25, 260, 36, 8);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 16px "Space Grotesk", sans-serif';
    ctx.fillText(`FRAME #${frame.id}: ${frame.name.toUpperCase()}`, 55, 48);

    // Watermark Logo Mark
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.font = 'bold 120px "Outfit", sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('NEXUS', width - 40, height - 40);

    ctx.restore();
  }
};
