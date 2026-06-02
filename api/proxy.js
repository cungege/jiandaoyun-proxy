export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 从前端拿到 app_id 和 entry_id，拼成完整地址
  const { app_id, entry_id } = req.body;

  if (!app_id || !entry_id) {
    return res.status(400).json({ error: "app_id 和 entry_id 不能为空" });
  }

  const jiandaoyunUrl = `https://api.jiandaoyun.com/api/v2/app/${app_id}/entry/${entry_id}/widgets`;

  try {
    const response = await fetch(jiandaoyunUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // 这个接口目前不需要 Authorization
      },
      body: JSON.stringify({})   // 关键：传空对象
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
