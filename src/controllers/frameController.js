import { showToast } from '../utils/toast.js';

/**
 * Frame Controller - Keeps HHG26 on its single canonical beach pass.
 */
export class FrameController {
  constructor(frameModel, uiView, renderCallback) {
    this.frameModel = frameModel;
    this.uiView = uiView;
    this.renderCallback = renderCallback;
    this.randomFrameBtn = document.getElementById('randomFrameBtn');
    this.initEvents();
  }

  initEvents() {
    if (!this.randomFrameBtn) return;
    this.randomFrameBtn.textContent = 'Live Beach Pass';
    this.randomFrameBtn.disabled = true;
    this.randomFrameBtn.setAttribute('aria-disabled', 'true');
  }

  selectFrame() {
    this.frameModel.setActiveFrame(1);
    this.uiView.renderFramesGrid(this.frameModel);
    this.renderCallback();
  }

  handleCustomFrameUpload() {
    showToast('HHG26 uses one canonical beach pass.');
  }
}
