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

  isHeicFile(file) {
    const name = (file.name || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    return (
      type === 'image/heic' ||
      type === 'image/heif' ||
      name.endsWith('.heic') ||
      name.endsWith('.heif')
    );
  }

  async handleFile(file) {
    const isHeic = this.isHeicFile(file);

    if (!isHeic && !file.type.startsWith('image/')) {
      showToast('Please upload a valid image file.');
      return;
    }

    let fileToRead = file;

    if (isHeic) {
      if (typeof heic2any === 'undefined') {
        showToast('HEIC support failed to load. Please try again or use JPG/PNG.');
        return;
      }
      showToast('Converting HEIC photo, please wait...');
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
          quality: 0.92,
        });
        fileToRead = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      } catch (err) {
        console.error('HEIC conversion failed:', err);
        showToast('Could not convert this HEIC photo. Please try another file.');
        return;
      }
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
      img.onerror = () => {
        showToast('Failed to load this image. Please try another file.');
      };
      img.src = event.target.result;
    };
    reader.onerror = () => {
      showToast('Failed to read this file. Please try another file.');
    };
    reader.readAsDataURL(fileToRead);
  }
}