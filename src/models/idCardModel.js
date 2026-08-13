import { generateUniqueId } from '../utils/idGenerator.js';

/**
 * ID Card Data Model - Manages user metadata and photo state
 */
export class IdCardModel {
  constructor() {
    this.fullName = 'Alex Vance';
    this.roleTitle = 'Builder';
    this.orgName = 'Team AAA';
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

  generateCaption() {
    return `I’m participating in Hacker House Goa ’26!\n\n` +
      `Name: ${this.fullName || 'Builder'}\n` +
      `Role: ${this.roleTitle || 'Participant'}\n` +
      `Team: ${this.orgName || 'Team AAA'}\n\n` +
      `See you at the beach arcade. Code, create, connect.\n\n` +
      `Created with Team AAA.\n` +
      `#HackerHouseGoa #HHG26 #BuildInGoa`;
  }
}
