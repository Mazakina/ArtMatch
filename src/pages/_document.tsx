import { Html, Head, Main, NextScript} from 'next/document'
import Header from '../components/Header'

export default function Document(){
  return(
    <Html>
      <Head>
        {/* <meta charSet="UTF-8" />
        <meta lang='pt-br' />
        <meta name="viewport" content="width=device-width, initial-scale=1"/> */}
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Raleway:wght@100;400;600&display=swap" rel="stylesheet"/>
        <link
          href="https://fonts.googleapis.com/css2?family=Plaster&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        {/* <title>Ink-Trail</title> */}
      </Head>
      <body>
        <Main/>

        <NextScript/>
      </body>
    </Html>
  )
}