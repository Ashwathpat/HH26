/**
 * Canvas View - Renders the single canonical HHG26 beach-arcade pass.
 */
export class CanvasView {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.width = 1200;
    this.height = 750;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.frameImage = new Image();
    this.frameImage.onload = () => {
      this.frameLoaded = true;
      if (this.lastRender) this.render(this.lastRender.model, this.lastRender.frameModel);
    };
    this.frameImage.src = '/assets/frames/hhg26-beach-pass.png';
    this.frameLoaded = false;
  }

  render(model, frameModel) {
    this.lastRender = { model, frameModel };
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    if (this.frameLoaded) {
      ctx.drawImage(this.frameImage, 0, 0, this.width, this.height);
    } else {
      ctx.fillStyle = '#9be5d4';
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.fillStyle = '#4da2ff';
      ctx.fillRect(0, 560, this.width, 190);
    }

    this.drawPhoto(ctx, model);
    this.drawDetails(ctx, model);
  }

  drawPhoto(ctx, model) {
    if (!model.imageLoaded || !model.userImage.complete) return;

    const photoBox = { x: 905, y: 40, width: 248, height: 205 };
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 22);
    ctx.clip();

    const img = model.userImage;
    const imgAspect = img.width / img.height;
    const boxAspect = photoBox.width / photoBox.height;
    let drawW;
    let drawH;
    if (imgAspect > boxAspect) {
      drawH = photoBox.height * model.photoScale;
      drawW = drawH * imgAspect;
    } else {
      drawW = photoBox.width * model.photoScale;
      drawH = drawW / imgAspect;
    }
    const drawX = photoBox.x + (photoBox.width - drawW) / 2 + model.photoOffset.x;
    const drawY = photoBox.y + (photoBox.height - drawH) / 2 + model.photoOffset.y;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(photoBox.x, photoBox.y, photoBox.width, photoBox.height, 22);
    ctx.stroke();
  }

  drawDetails(ctx, model) {
    const panelX = 918;
    const valueX = 940;
    const valueWidth = 220;
    const mint = '#a8e7d5';
    const ink = '#050505';

    const fields = [
      { value: model.fullName || 'YOUR NAME', y: 315 },
      { value: model.orgName || 'TEAM NAME', y: 365 },
      { value: model.issueDate || 'DD/MM/YYYY', y: 418 },
      { value: model.uniqueId || 'BUILDER ID', y: 470 },
    ];

    ctx.save();
    ctx.font = '700 16px "Press Start 2P", monospace';
    ctx.textBaseline = 'middle';
    fields.forEach((field) => {
      ctx.fillStyle = mint;
      ctx.fillRect(panelX, field.y - 14, valueWidth, 29);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(panelX, field.y - 14, valueWidth, 29);
      ctx.fillStyle = ink;
      ctx.font = '700 13px "Press Start 2P", monospace';
      ctx.fillText(this.fitText(ctx, field.value.toUpperCase(), valueWidth - 14), valueX, field.y + 1);
    });

    ctx.fillStyle = '#4da2ff';
    ctx.fillRect(905, 665, 250, 20);
    ctx.fillStyle = ink;
    ctx.font = '700 12px "Space Grotesk", sans-serif';
    ctx.fillText('HHG26 / BEACH PASS', 922, 679);
    ctx.restore();
  }

  fitText(ctx, text, maxWidth) {
    let output = text;
    while (ctx.measureText(output).width > maxWidth && output.length > 4) {
      output = `${output.slice(0, -5)}…`;
    }
    return output;
  }
}
