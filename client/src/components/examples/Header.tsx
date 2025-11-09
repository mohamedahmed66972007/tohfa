import Header from "../Header";

export default function HeaderExample() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 px-4">
        <p className="text-foreground text-center">محتوى الصفحة هنا</p>
      </div>
    </div>
  );
}
