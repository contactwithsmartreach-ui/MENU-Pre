import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = "L'Aura Sahara - Menu Gastronomique 3D Interactif";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0a0504 0%, #1a0d0a 50%, #050302 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
          padding: '60px',
        }}
      >
        {/* Glow circles */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '450px',
            height: '450px',
            borderRadius: '9999px',
            background: 'rgba(234, 88, 12, 0.25)',
            filter: 'blur(80px)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.2)',
            filter: 'blur(90px)',
            display: 'flex',
          }}
        />

        {/* Content container */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          {/* Left Column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '650px',
            }}
          >
            {/* Tag badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(249, 115, 22, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.5)',
                padding: '8px 18px',
                borderRadius: '9999px',
                width: 'fit-content',
                marginBottom: '20px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  background: '#f97316',
                  display: 'flex',
                }}
              />
              <span
                style={{
                  color: '#fed7aa',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '3px',
                }}
              >
                MENU 3D INTERACTIF
              </span>
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: '62px',
                fontWeight: '900',
                lineHeight: 1.1,
                margin: '0 0 16px 0',
                letterSpacing: '2px',
                backgroundImage: 'linear-gradient(to right, #ef4444, #f97316, #fbbf24)',
                backgroundClip: 'text',
                color: 'transparent',
                display: 'flex',
              }}
            >
              L&apos;AURA SAHARA
            </h1>

            <p
              style={{
                fontSize: '20px',
                color: '#fecdd3',
                margin: '0 0 24px 0',
                fontWeight: 300,
                letterSpacing: '1px',
                display: 'flex',
              }}
            >
              Gastronomie &bull; Pizzas &bull; Burgers &bull; Tacos &bull; Cocktails
            </p>

            <p
              style={{
                fontSize: '16px',
                color: '#9ca3af',
                margin: '0 0 32px 0',
                lineHeight: 1.5,
                display: 'flex',
              }}
            >
              Explorez nos créations d&apos;exception à travers un menu cylindre 3D inédit. Commandes express et saveurs raffinées.
            </p>

            {/* Bottom pills */}
            <div
              style={{
                display: 'flex',
                gap: '16px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  padding: '12px 20px',
                  borderRadius: '16px',
                }}
              >
                <span style={{ color: '#fbbf24', fontSize: '18px', fontWeight: 'bold' }}>★ 4.9 / 5</span>
                <span style={{ color: '#9ca3af', fontSize: '11px', marginTop: '4px' }}>Avis Gourmets</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  padding: '12px 20px',
                  borderRadius: '16px',
                }}
              >
                <span style={{ color: '#4ade80', fontSize: '15px', fontWeight: 'bold' }}>📞 0659 24 26 30</span>
                <span style={{ color: '#86efac', fontSize: '11px', marginTop: '4px' }}>Ligne de Commande</span>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Card Preview */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '280px',
              height: '390px',
              background: 'linear-gradient(180deg, rgba(30,16,13,0.95) 0%, rgba(10,5,4,0.98) 100%)',
              border: '2px solid rgba(249, 115, 22, 0.6)',
              borderRadius: '28px',
              padding: '24px',
              boxShadow: '0 25px 50px rgba(249, 115, 22, 0.3)',
              position: 'relative',
            }}
          >
            {/* Top Badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  background: 'linear-gradient(to right, #ef4444, #f97316)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                }}
              >
                ★ SIGNATURE
              </div>
              <span style={{ color: '#fbbf24', fontSize: '12px', fontWeight: 'bold' }}>★ 4.9</span>
            </div>

            {/* Simulated Dish Image Box */}
            <div
              style={{
                width: '100%',
                height: '180px',
                background: '#2a140f',
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '60px',
                marginBottom: '20px',
                border: '1px solid rgba(249,115,22,0.3)',
              }}
            >
              🍕
            </div>

            {/* Dish Title */}
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px', display: 'flex' }}>
              Pizza Pepperoni Suprême
            </div>
            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '16px', display: 'flex' }}>
              Cuite au feu de bois &bull; Mozzarella
            </div>

            {/* Price & Action */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(249,115,22,0.25)',
                paddingTop: '14px',
                marginTop: 'auto',
              }}
            >
              <span style={{ fontSize: '22px', fontWeight: '900', color: '#f97316', display: 'flex' }}>700 DA</span>
              <div
                style={{
                  background: 'linear-gradient(to right, #16a34a, #10b981)',
                  color: 'white',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '8px 14px',
                  borderRadius: '9999px',
                }}
              >
                COMMANDER
              </div>
            </div>
          </div>
        </div>

        {/* Footer domain text */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '3px',
            display: 'flex',
          }}
        >
          L&apos;AURA SAHARA &bull; EXPÉRIENCE GASTRONOMIQUE 3D IMMERSIVE
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}