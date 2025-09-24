// src/components/BackButton.tsx
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname.startsWith("/dashboard")) {
      navigate("/");
    } else if (location.pathname.startsWith("/credentials")) {
      navigate("/dashboard");
    } else if (location.pathname.startsWith("/workflow")) {
      navigate("/dashboard");
    } else {
      navigate(-1); // fallback
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </Button>
  );
}
