
import Header from "../components/header";
import Footer from "../components/footer";

export default function MainLayout({ children }) {
  return (
    <>
      <div className="container mx-auto pb-6">
        <Header title="Welcome" />
        <main className="min-h-screen">{children}</main>
      </div>
      <Footer />
    </>
  );
}
