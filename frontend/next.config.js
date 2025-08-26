const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.moneymaher.in';
module.exports = {
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${API_BASE}/api/:path*` }];
  }
};
