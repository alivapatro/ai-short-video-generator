// drizzle.config.js
/** @type { import("drizzle-kit").Config } */
module.exports = {
  schema: "./src/configs/schema.js",
  dialect: 'postgresql',
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_NerSsZ6fJQI5@ep-lively-band-a8na00c2-pooler.eastus2.azure.neon.tech/ai-short-video-generator?sslmode=require',
  },
};
