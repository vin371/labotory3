import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ArrowLeft, ClipboardList, AlertCircle, User, Calendar, Phone, Mail, MapPin, FileText, MessageSquare, Plus, Edit, Trash2, CheckCircle, Brain, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";
import { useAuth } from "../contexts/AuthContext";
import { hasPermission } from "../types/auth";
import { toast } from "sonner@2.0.3";
import { AccessDenied } from "./AccessDenied";

interface TestOrder {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  phoneNumber: string;
  status: "Pending" | "Cancelled" | "Completed" | "Reviewed" | "AI Reviewed";
  createdDate: string;
  createdBy: string;
  runDate: string;
  runBy: string;
  dateOfBirth: string;
  address: string;
  email: string;
}

interface TestResult {
  id: string;
  testName: string;
  result: string;
  unit: string;
  normalRange: string;
  status: "Normal" | "Abnormal";
}

interface Comment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
}

interface TestOrderDetailProps {
  testOrder: TestOrder | null;
  onBack: () => void;
}

const mockTestResults: TestResult[] = [
  { id: "1", testName: "White Blood Cell Count", result: "7.5", unit: "10^9/L", normalRange: "4.0-10.0", status: "Normal" },
  { id: "2", testName: "Red Blood Cell Count", result: "5.2", unit: "10^12/L", normalRange: "4.5-5.5", status: "Normal" },
  { id: "3", testName: "Hemoglobin", result: "14.5", unit: "g/dL", normalRange: "13.5-17.5", status: "Normal" },
  { id: "4", testName: "Glucose", result: "125", unit: "mg/dL", normalRange: "70-100", status: "Abnormal" },
];

const mockComments: Comment[] = [
  { id: "1", author: "Dr. Smith", message: "Patient shows elevated glucose levels. Recommend fasting test.", timestamp: "2024-10-14 15:30:00" },
  { id: "2", author: "Lab Tech", message: "Sample quality is good. All tests completed successfully.", timestamp: "2024-10-14 14:45:00" },
];

