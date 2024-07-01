import { SignIn } from "@clerk/nextjs";
import AuthLayout from "../../layout";

export default function Page() {
  return (
    <AuthLayout>
      <SignIn />
    </AuthLayout>
  );
}
