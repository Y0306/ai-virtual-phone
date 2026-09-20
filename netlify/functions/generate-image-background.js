export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: '只支持POST请求' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { prompt, size = '1024x1024', n = 1, ...rest } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: '缺少prompt参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const apiResponse = await fetch(process.env.GPT_IMAGE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GPT_API_KEY}`
      },
      body: JSON.stringify({ prompt, size, n, ...rest })
    });

    const data = await apiResponse.json();

    return new Response(JSON.stringify(data), {
      status: apiResponse.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });

  } catch (error) {
    console.error('生图API调用失败:', error);
    return new Response(
      JSON.stringify({ error: '服务器内部错误', detail: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const config = {
  background: true
};
