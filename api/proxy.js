export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const body = req.body || {};
  const { action = "get_data", app_id, entry_id, data_list } = body;

  // 写入功能
  if (action === "save_plan") {
    if (!data_list || !Array.isArray(data_list) || data_list.length === 0) {
      return res.status(400).json({ error: "data_list 不能为空" });
    }

    const results = [];

    for (const item of data_list) {
      try {
        const createUrl = `https://api.jiandaoyun.com/api/v5/app/entry/data/create`;

        const createRes = await fetch(createUrl, {
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

  // 读取功能
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
        app_id: app_id,
        entry_id: entry_id,
        limit: 1
      })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: 'fetch failed', message: error.message });
  }
}
