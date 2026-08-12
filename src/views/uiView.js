/**
 * UI View - Handles DOM elements binding and Frame Grid rendering
 */
export class UIView {
  constructor() {
    this.framesGrid = document.getElementById('framesGrid');
    this.fullNameInput = document.getElementById('fullName');
    this.roleTitleInput = document.getElementById('roleTitle');
    this.orgNameInput = document.getElementById('orgName');
    this.clearanceLevelInput = document.getElementById('clearanceLevel');
    this.uniqueIdInput = document.getElementById('uniqueId');
    this.issueDateInput = document.getElementById('issueDate');
    this.captionBox = document.getElementById('captionBox');
  }

  renderFramesGrid(frameModel, onSelectFrame, onCustomFrameUpload) {
    this.framesGrid.innerHTML = '';
    
    frameModel.slots.forEach(slot => {
      const card = document.createElement('div');
      const isAvailable = slot.available !== false;
      card.className = `frame-card ${slot.id === frameModel.activeFrameId ? 'active' : ''} ${isAvailable ? '' : 'locked'}`;
      card.dataset.id = slot.id;
      card.setAttribute('aria-disabled', String(!isAvailable));

      card.innerHTML = `
        <div class="frame-card-num">FRAME ${String(slot.id).padStart(2, '0')}</div>
        <div class="frame-card-title">${slot.name}</div>
        <div class="frame-card-status">${isAvailable ? 'LIVE TEMPLATE' : 'COMING SOON'}</div>
      `;

      if (isAvailable) {
        card.addEventListener('click', () => onSelectFrame(slot.id));
      }
      this.framesGrid.appendChild(card);
    });

    // Add Custom Frame Upload Slot
    const customSlot = document.createElement('div');
    customSlot.className = 'frame-upload-slot';
    customSlot.innerHTML = `
      <label for="frameOverlayInput" style="cursor:pointer; font-size:0.75rem; color:var(--accent-cyan); display:flex; align-items:center; justify-content:center; gap:0.4rem;">
        <i class="fa-solid fa-file-image"></i> Upload Custom Frame PNG/SVG
      </label>
      <input type="file" id="frameOverlayInput" accept="image/*" style="display:none;" />
    `;
    this.framesGrid.appendChild(customSlot);

    document.getElementById('frameOverlayInput').addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        onCustomFrameUpload(e.target.files[0]);
      }
    });
  }

  updateInputsFromModel(model) {
    this.fullNameInput.value = model.fullName;
    this.roleTitleInput.value = model.roleTitle;
    this.orgNameInput.value = model.orgName;
    this.clearanceLevelInput.value = model.clearanceLevel;
    this.uniqueIdInput.value = model.uniqueId;
    this.issueDateInput.value = model.issueDate;
  }

  updateModelFromInputs(model) {
    model.fullName = this.fullNameInput.value;
    model.roleTitle = this.roleTitleInput.value;
    model.orgName = this.orgNameInput.value;
    model.clearanceLevel = this.clearanceLevelInput.value;
    model.issueDate = this.issueDateInput.value;
  }

  updateCaption(text) {
    this.captionBox.value = text;
  }
}
