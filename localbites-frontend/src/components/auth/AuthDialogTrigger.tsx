import { Button } from "../ui/button";
import { useAuthDialog } from "../../context/AuthDialogContext";

export default function AuthDialogTrigger() {
  const { openAuthDialog } = useAuthDialog();

  return (
    <Button 
      onClick={openAuthDialog}
      className="text-white border-white/30 bg-gray-700 hover:bg-gray-600"
    >
      Sign In
    </Button>
  );
} 