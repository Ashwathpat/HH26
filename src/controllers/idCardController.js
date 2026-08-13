import { IdCardModel } from '../models/idCardModel.js';
import { FrameModel } from '../models/frameModel.js';
import { CanvasView } from '../views/canvasView.js';
import { UIView } from '../views/uiView.js';
import { PhotoController } from './photoController.js';
import { FrameController } from './frameController.js';
import { ShareController } from './shareController.js';
import { showToast } from '../utils/toast.js';

/**
 * Main Application Orchestrator Controller
 */
export class IdCardController {
  constructor() {
    this.model = new IdCardModel();
    this.frameModel = new FrameModel();

    this.canvasView = new CanvasView(document.getElementById('idCardCanvas'));
    this.uiView = new UIView();

    this.photoController = new PhotoController(this.model, (opts) => this.onStateChange(opts));
    this.frameController = new FrameController(this.frameModel, this.uiView, () => this.onStateChange());
    this.shareController = new ShareController(this.model, this.canvasView, this.uiView);

    this.initFormEvents();
  }

  init() {
    this.uiView.updateInputsFromModel(this.model);

    this.uiView.renderFramesGrid(this.frameModel);

    this.model.userImage.onload = () => {
      this.model.imageLoaded = true;
      this.render();
    };

    this.render();
  }

  initFormEvents() {
    const inputs = [
      this.uiView.fullNameInput,
      this.uiView.roleTitleInput,
      this.uiView.orgNameInput
    ];

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        this.uiView.updateModelFromInputs(this.model);
        this.render();
      });
    });

  }

  onStateChange(options = {}) {
    this.render();
  }

  render() {
    this.canvasView.render(this.model, this.frameModel);
    const caption = this.model.generateCaption(this.frameModel.getActiveFrame());
    this.uiView.updateCaption(caption);
  }
}
