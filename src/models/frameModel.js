/**
 * Frame Template Model - HHG26's single canonical beach pass.
 */
export class FrameModel {
  constructor() {
    this.slots = [
      {
        id: 1,
        name: 'HHG26 Beach Pass',
        color: '#4da2ff',
        image: null,
        assetPath: '/assets/frames/hhg26-beach-pass.png',
        available: true,
      },
    ];
    this.activeFrameId = 1;
  }

  getActiveFrame() {
    return this.slots[0];
  }

  setActiveFrame() {
    this.activeFrameId = 1;
  }

  getRandomFrameId() {
    return 1;
  }

  setSlotImage(slotId, imageElement) {
    if (parseInt(slotId, 10) === 1) {
      this.slots[0].image = imageElement;
    }
  }
}
