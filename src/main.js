import { IdCardController } from './controllers/idCardController.js';
import { initMarquee } from './marquee.js';

document.addEventListener('DOMContentLoaded', () => {
  initMarquee();
  const app = new IdCardController();
  app.init();
});