export function TestOrderDetail({ testOrder, onBack }: TestOrderDetailProps) {
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState(testOrder?.status || "Pending");
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [newComment, setNewComment] = useState("");
  const [isAddCommentOpen, setIsAddCommentOpen] = useState(false);
  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
  const [isDeleteCommentOpen, setIsDeleteCommentOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [editCommentText, setEditCommentText] = useState("");

  const canAccess = user && hasPermission(user.role, "VIEW_TEST_ORDER_DETAIL");
  const canReview = user && hasPermission(user.role, "REVIEW_TEST_RESULTS");
  const canManageComments = user && hasPermission(user.role, "MANAGE_COMMENTS");
  const canPrint = user && hasPermission(user.role, "PRINT_TEST_RESULTS");

  if (!canAccess) {
    return <AccessDenied onBack={onBack} />;
  }

  if (!testOrder) {
    return (
      <Card className="shadow-lg border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-slate-800 mb-2">Test Order Not Found</h3>
            <p className="text-slate-600 mb-6">The requested test order could not be found.</p>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Test Orders
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleReviewTest = () => {
    setCurrentStatus("Reviewed");
    console.log("TEST REVIEWED:", {
      orderId: testOrder.id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
      reviewedBy: user?.email,
    });
    toast.success("Test order marked as Reviewed");
  };

  const handleAIReview = () => {
    setCurrentStatus("AI Reviewed");
    console.log("AI REVIEW TRIGGERED:", {
      orderId: testOrder.id,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
    toast.success("AI review completed successfully");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error("Comment message cannot be empty");
      return;
    }

    const comment: Comment = {
      id: Date.now().toString(),
      author: user?.fullName || "Unknown",
      message: newComment,
      timestamp: new Date().toISOString(),
    };

    setComments([comment, ...comments]);
    setNewComment("");
    setIsAddCommentOpen(false);
    
    console.log("COMMENT ADDED:", {
      orderId: testOrder.id,
      commentId: comment.id,
      authorId: user?.id,
      timestamp: comment.timestamp,
    });
    
    toast.success("Comment added successfully");
  };

  const handleEditComment = (comment: Comment) => {
    setSelectedComment(comment);
    setEditCommentText(comment.message);
    setIsEditCommentOpen(true);
  };

  const handleUpdateComment = () => {
    if (!editCommentText.trim()) {
      toast.error("Comment message cannot be empty");
      return;
    }

    if (selectedComment) {
      setComments(
        comments.map((c) =>
          c.id === selectedComment.id ? { ...c, message: editCommentText } : c
        )
      );

      console.log("COMMENT UPDATED:", {
        orderId: testOrder.id,
        commentId: selectedComment.id,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });

      setIsEditCommentOpen(false);
      setSelectedComment(null);
      setEditCommentText("");
      toast.success("Comment updated successfully");
    }
  };

  const handleDeleteComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsDeleteCommentOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedComment) {
      setComments(comments.filter((c) => c.id !== selectedComment.id));

      console.log("COMMENT DELETED:", {
        orderId: testOrder.id,
        commentId: selectedComment.id,
        userId: user?.id,
        timestamp: new Date().toISOString(),
      });

      setIsDeleteCommentOpen(false);
      setSelectedComment(null);
      toast.success("Comment deleted successfully");
    }
  };

  const handlePrintPDF = () => {
    if (currentStatus !== "Completed" && currentStatus !== "Reviewed") {
      toast.error("Can only print completed test results", {
        description: "Please complete the test before printing.",
      });
      return;
    }

    const fileName = `Detail-${testOrder.patientName.replace(/\s+/g, '_')}-${new Date().toLocaleDateString()}.pdf`;
    toast.success(`Generating PDF: ${fileName}`, {
      description: "Print process running in background...",
    });

    console.log("PRINT PDF:", {
      orderId: testOrder.id,
      fileName,
      userId: user?.id,
      timestamp: new Date().toISOString(),
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Reviewed":
        return "bg-green-100 text-green-800 border-green-200";
      case "AI Reviewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-slate-50 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-slate-800">Test Order Detail</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {canPrint && (
                <Button variant="outline" size="sm" onClick={handlePrintPDF}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print PDF
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
          <CardDescription className="text-slate-600">
            Complete test order information and results (Read-only for audit tracking)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <Label className="text-slate-500 text-sm">Test Order ID</Label>
              <p className="text-slate-800 text-xl">{testOrder.id}</p>
            </div>
            <Badge variant="outline" className={`${getStatusColor(currentStatus)} text-lg px-4 py-1`}>
              {currentStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Patient Information */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-slate-800">Patient Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <Label className="text-slate-500 text-sm">Patient Name</Label>
              <p className="text-slate-800 mt-1">{testOrder.patientName}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <Label className="text-slate-500 text-sm">Age / Gender</Label>
              <p className="text-slate-800 mt-1">{testOrder.age} years / {testOrder.gender}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-slate-500" />
                <Label className="text-slate-500 text-sm">Date of Birth</Label>
              </div>
              <p className="text-slate-800">{testOrder.dateOfBirth}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Phone className="h-4 w-4 text-slate-500" />
                <Label className="text-slate-500 text-sm">Phone</Label>
              </div>
              <p className="text-slate-800">{testOrder.phoneNumber}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-4 w-4 text-slate-500" />
                <Label className="text-slate-500 text-sm">Email</Label>
              </div>
              <p className="text-slate-800">{testOrder.email || "N/A"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-slate-500" />
                <Label className="text-slate-500 text-sm">Address</Label>
              </div>
              <p className="text-slate-800">{testOrder.address || "N/A"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {currentStatus === "Completed" || currentStatus === "Reviewed" || currentStatus === "AI Reviewed" ? (
        <Card className="shadow-lg border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-slate-800">Test Results</CardTitle>
              </div>
              {canReview && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleAIReview}>
                    <Brain className="h-4 w-4 mr-2" />
                    AI Review
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReviewTest}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Reviewed
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left p-3 text-sm text-slate-700">Test Name</th>
                    <th className="text-left p-3 text-sm text-slate-700">Result</th>
                    <th className="text-left p-3 text-sm text-slate-700">Unit</th>
                    <th className="text-left p-3 text-sm text-slate-700">Normal Range</th>
                    <th className="text-left p-3 text-sm text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTestResults.map((result) => (
                    <tr key={result.id} className="border-t border-slate-200">
                      <td className="p-3 text-slate-800">{result.testName}</td>
                      <td className="p-3 text-slate-800 font-medium">{result.result}</td>
                      <td className="p-3 text-slate-600">{result.unit}</td>
                      <td className="p-3 text-slate-600">{result.normalRange}</td>
                      <td className="p-3">
                        <Badge
                          variant="outline"
                          className={
                            result.status === "Normal"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }
                        >
                          {result.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-lg border-slate-200">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-slate-600">Test results will be available once the order is completed.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comments Section */}
      <Card className="shadow-lg border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-slate-800">Comments</CardTitle>
            </div>
            {canManageComments && (
              <Dialog open={isAddCommentOpen} onOpenChange={setIsAddCommentOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Comment
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle>Add Comment</DialogTitle>
                    <DialogDescription>Add a comment to this test order</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Enter your comment..."
                      rows={4}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddCommentOpen(false)}>
                      Cancel
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddComment}>
                      Add Comment
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No comments yet</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-slate-800 font-medium">{comment.author}</p>
                      <p className="text-slate-500 text-sm">{comment.timestamp}</p>
                    </div>
                    {canManageComments && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => handleEditComment(comment)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteComment(comment)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-700">{comment.message}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Comment Dialog */}
      <Dialog open={isEditCommentOpen} onOpenChange={setIsEditCommentOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Edit Comment</DialogTitle>
            <DialogDescription>Modify the comment text</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editCommentText}
              onChange={(e) => setEditCommentText(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCommentOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleUpdateComment}>
              Update Comment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Comment Dialog */}
      <AlertDialog open={isDeleteCommentOpen} onOpenChange={setIsDeleteCommentOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
