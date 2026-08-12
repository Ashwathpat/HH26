/**
 * UI View - Handles DOM elements binding and the single live frame presentation.
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

  renderFramesGrid(frameModel) {
    const frame = frameModel.getActiveFrame();
    this.framesGrid.innerHTML = `
      <div class="single-frame-card active" aria-label="HHG26 Beach Pass live frame">
        <div class="single-frame-preview" aria-hidden="true">
          <span class="single-frame-wave"></span>
          <span class="single-frame-sun"></span>
          <span class="single-frame-palm">✦</span>
        </div>
        <div class="single-frame-copy">
          <div class="frame-card-num">LIVE PASS</div>
          <div class="frame-card-title">${frame.name}</div>
          <div class="frame-card-status">YOUR ONE CANONICAL FRAME</div>
          <p>Upload your photo and make this beach pass yours.</p>
        </div>
      </div>
    `;
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
