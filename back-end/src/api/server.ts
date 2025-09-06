import { createApp } from './app';
import { config } from '@/config/env';

const app = createApp();
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  setTimeout(() => {
    fetch(`http://localhost:${PORT}/health`)
      .then(res => {
        if (res.ok) {
          console.log('✅ Health check passed');
        } else {
          console.error('❌ Health check failed');
        }
      })
      .catch(err => {
        console.error('❌ Health check error:', err);
      });
  }, 200);
});
