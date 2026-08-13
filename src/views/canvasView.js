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

    const photoBox = { x: 882, y: 20, width: 270, height: 264 };
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
    const mint = '#b0f4d6';
    const blue = '#69b5f7';
    const ink = '#050505';

    // Exact ticket coordinates supplied for the three credential labels.
    const fields = [
      { value: model.fullName || 'NAME', x: 921, y: 306, width: 189, height: 28 },
      { value: model.roleTitle || 'ROLE', x: 918, y: 358, width: 195, height: 35 },
      { value: model.orgName || 'TEAM', x: 920, y: 417, width: 191, height: 32 },
    ];

    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    fields.forEach((field) => {
      ctx.fillStyle = mint;
      ctx.fillRect(field.x, field.y, field.width, field.height);
      ctx.fillStyle = ink;
      this.drawAdaptiveText(ctx, field.value, field.width - 10, field.x + field.width / 2, field.y + field.height / 2 + 1);
    });

    // Exact Builder ID coordinates supplied for the text below the barcode.
    const builderId = (model.uniqueId || 'HHG26-0000').replace('ID-', '');
    ctx.fillStyle = blue;
    ctx.fillRect(1032, 695, 126, 19);
    ctx.fillStyle = ink;
    ctx.font = '700 11px "Press Start 2P", monospace';
    ctx.fillText(this.fitText(ctx, builderId, 118), 1095, 705);
    ctx.restore();
  }

  drawAdaptiveText(ctx, text, maxWidth, x, y) {
    const value = String(text || '').toUpperCase();
    let fontSize = 14;

    while (fontSize > 6) {
      ctx.font = `700 ${fontSize}px "Press Start 2P", monospace`;
      if (ctx.measureText(value).width <= maxWidth) {
        ctx.fillText(value, x, y);
        return;
      }
      fontSize -= 1;
    }

    ctx.font = '700 6px "Press Start 2P", monospace';
    let output = value;
    while (ctx.measureText(output).width > maxWidth && output.length > 4) {
      output = `${output.slice(0, -1)}…`;
    }
    ctx.fillText(output, x, y);
  }

  fitText(ctx, text, maxWidth) {
    let output = text;
    while (ctx.measureText(output).width > maxWidth && output.length > 4) {
      output = `${output.slice(0, -5)}…`;
    }
    return output;
  }
}
