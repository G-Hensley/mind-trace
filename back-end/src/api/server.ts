import { createApp } from './app';
import { config } from '@/config/env';

const app = createApp();
const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
