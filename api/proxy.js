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

  // v5 查询多条数据接口（获取最新1条）
  const jiandaoyunUrl = `https://api.jiandaoyun.com/api/v5/app/entry/data/list`;

  try {
    const response = await fetch(jiandaoyunUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        app_id: app_id,
        entry_id: entry_id,
        limit: 1                    // 只取最新1条
        // orderBy: "createTime desc" // v5 目前不支持此参数，如需严格最新可后续加 filter
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
