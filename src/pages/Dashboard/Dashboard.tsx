import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  BookOpen,
  FileCheck,
  Clock,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink to="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Button
          onClick={() => navigate('/dashboard/classes')}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          New Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks for your classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/dashboard/classes')}
            >
              <BookOpen className="h-4 w-4" />
              View All Classes
            </Button>
            {/* <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/dashboard/assignments')}
            >
              <FileCheck className="h-4 w-4" />
              Grade Assignments
            </Button> */}
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest grading activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                No recent grading activities
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate('/dashboard/assignments')}
              >
                Start Grading
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </CardTitle>
            <CardDescription>Overview of your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Classes
                </span>
                <span className="font-medium">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Pending Grading
                </span>
                <span className="font-medium">0</span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Students
                </span>
                <span className="font-medium">0</span>
              </div> */}
              {/* students not implemented yet */}
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Manage your account and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/dashboard/settings')}
            >
              <Settings className="h-4 w-4" />
              Account Settings
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
