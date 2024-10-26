/** @type {import('next').NextConfig} */
const nextConfig = {
  // リクエストパスが「/」の場合、「/login」にリダイレクトさせる
  async redirects() {
    return [
      {
        // リクエストのパスパターン
        source: "/",
        // リダイレクト先
        destination: "/login",
        // true : リダイレクトをキャッシュする（ステータスコード:308）
        // false: リダイレクトをキャッシュしない（ステータスコード:307）
        permanent: false,
      },
    ];
  },
  reactStrictMode: false,
}

module.exports = nextConfig
