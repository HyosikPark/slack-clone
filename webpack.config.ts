import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: webpack.Configuration = {
  name: 'sleact', // 웹팩 설정 이름
  mode: isDevelopment ? 'development' : 'production', // 개발, 배포 모드
  devtool: isDevelopment ? 'inline-source-map' : 'hidden-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // babel이 처리할 확장자 목록
    alias: {
      // ../../ 없애고 절대 경로화 해주는 것
      // tsconfig, webpack 둘다 해주는 이유 : 소스코드 검사기는 tsconfig를 참고하고,
      // js 번들링은 webpack을 참고하기 때문
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client', // 모듈 시작 파일
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader', // 웹팩이 js 파일들에 대해 babel을 실행하도록 만들어줌.
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['last 2 chrome versions'] },
                debug: isDevelopment,
              },
            ],
            '@babel/preset-react',
            '@babel/preset-typescript',
            '@emotion/babel-preset-css-prop',
          ],
          env: {
            development: {
              plugins: [require.resolve('react-refresh/babel')],
            },
            production: {},
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        test: /\.css?$/,
        // css-loader: css를 js파일로 변환, style-loader: js로 변환된 css를 style 태그로 만들어 head에 추가
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      // typescript 체킹, webpack 동시 구동
      async: false,
      // eslint: {
      //   files: './src/**/*',
      // },
    }),
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }), // process.env, node_env를 front에서도 접근 가능하게 해줌.
  ],
  output: {
    // 결과물 경로
    path: path.join(__dirname, 'dist'),
    filename: '[name].js', // [name]은 entry파일 이름으로 설정됨. [chunkHash] 변경되지 않은 파일은 캐싱된 값 사용
    publicPath: '/dist/',
  },
  devServer: {
    // webpack-dev-server 설정
    historyApiFallback: true, // react-router에 필요한 설정
    port: 3090, // port
    publicPath: '/dist/', // script src 파일 경로
    proxy: {
      // cors 해결
      '/api/': {
        target: 'http://localhost:3095',
        changeOrigin: true,
        // ws: true,
      },
    },
  },
};

if (isDevelopment && config.plugins) {
  // 개발환경 플러그인
  // hotreload에 필요
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin());
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }));
}
if (!isDevelopment && config.plugins) {
  // 배포환경 플러그인
  config.plugins.push(new webpack.LoaderOptionsPlugin({ minimize: true }));
  // config.plugins.push(new BundleAnalyzerPlugin({ analyzerMode: 'static' }));
}

export default config;
