import Header from "../../../components/layout/Header";
import Footer from "../../../components/layout/Footer";
import ResetPasswordForm from "@/components/layout/ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <div className="flex flex-col min-h-screen mt-32">
      <Header />

      <div className="flex-grow container mx-auto px-4 py-12 max-w-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <ResetPasswordForm />
      </div>

      <Footer />
    </div>
  );
}
