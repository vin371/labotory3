import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ShieldX, ArrowLeft } from "lucide-react";

interface AccessDeniedProps {
  onBack?: () => void;
}

export function AccessDenied({ onBack }: AccessDeniedProps) {
  return (
    <Card className="shadow-lg border-slate-200">
      <CardContent className="pt-12 pb-12">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
            <ShieldX className="h-10 w-10 text-red-600" />
          </div>
          
          <h1 className="text-slate-800 mb-3">403 - Access Denied</h1>
          
          <p className="text-slate-600 mb-6">
            You do not have permission to access this feature. This section is only available to authorized roles (Lab User, Manager, Service User).
          </p>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg w-full mb-6">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> If you believe you should have access to this feature, please contact your system administrator.
            </p>
          </div>

          {onBack && (
            <Button onClick={onBack} className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
