const { execFileSync } = require('node:child_process');

function sourceCommit() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) return process.env.EAS_BUILD_GIT_COMMIT_HASH;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: __dirname, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return '';
  }
}

module.exports = ({ config }) => {
  const commit = sourceCommit();
  if (process.env.EAS_BUILD_PROFILE === 'avaliacao') {
    if (!/^https:\/\/[^\s]+$/.test(process.env.EXPO_PUBLIC_API_URL ?? '')) {
      throw new Error('Configure EXPO_PUBLIC_API_URL com a URL HTTPS do Azure no ambiente preview.');
    }
    if (!/^[a-f0-9]{40}$/i.test(commit)) {
      throw new Error('O APK de avaliação precisa do hash completo do commit.');
    }
  }
  return {
    ...config,
    name: 'Alerta Bairro',
    slug: 'alerta-bairro',
    version: '1.0.0',
    orientation: 'portrait',
    scheme: 'alertabairro',
    userInterfaceStyle: 'light',
    icon: './assets/images/icon.png',
    android: {
      package: 'br.com.alertabairro.app',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#101F35',
      },
    },
    ios: { bundleIdentifier: 'br.com.alertabairro.app' },
    web: { favicon: './assets/images/icon.png', output: 'single' },
    plugins: ['expo-router', 'expo-secure-store'],
    extra: { ...config.extra, commit },
  };
};
