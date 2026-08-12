import { generateUniqueId } from '../utils/idGenerator.js';

/**
 * ID Card Data Model - Manages user metadata and photo state
 */
export class IdCardModel {
  constructor() {
    this.fullName = 'Alex Vance';
    this.roleTitle = 'Senior Cyber Architect';
    this.orgName = 'NEXUS LABS ALPHA';
    this.clearanceLevel = 'LEVEL 05 - OMNI';
    this.issueDate = '2026-08-12';
    this.uniqueId = generateUniqueId();

    // Photo State
    this.userImage = new Image();
    this.imageLoaded = false;
    this.photoOffset = { x: 0, y: 0 };
    this.photoScale = 1;

    // Load default image
    this.userImage.crossOrigin = 'Anonymous';
    this.userImage.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80';
  }

  regenerateUniqueId() {
    this.uniqueId = generateUniqueId();
    return this.uniqueId;
  }

  resetPhotoPosition() {
    this.photoOffset = { x: 0, y: 0 };
    this.photoScale = 1;
  }

  generateCaption(activeFrame) {
    return `🪪 Verified Official ID Badge Generated!\n\n` +
      `👤 Name: ${this.fullName || 'Member'}\n` +
      `💼 Role: ${this.roleTitle || 'Specialist'}\n` +
      `🏢 Org: ${this.orgName || 'NEXUS'}\n` +
      `🔑 Unique Serial ID: ${this.uniqueId}\n` +
      `🎨 Frame Theme: #${activeFrame.id} ${activeFrame.name}\n\n` +
      `Generated instantly via ID Matrix Studio! 🚀\n` +
      `#IDCard #VerifiedBadge #DigitalIdentity #TechID`;
  }
}
