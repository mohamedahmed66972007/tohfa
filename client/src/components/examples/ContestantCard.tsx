import ContestantCard from "../ContestantCard";

export default function ContestantCardExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-sm mx-auto">
        <ContestantCard
          id="1"
          name="أحمد محمد"
          questionCount={10}
          onStart={(id) => console.log("Start quiz for contestant:", id)}
          onEdit={(id) => console.log("Edit contestant:", id)}
          onDelete={(id) => console.log("Delete contestant:", id)}
        />
      </div>
    </div>
  );
}
