import AddContestantForm from "../AddContestantForm";

export default function AddContestantFormExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <AddContestantForm
          onSubmit={(contestant) => console.log("New contestant:", contestant)}
          onCancel={() => console.log("Cancel clicked")}
        />
      </div>
    </div>
  );
}
