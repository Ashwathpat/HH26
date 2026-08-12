import { IdCardController } from './controllers/idCardController.js';

document.addEventListener('DOMContentLoaded', () => {
  const app = new IdCardController();
  app.init();
});
