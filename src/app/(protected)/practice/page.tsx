// import ResetDialog from "./_components/reset-dialog";
// import { Trophy } from "lucide-react";
// import { fetchUnansweredQuestion } from "./actions";

import PageTitle from "../_components/page-title";
import CustomSessionForm from "./_components/custom-session-form";

export default async function PracticePage() {
  // const question = await fetchUnansweredQuestion(session.id);

  // if (!question) {
  //   return (
  //     <div className="place-items-center grid px-6 h-full text-muted-foreground text-center">
  //       <div className="flex flex-col items-center space-y-4">
  //         <Trophy className="w-12 h-12 text-primary" />
  //         <p className="font-bold text-2xl">You&apos;re All Caught Up!</p>
  //         <p className="max-w-md text-sm">
  //           You&apos;ve answered every available question. Great job! You can
  //           reset your progress below to start again.
  //         </p>
  //         <ResetDialog />
  //       </div>
  //     </div>
  //   );
  // }

  // return redirect(`/practice/${question.id}`);

  return (
    <div className="h-full overflow-y-auto">
      <PageTitle text="Practice" />
      <CustomSessionForm />
    </div>
  );
}
