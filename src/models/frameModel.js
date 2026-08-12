/**
 * Frame Template Model - Manages 10 customizable frame slots
 */
export class FrameModel {
  constructor() {
    this.slots = [
      { id: 1, name: 'Goa Signal', color: '#b9dc38', image: null, available: true },
      { id: 2, name: 'Template Pending', color: '#f59e0b', image: null, available: false },
      { id: 3, name: 'Template Pending', color: '#8b5cf6', image: null, available: false },
      { id: 4, name: 'Template Pending', color: '#10b981', image: null, available: false },
      { id: 5, name: 'Template Pending', color: '#64748b', image: null, available: false },
      { id: 6, name: 'Template Pending', color: '#ec4899', image: null, available: false },
      { id: 7, name: 'Template Pending', color: '#3b82f6', image: null, available: false },
      { id: 8, name: 'Template Pending', color: '#0284c7', image: null, available: false },
      { id: 9, name: 'Template Pending', color: '#e2e8f0', image: null, available: false },
      { id: 10, name: 'Template Pending', color: '#84cc16', image: null, available: false },
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
