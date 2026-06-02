export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { appId, entryId, app_id, entry_id } = req.body || {};
  const finalAppId = appId || app_id;
  const finalEntryId = entryId || entry_id;

  if (!finalAppId || !finalEntryId) {
    return res.status(400).json({ error: "缺少 appId 或 entryId" });
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
        appId: finalAppId,
        entryId: finalEntryId,
        limit: 1,
        pageSize: 1
      })
    });

    // 关键：无论简道云返回什么状态，都尝试解析 JSON
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // 把简道云的真实错误返回给前端
      return res.status(response.status).json({
        error: 'JianDaoyun error',
        status: response.status,
        data: data
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy fetch error:', error);
    res.status(500).json({ 
      error: 'fetch failed', 
      message: error.message,
      stack: error.stack 
    });
  }
}
