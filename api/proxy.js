export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { app_id, entry_id } = req.body || {};

  if (!app_id || !entry_id) {
    return res.status(400).json({ error: "缺少 app_id 或 entry_id" });
  }

  const jiandaoyunUrl = `https://api.jiandaoyun.com/api/v5/app/entry/data/list`;

  try {
    const response = await fetch(jiandaoyunUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer agNBXmoph1oimHnUFMmQmhQ4xEhYOeYK7D8083eBfA5C302Aa038fDdCd5642Ab8'
      },
      body: JSON.stringify({
        app_id: app_id,      // 使用 snake_case
        entry_id: entry_id,  // 使用 snake_case
        limit: 1             // 官方支持的参数
      })
    });

    const data = await response.json();

    // 把简道云的真实返回（无论成功还是失败）都透传给前端
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ 
      error: 'fetch failed', 
      message: error.message 
    });
  }
}
