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
    this.photoBox = { x: 882, y: 20, width: 270, height: 264 };

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

    // Canvas pointer panning: works for mouse, touch, and pen input.
    this.canvas.style.touchAction = 'none';
    this.canvas.addEventListener('pointerdown', (e) => {
      const point = this.getCanvasPoint(e);
      if (!this.isInsidePhotoBox(point)) return;

      e.preventDefault();
      this.isDragging = true;
      this.canvas.setPointerCapture?.(e.pointerId);
      this.dragStart.x = point.x - this.model.photoOffset.x;
      this.dragStart.y = point.y - this.model.photoOffset.y;
    });

    this.canvas.addEventListener('pointermove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const point = this.getCanvasPoint(e);
      this.model.photoOffset.x = point.x - this.dragStart.x;
      this.model.photoOffset.y = point.y - this.dragStart.y;
      this.renderCallback();
    });

    const stopDragging = (e) => {
      this.isDragging = false;
      if (e?.pointerId !== undefined) this.canvas.releasePointerCapture?.(e.pointerId);
    };
    this.canvas.addEventListener('pointerup', stopDragging);
    this.canvas.addEventListener('pointercancel', stopDragging);
    this.canvas.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') stopDragging(e);
    });
  }

  getCanvasPoint(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
      y: (e.clientY - rect.top) * (this.canvas.height / rect.height),
    };
  }

  isInsidePhotoBox(point) {
    return (
      point.x >= this.photoBox.x &&
      point.x <= this.photoBox.x + this.photoBox.width &&
      point.y >= this.photoBox.y &&
      point.y <= this.photoBox.y + this.photoBox.height
    );
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
        showToast('Photo uploaded to the HHG26 Beach Pass!');
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