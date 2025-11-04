import { useEffect, useState } from 'react';
import { checkHealth, pdfAPI, imageAPI } from '../services/api';

function ApiTest() {
  const [health, setHealth] = useState<any>(null);
  const [pdfTools, setPdfTools] = useState<any[]>([]);
  const [imgTools, setImgTools] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testAPI() {
      try {
        // Test health check
        const healthData = await checkHealth();
        setHealth(healthData);

        // Test PDF tools endpoint
        const pdfToolsData = await pdfAPI.getTools();
        setPdfTools(pdfToolsData);

        // Test Image tools endpoint
        const imgToolsData = await imageAPI.getTools();
        setImgTools(imgToolsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>API Connection Test</h1>
      
      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#fee' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <h2>Health Check</h2>
        <pre>{JSON.stringify(health, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>PDF Tools ({pdfTools.length})</h2>
        <pre>{JSON.stringify(pdfTools, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h2>Image Tools ({imgTools.length})</h2>
        <pre>{JSON.stringify(imgTools, null, 2)}</pre>
      </div>
    </div>
  );
}

export default ApiTest;
