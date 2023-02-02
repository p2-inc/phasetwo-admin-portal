import Head from "next/head";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Head>
        <title>Phase Two</title>
        <meta name="description" content="Phase Two -- Future Proof Your App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1 className="text-3xl font-bold">Phase Two</h1>
      </main>
    </>
  );
}
