import SideNav from "../(protected)/_components/side-nav";
import Custom404 from "../(protected)/not-found";
// import Custom500 from "../(protected)/error";

export default function DevPage() {
  return (
    <div className="flex h-full overflow-hidden">
      <SideNav />
      <main className="flex-4 bg-secondary h-full overflow-y-auto">
        <Custom404 />
        {/* <Custom500 /> */}
      </main>
    </div>
  );
}
