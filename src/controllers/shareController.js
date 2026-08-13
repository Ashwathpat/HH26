import { showToast } from '../utils/toast.js';

/**
 * Exports the live ticket as a PNG and shares that exact file whenever the
 * browser exposes the native Web Share file API. Social-network web intents
 * cannot attach a local file, so they retain a download-plus-caption fallback.
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
    this.downloadBtn.addEventListener('click', async () => {
      await this.downloadPass();
    });

    this.copyCaptionBtn.addEventListener('click', async () => {
      const copied = await this.copyCaption();
      showToast(copied ? 'Caption copied to clipboard!' : 'Select and copy the caption to share it.');
    });

    this.shareXBtn.addEventListener('click', async () => {
      // Open X synchronously so mobile browsers do not treat it as a blocked popup.
      window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(this.getCaption())}`, '_blank', 'noopener,noreferrer');
      await this.downloadPass(false, false);
      showToast('X opened — attach your downloaded Beach Pass to the post.');
    });

    this.shareWhatsappBtn.addEventListener('click', async () => {
      const shared = await this.sharePassFile('Share your HHG26 Beach Pass');
      if (shared) return;

      await this.downloadPass(false, false);
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(this.getCaption())}`, '_blank', 'noopener,noreferrer');
      showToast('Pass downloaded — attach it in WhatsApp.');
    });

    this.shareInstaBtn.addEventListener('click', async () => {
      // Open Instagram immediately, then prepare the local pass image and caption.
      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
      await this.downloadPass(false, false);
      await this.copyCaption();
      this.instaModal.classList.remove('hidden');
    });

    this.closeModalBtn.addEventListener('click', () => {
      this.instaModal.classList.add('hidden');
    });

    this.openInstaBtn.addEventListener('click', () => {
      window.open('https://www.instagram.com', '_blank', 'noopener,noreferrer');
      this.instaModal.classList.add('hidden');
    });
  }

  getCaption() {
    return document.getElementById('captionBox').value;
  }

  getFileName() {
    return `HHG26_BEACH_PASS_${this.model.uniqueId}.png`;
  }

  getPassFile() {
    return new Promise((resolve, reject) => {
      this.canvasView.canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('The pass image could not be prepared.'));
          return;
        }
        resolve(new File([blob], this.getFileName(), { type: 'image/png' }));
      }, 'image/png');
    });
  }

  async downloadPass(notify = true, useNativeMobileShare = true) {
    try {
      const file = await this.getPassFile();
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const shareData = {
        files: [file],
        title: 'HHG26 Beach Pass',
        text: this.getCaption(),
      };

      // Mobile browsers cannot reliably force a file download. The native sheet
      // lets the participant save the PNG to Photos or Files without losing it.
      if (useNativeMobileShare && isMobile && navigator.share && navigator.canShare?.(shareData)) {
        try {
          await navigator.share(shareData);
          if (notify) showToast('Choose Save Image or Save to Files to keep your pass.');
          return true;
        } catch (error) {
          if (error?.name === 'AbortError') return false;
        }
      }

      const objectUrl = URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = file.name;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      if (notify) showToast('High-resolution Beach Pass downloaded!');
      return true;
    } catch (error) {
      showToast('Could not prepare the pass image. Please try again.');
      return false;
    }
  }

  async sharePassFile(title) {
    try {
      if (!navigator.share || !navigator.canShare) return false;
      const file = await this.getPassFile();
      const shareData = { files: [file], title, text: this.getCaption() };
      if (!navigator.canShare(shareData)) return false;
      await navigator.share(shareData);
      showToast('Pass image ready in your share sheet.');
      return true;
    } catch (error) {
      // Cancellation is an intentional choice, not a share error.
      if (error?.name !== 'AbortError') showToast('Direct sharing is unavailable here; using the download fallback.');
      return false;
    }
  }

  async copyCaption() {
    try {
      await navigator.clipboard.writeText(this.getCaption());
      return true;
    } catch {
      return false;
    }
  }
}
