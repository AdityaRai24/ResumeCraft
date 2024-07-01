import { SignUp } from "@clerk/nextjs";
import AuthLayout from "../../layout";

export default function Page() {
  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
}
