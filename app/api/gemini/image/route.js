export async function POST(request) {
  try {
    const { prompt, aspectRatio = "1:1", numberOfImages = 1 } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing prompt' }), { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'Server misconfigured: missing GEMINI_API_KEY' }), { status: 500 });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${apiKey}`;
    const body = {
      prompt,
      numberOfImages,
      aspectRatio,
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: 'Imagen request failed', detail: err }), { status: 502 });
    }

    const data = await res.json();
    // Try common shapes; return normalized base64 array
    let images = [];
    if (data?.images?.length) {
      images = data.images.map(i => (i?.imageBytes || i?.base64) ?? null).filter(Boolean);
    } else if (data?.generatedImages?.length) {
      images = data.generatedImages.map(g => g?.image?.imageBytes ?? null).filter(Boolean);
    } else if (data?.candidates?.length) {
      images = data.candidates.flatMap(c => c?.content?.parts?.map(p => p?.inline_data?.data).filter(Boolean) ?? []);
    }

    return new Response(JSON.stringify({ images }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Unexpected error', detail: String(e) }), { status: 500 });
  }
}


