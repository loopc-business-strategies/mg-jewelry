import { Suspense } from "react";
import { SuccessClient } from "./success-client";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="px-5 pt-28">...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
