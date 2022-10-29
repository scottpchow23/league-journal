import Head from "next/head";
import Navbar from "../components/Navbar";
import type { ReactNode } from "react";

const Layout = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Head>
        <title>League Journal</title>
        <meta name="description" content="League Journal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </>
  );
};
export default Layout;
