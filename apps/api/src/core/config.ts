export const config = () => ({
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  SENDBIRD_APPID: process.env.SENDBIRD_APPID,
});
