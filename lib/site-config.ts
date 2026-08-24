export const authSetupComplete = Boolean(process.env.DATABASE_URL && process.env.AUTH_SECRET);
export const googleAuthEnabled = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
);

export const footerProfile = {
  github: 'https://github.com/SWADHIN300',
  x: 'https://x.com/SWADHIN300',
  email: 'swadhinraha81@gmail.com',
};
