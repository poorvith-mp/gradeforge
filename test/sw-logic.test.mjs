import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldBypassCache, isNavigationRequest, handleNavigation, handleStaleWhileRevalidate } from '../src/sw/strategies.ts';

test('shouldBypassCache returns true for cross-origin (e.g. fonts.gstatic.com)', () => {
  const selfOrigin = 'https://gradeforge.poorvithmp.com';
  const crossOriginUrl = new URL('https://fonts.gstatic.com/s/inter/v13/font.woff2');
  const sameOriginUrl = new URL('https://gradeforge.poorvithmp.com/assets/app.js');

  assert.equal(shouldBypassCache(crossOriginUrl, selfOrigin), true);
  assert.equal(shouldBypassCache(sameOriginUrl, selfOrigin), false);
});

test('isNavigationRequest detects document and navigation requests', () => {
  assert.equal(isNavigationRequest({ mode: 'navigate', destination: '' }), true);
  assert.equal(isNavigationRequest({ mode: 'cors', destination: 'document' }), true);
  assert.equal(isNavigationRequest({ mode: 'cors', destination: 'script' }), false);
});

test('handleNavigation falls back to cached canonical root when network returns 301', async () => {
  const canonicalHtml = '<html><body>Canonical GradeForge Calculator</body></html>';
  const mockCanonicalResponse = new Response(canonicalHtml, { status: 200 });

  const mockCache = {
    async match(req) {
      const url = typeof req === 'string' ? req : req.url;
      if (url === '/calculator') return mockCanonicalResponse;
      return undefined;
    },
    async put() {},
  };

  const mockFetch = async () => new Response(null, { status: 301, headers: { Location: '/somewhere-else' } });

  const request = { url: 'https://gradeforge.poorvithmp.com/calculator/subpath', mode: 'navigate', destination: 'document' };
  const response = await handleNavigation(request, '/calculator', {
    cache: mockCache,
    fetchFn: mockFetch,
  });

  assert.equal(response.status, 200);
  const text = await response.text();
  assert.equal(text, canonicalHtml);
});

test('handleStaleWhileRevalidate returns cached response and updates in background', async () => {
  let cachedPayload = 'cached-v1';
  let networkCalled = false;

  const mockCache = {
    async match() {
      return new Response(cachedPayload, { status: 200 });
    },
    async put(req, res) {
      cachedPayload = await res.text();
    },
  };

  const mockFetch = async () => {
    networkCalled = true;
    return new Response('network-v2', { status: 200 });
  };

  const request = new Request('https://gradeforge.poorvithmp.com/assets/bundle.js');
  const response = await handleStaleWhileRevalidate(request, {
    cache: mockCache,
    fetchFn: mockFetch,
  });

  assert.equal(await response.text(), 'cached-v1');
  // Allow network promise to resolve
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(networkCalled, true);
  assert.equal(cachedPayload, 'network-v2');
});
