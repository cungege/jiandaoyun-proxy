export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};
  const { action = "get_data", app_id, entry_id, data_list, limit } = body;

  // ==================== 写入功能 ====================
  if (action === "save_plan") {
    if (!data_list || !Array.isArray(data_list)) {
      return res.status(400).json({ error: "data_list 格式错误" });
    }

    const results = [];
    for (const item of data_list) {
      try {
        const createRes = await fetch(`https://api.jiandaoyun.com/api/v5/app/entry/data/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer agNBXmoph1oimHnUFMmQmhQ4xEhYOeYK7D8083eBfA5C302Aa038fDdCd5642Ab8'
          },
          body: JSON.stringify({
            app_id: item.app_id,
            entry_id: item.entry_id,
            data: item.data
          })
        });
        const createData = await createRes.json();
        results.push(createData);
      } catch (err) {
        results.push({ error: err.message });
      }
    }
    return res.status(200).json({ success: true, results });
  }

  // ==================== 读取功能（获取安装地点） ====================
  if (!app_id || !entry_id) {
    return res.status(400).json({ error: "缺少 app_id 或 entry_id" });
  }

  try {
    const jiandaoyunUrl = `https://api.jiandaoyun.com/api/v5/app/entry/data/list`;

    const response = await fetch(jiandaoyunUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer agNBXmoph1oimHnUFMmQmhQ4xEhYOeYK7D8083eBfA5C302Aa038fDdCd5642Ab8'
      },
      body: JSON.stringify({
        app_id: app_id,
        entry_id: entry_id,
        limit: limit || 1
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('JianDaoyun 返回错误:', data);
      return res.status(response.status).json({ 
        error: '简道云接口调用失败', 
        details: data 
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy 内部错误:', error);
    res.status(500).json({ 
      error: 'Proxy 内部错误', 
      message: error.message 
    });
  }
}
