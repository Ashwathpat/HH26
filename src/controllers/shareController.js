import { showToast } from '../utils/toast.js';

/**
 * Share Controller - High-Res PNG download & instant X.com/WhatsApp/Instagram social triggers
 */
export class ShareController {
  constructor(model, canvasView, uiView) {
    this.model = model;
    this.canvasView = canvasView;
    this.uiView = uiView;

    this.downloadBtn = document.getElementById('downloadBtn');
    this.copyCaptionBtn = document.getElementById('copyCaptionBtn');
    this.shareXBtn = document.getElementById('shareXBtn');
    this.shareWhatsappBtn = document.getElementById('shareWhatsappBtn');
    this.shareInstaBtn = document.getElementById('shareInstaBtn');

    this.instaModal = document.getElementById('instaModal');
    this.closeModalBtn = document.getElementById('closeModalBtn');
    this.openInstaBtn = document.getElementById('openInstaBtn');

    this.initEvents();
  }

  initEvents() {
    // Download PNG Action
    this.downloadBtn.addEventListener('click', () => {
      const imageURI = this.canvasView.canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ID_CARD_${this.model.uniqueId}.png`;
      link.href = imageURI;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('High-Resolution ID Card downloaded!');
    });

    // Copy Caption Action
    this.copyCaptionBtn.addEventListener('click', () => {
      const captionText = document.getElementById('captionBox').value;
      navigator.clipboard.writeText(captionText);
      showToast('Caption copied to clipboard!');
    });

    // Instant Share to X.com (Twitter)
    this.shareXBtn.addEventListener('click', () => {
      const captionText = document.getElementById('captionBox').value;
      navigator.clipboard.writeText(captionText);

      const encodedText = encodeURIComponent(captionText);
      const intentUrl = `https://x.com/intent/tweet?text=${encodedText}`;

      window.open(intentUrl, '_blank', 'width=600,height=500');
      showToast('Opening X.com with auto-generated caption!');
    });

    // Share to WhatsApp
    this.shareWhatsappBtn.addEventListener('click', () => {
      const captionText = document.getElementById('captionBox').value;
      const encodedText = encodeURIComponent(captionText);
      const waUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
      window.open(waUrl, '_blank');
    });

    // Share to Instagram (Modal Helper)
    this.shareInstaBtn.addEventListener('click', () => {
      const captionText = document.getElementById('captionBox').value;
      navigator.clipboard.writeText(captionText);
      this.instaModal.classList.remove('hidden');
    });

    this.closeModalBtn.addEventListener('click', () => {
      this.instaModal.classList.add('hidden');
    });

    this.openInstaBtn.addEventListener('click', () => {
      window.open('https://www.instagram.com', '_blank');
      this.instaModal.classList.add('hidden');
    });
  }
}
