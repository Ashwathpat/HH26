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
    this.frameImage.src = '/assets/frames/hhg26-final-ticket.webp';
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

    const photoBox = { x: 888, y: 27, width: 255, height: 250 };
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
    const panelX = 856;
    const valueWidth = 307;
    const mint = '#b6e9d7';
    const blue = '#69b5f7';
    const ink = '#050505';

    const fields = [
      { value: model.fullName || 'NAME', y: 326 },
      { value: model.roleTitle || 'ROLE', y: 389 },
      { value: model.orgName || 'TEAM', y: 452 },
    ];

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    fields.forEach((field) => {
      // Cover only the original placeholder lettering, keeping the ticket-slot outlines intact.
      ctx.fillStyle = mint;
      ctx.fillRect(panelX, field.y - 18, valueWidth, 36);
      ctx.fillStyle = ink;
      ctx.font = '700 12px "Press Start 2P", monospace';
      ctx.fillText(this.fitText(ctx, field.value.toUpperCase(), valueWidth - 22), panelX + valueWidth / 2, field.y + 1);
    });

    // The final ticket template reserves this exact zone below the barcode for a unique Builder ID.
    ctx.fillStyle = blue;
    ctx.fillRect(855, 704, 310, 46);
    ctx.fillStyle = ink;
    ctx.font = '700 10px "Press Start 2P", monospace';
    ctx.fillText(`BUILDER ID: ${(model.uniqueId || 'HHG26-0000').replace('ID-', '')}`, 1010, 725);
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
