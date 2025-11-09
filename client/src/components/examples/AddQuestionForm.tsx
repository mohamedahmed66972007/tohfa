import AddQuestionForm from "../AddQuestionForm";

export default function AddQuestionFormExample() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <AddQuestionForm
          onAddQuestion={(question) => console.log("New question:", question)}
        />
      </div>
    </div>
  );
}
