import PageTitle from "../_components/page-title";
import CustomSessionForm from "./_components/custom-session-form";

export default async function PracticePage() {
  return (
    <div className="h-full overflow-y-auto">
      <PageTitle text="Practice" />
      <CustomSessionForm />
    </div>
  );
}
