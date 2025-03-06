/* eslint-disable @next/next/no-sync-scripts */
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    const { locale } = this.props["__NEXT_DATA__"].props.pageProps

    return (
      <Html lang={locale}>
        <Head>
          <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover" />
          <meta key="application-name" name="application-name" content="Brume" />
          <meta key="description" name="description" content="Technologies to hide yourself in plain sight" />
          <meta key="color-scheme" name="color-scheme" content="dark light" />
          <meta key="theme-color-light" name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
          <meta key="theme-color-dark" name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
          <meta key="mobile-web-app-capable" name="mobile-web-app-capable" content="yes" />
          <meta key="apple-mobile-web-app-title" name="apple-mobile-web-app-title" content="Brume" />
          <meta key="apple-mobile-web-app-status-bar-style" name="apple-mobile-web-app-status-bar-style" content="white" />
          <meta key="referrer" name="referrer" content="no-referrer" />
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="apple-touch-icon" href="/appicon.png" />
        </Head>
        <body className="antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument