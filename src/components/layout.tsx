import Navbar from "./navbar";

export default function Layout({ children }) {
  return (
    <>
      <div className="flex min-h-full ">
        <Navbar />
        <div className="min-h-full p-6">
          <main>{children}</main>
        </div>
      </div>
    </>
  );
}
