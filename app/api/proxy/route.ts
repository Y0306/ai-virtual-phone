import { NextResponse } from 'next/server';

// 处理浏览器的跨域预检请求 (OPTIONS)
export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  });
}

export async function POST(req: Request) {
  try {
    // 获取前端发来的数据
    const body = await req.json();
    const authHeader = req.headers.get('Authorization');

    // 伪装浏览器，防止被 API 站点拦截
    const headers = new Headers();
    if (authHeader) headers.set('Authorization', authHeader);
    headers.set('Content-Type', 'application/json');
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // 从 Netlify 服务器直接请求你的真实 API（完全没有跨域烦恼！）
    const response = await fetch('https://api.astroflowing.com/v1/images/generations', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    // 把结果返回给前端，并加上跨域允许
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}
