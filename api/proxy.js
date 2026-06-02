export default async function handler(req, res) {
  // 允许跨域（解决 GitHub Pages 的 CORS 问题）
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理浏览器预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 简道云 v2 接口地址
  const jiandaoyunUrl = `https://api.jiandaoyun.com/api/v2/app/${req.body.app_id}/entry/${req.body.entry_id}/widgets`;

  try {
    const response = await fetch(jiandaoyunUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 如果以后需要 Authorization，可以在这里添加
        // 'Authorization': 'Bearer xxxxxx'
      },
      body: JSON.stringify({})   // 这个接口目前不需要传 body
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
