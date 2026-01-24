
export default async function handler(request, response) {
  const { ltuid_v2, ltoken_v2, endpoint, server, role_id } = request.query;
  
  if (!ltuid_v2 || !ltoken_v2) {
    return response.status(400).json({ retcode: -1, message: "Missing credentials" });
  }

  // Construct Cookie header
  const cookie = `ltuid_v2=${ltuid_v2}; ltoken_v2=${ltoken_v2}; ltuid=${ltuid_v2}; ltoken=${ltoken_v2};`;

  let url = '';
  let options = {
      headers: {
        'Cookie': cookie,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Referer': 'https://act.hoyolab.com/',
        'Origin': 'https://act.hoyolab.com',
        'x-rpc-language': 'en-us',
        'x-rpc-client_type': '5', // web
        'x-rpc-app_version': '1.5.0'
      }
  };
  
  // Route to specific endpoints based on 'endpoint' query param
  if (endpoint === 'achievements') {
      if (!server || !role_id) {
           return response.status(400).json({ retcode: -1, message: "Missing server or role_id for achievements" });
      }
      url = `https://ho-yo-lab-api-interface.vercel.app/api/achievement`;
      options.method = 'POST';
      options.headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify({ 
          role_id, 
          server,
          ltuid_v2,
          ltoken_v2
      });
  } else if (endpoint === 'character_detail') {
      if (!server || !role_id) {
           return response.status(400).json({ retcode: -1, message: "Missing server or role_id for character_detail" });
      }
      
      // Keep credentials in URL as requested, but also add to body as the error suggests they are needed there
      url = `https://ho-yo-lab-api-interface.vercel.app/api/character_detail?ltuid_v2=${encodeURIComponent(ltuid_v2)}&ltoken_v2=${encodeURIComponent(ltoken_v2)}&server=${encodeURIComponent(server)}&role_id=${encodeURIComponent(role_id)}&character_ids=`;
      
      options.method = 'POST';
      options.headers['Content-Type'] = 'application/json';
      
      // Safely parse body for character_ids from frontend
      let charIds = [];
      try {
        const bodyData = typeof request.body === 'string' ? JSON.parse(request.body) : request.body;
        charIds = bodyData?.character_ids || [];
      } catch (e) {
        console.warn("Failed to parse request body:", e);
      }

      // Include credentials in body to resolve "Missing required parameters" error from external API
      options.body = JSON.stringify({ 
          role_id: role_id, 
          server: server,
          character_ids: charIds,
          ltuid_v2: ltuid_v2,
          ltoken_v2: ltoken_v2
      });
  } else if (endpoint === 'spiral_abyss') {
      if (!server || !role_id) {
           return response.status(400).json({ retcode: -1, message: "Missing server or role_id for spiral_abyss" });
      }
      const schedule_type = request.query.schedule_type || '1'; 
      url = `https://ho-yo-lab-api-interface.vercel.app/api/spiral_abyss?server=${encodeURIComponent(server)}&role_id=${encodeURIComponent(role_id)}&schedule_type=${schedule_type}&ltuid_v2=${encodeURIComponent(ltuid_v2)}&ltoken_v2=${encodeURIComponent(ltoken_v2)}`;
      options.method = 'GET';
  } else if (endpoint === 'hard_challenge') {
      if (!server || !role_id) {
           return response.status(400).json({ retcode: -1, message: "Missing server or role_id for hard_challenge" });
      }
      url = `https://ho-yo-lab-api-interface.vercel.app/api/hard_challenge?server=${encodeURIComponent(server)}&role_id=${encodeURIComponent(role_id)}&ltuid_v2=${encodeURIComponent(ltuid_v2)}&ltoken_v2=${encodeURIComponent(ltoken_v2)}&need_detail=true`;
      options.method = 'GET';
  } else if (endpoint === 'details') {
      if (!server || !role_id) {
           return response.status(400).json({ retcode: -1, message: "Missing server or role_id for details" });
      }
      url = `https://ho-yo-lab-api-interface.vercel.app/api/genshin?server=${encodeURIComponent(server)}&role_id=${encodeURIComponent(role_id)}&ltuid_v2=${encodeURIComponent(ltuid_v2)}&ltoken_v2=${encodeURIComponent(ltoken_v2)}`;
      options.method = 'GET';
  } else {
      // Account Discovery API
      url = `https://ho-yo-lab-api-interface.vercel.app/api/game_record?ltuid_v2=${encodeURIComponent(ltuid_v2)}&ltoken_v2=${encodeURIComponent(ltoken_v2)}`;
      options.method = 'GET';
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    
    // Set CORS headers
    response.setHeader('Access-Control-Allow-Credentials', true);
    response.setHeader('Access-Control-Allow-Origin', '*');
    
    response.status(200).json(data);
  } catch (error) {
    console.error("Proxy fetch error:", error);
    response.status(500).json({ retcode: -1, message: "Proxy error: " + error.message });
  }
}
