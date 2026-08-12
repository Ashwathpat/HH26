/**
 * Frame Template Model - Manages 10 customizable frame slots
 */
export class FrameModel {
  constructor() {
    this.slots = [
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
    ];
    this.activeFrameId = 1;
  }

  getActiveFrame() {
    return this.slots.find(s => s.id === this.activeFrameId) || this.slots[0];
  }

  setActiveFrame(id) {
    this.activeFrameId = parseInt(id, 10);
  }

  getRandomFrameId() {
    return Math.floor(Math.random() * this.slots.length) + 1;
  }

  setSlotImage(slotId, imageElement) {
    const slot = this.slots.find(s => s.id === parseInt(slotId, 10));
    if (slot) {
      slot.image = imageElement;
    }
  }
}
