import { showToast } from '../utils/toast.js';

/**
 * Frame Controller - Handles frame slot selection & custom frame uploads
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
    this.randomFrameBtn.addEventListener('click', () => {
      const randomId = this.frameModel.getRandomFrameId();
      this.selectFrame(randomId);
      showToast(`Assigned Frame #${randomId}!`);
    });
  }

  selectFrame(id) {
    this.frameModel.setActiveFrame(id);
    this.uiView.renderFramesGrid(
      this.frameModel,
      (frameId) => this.selectFrame(frameId),
      (file) => this.handleCustomFrameUpload(file)
    );
    this.renderCallback();
  }

  handleCustomFrameUpload(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG/SVG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const activeId = this.frameModel.activeFrameId;
        this.frameModel.setSlotImage(activeId, img);
        showToast(`Custom Frame Overlay loaded into Frame #${activeId}!`);
        this.renderCallback();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
