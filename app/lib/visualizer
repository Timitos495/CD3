// lib/visualizer.ts

export const vizHeaders = () => {
  const auth = Buffer.from(
    `${process.env.VISUALIZER_EMAIL}:${process.env.VISUALIZER_PASSWORD}`
  ).toString("base64");
  return { Authorization: `Basic ${auth}` };
};

// Credentials embedded in URL — more reliable on some hosting providers
export const vizBaseUrl = () => {
  const email = encodeURIComponent(process.env.VISUALIZER_EMAIL!);
  const password = encodeURIComponent(process.env.VISUALIZER_PASSWORD!);
  return `https://${email}:${password}@visualizer.coffee/api`;
};
