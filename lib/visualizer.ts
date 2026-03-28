// lib/visualizer.ts
export const vizHeaders = () => {
  const auth = Buffer.from(
    `${process.env.VISUALIZER_EMAIL}:${process.env.VISUALIZER_PASSWORD}`
  ).toString("base64");
  return { Authorization: `Basic ${auth}` };
};