// lib/visualizer.ts
export const vizBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_VISUALIZER_URL || process.env.VISUALIZER_URL || 'http://localhost:3001';
  return url.replace(/\/$/, ''); // Remove trailing slash
};

export const vizHeaders = () => {
  const auth = Buffer.from(
    `${process.env.VISUALIZER_EMAIL}:${process.env.VISUALIZER_PASSWORD}`
  ).toString("base64");
  return { Authorization: `Basic ${auth}` };
};