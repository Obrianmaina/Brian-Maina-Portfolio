import { ImageResponse } from 'next/og';

// This tells Next.js to run this function on the Edge network for ultra-fast generation
export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Grab the title from the URL, or use a default fallback
    const title = searchParams.get('title') || 'Design & Technology Blog';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            backgroundColor: '#030712', // Matches your dark theme
            padding: '80px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Your Branding */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
            <div style={{ color: '#14b8a6', fontSize: 32, fontWeight: 'bold' }}>
              Brian Maina Nyawira
            </div>
            <div style={{ color: '#6b7280', fontSize: 32, marginLeft: '16px' }}>
              | Visual Designer
            </div>
          </div>

          {/* Dynamic Article Title */}
          <div
            style={{
              color: 'white',
              fontSize: 72,
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '20px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    if (e instanceof Error) {
      console.error(e.message);
    } else {
      console.error(e);
    }
    return new Response('Failed to generate image', { status: 500 });
  }
}