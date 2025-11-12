export default function handler(req, res) {
  res.status(200).json({
    message: 'Hello from Mela Chain Frontend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
}
