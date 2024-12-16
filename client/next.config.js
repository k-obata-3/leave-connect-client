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
  // webpack: (config, {isServer}) => {
    // config.externals = [...config.externals, 'bcrypt'];
    // if (!isServer) {
    //   config.resolve.fallback.fs = false;
    //   config.resolve.fallback.child_process = false;
    //   config.resolve.fallback.net = false;
    //   config.resolve.fallback.dns = false;
    //   config.resolve.fallback.tls = false;
    // }
    // return config;
  // },
}

module.exports = nextConfig
