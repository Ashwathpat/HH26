import { showToast } from '../utils/toast.js';

/**
 * Photo Controller - Drag, drop, zoom, and canvas pan controller
 */
export class PhotoController {
  constructor(model, renderCallback) {
    this.model = model;
    this.renderCallback = renderCallback;

    this.uploadZone = document.getElementById('uploadZone');
    this.photoInput = document.getElementById('photoInput');
    this.zoomSlider = document.getElementById('zoomSlider');
    this.resetPhotoBtn = document.getElementById('resetPhotoBtn');
    this.canvas = document.getElementById('idCardCanvas');

    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };

    this.initEvents();
  }

  initEvents() {
    this.uploadZone.addEventListener('click', () => this.photoInput.click());
    
    this.uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      this.uploadZone.classList.add('dragover');
    });

    this.uploadZone.addEventListener('dragleave', () => this.uploadZone.classList.remove('dragover'));

    this.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadZone.classList.remove('dragover');
      if (e.dataTransfer.files.length > 0) {
        this.handleFile(e.dataTransfer.files[0]);
      }
    });

    this.photoInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        this.handleFile(e.target.files[0]);
      }
    });

    this.zoomSlider.addEventListener('input', (e) => {
      this.model.photoScale = parseFloat(e.target.value);
      this.renderCallback();
    });

    this.resetPhotoBtn.addEventListener('click', () => {
      this.model.resetPhotoPosition();
      this.zoomSlider.value = 1;
      this.renderCallback();
    });

    // Canvas Mouse Panning
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      const rect = this.canvas.getBoundingClientRect();
      this.dragStart.x = e.clientX - rect.left - this.model.photoOffset.x;
      this.dragStart.y = e.clientY - rect.top - this.model.photoOffset.y;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const rect = this.canvas.getBoundingClientRect();
      this.model.photoOffset.x = e.clientX - rect.left - this.dragStart.x;
      this.model.photoOffset.y = e.clientY - rect.top - this.dragStart.y;
      this.renderCallback();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
  }

  handleFile(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        this.model.userImage = img;
        this.model.imageLoaded = true;
        this.model.resetPhotoPosition();
        this.zoomSlider.value = 1;
        this.renderCallback({ newPhotoUploaded: true });
        showToast('Photo uploaded & Random Frame assigned!');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
}
