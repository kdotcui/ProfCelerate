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
  BookOpen,
  FileCheck,
  Clock,
  Users,
  BarChart3,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ClassData } from '@/types/class';
import { Assignment } from '@/types/assignment';
import PageHeader from '@/components/ui/PageHeader';

interface DashboardStats {
  totalClasses: number;
  totalGraded: number;
  recentActivity: {
    id: string;
    title: string;
    type: string;
    createdAt: string;
    classId: string;
  }[];
  recentClasses: {
    id: number;
    title: string;
    lastModified: string;
  }[];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalClasses: 0,
    totalGraded: 0,
    recentActivity: [],
    recentClasses: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Fetch classes
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select('*')
        .eq('user_id', user.id);

      if (classesError) throw classesError;

      // Fetch assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (assignmentsError) throw assignmentsError;

      // Fetch completed submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('submissions')
        .select('*')
        .eq('status', 'completed')
        .in('assignment_id', assignments?.map((a) => a.id) || []);

      if (submissionsError) throw submissionsError;

      // Transform recent activity
      const recentActivity =
        assignments?.map((assignment) => ({
          id: assignment.id,
          title: assignment.title,
          type: assignment.type,
          createdAt: assignment.created_at,
          classId: assignment.class_id,
        })) || [];

      // Get recent classes with their last modification time
      const recentClasses = await Promise.all(
        (classes || []).map(async (cls) => {
          // Get the most recent assignment for this class
          const { data: recentAssignment } = await supabase
            .from('assignments')
            .select('created_at')
            .eq('class_id', cls.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Get the most recent submission for this class's assignments
          const { data: recentSubmission } = await supabase
            .from('submissions')
            .select('created_at')
            .in(
              'assignment_id',
              (
                await supabase
                  .from('assignments')
                  .select('id')
                  .eq('class_id', cls.id)
              ).data?.map((a) => a.id) || []
            )
            .order('created_at', { ascending: false })
            .limit(1);

          // Compare all dates to get the most recent
          const dates = [
            new Date(cls.updated_at),
            ...(recentAssignment?.map((a) => new Date(a.created_at)) || []),
            ...(recentSubmission?.map((s) => new Date(s.created_at)) || []),
          ];

          const lastModified = new Date(
            Math.max(...dates.map((d) => d.getTime()))
          );

          return {
            id: cls.id,
            title: cls.title,
            lastModified: lastModified.toISOString(),
          };
        })
      );

      // Sort classes by last modified date
      recentClasses.sort(
        (a, b) =>
          new Date(b.lastModified).getTime() -
          new Date(a.lastModified).getTime()
      );

      setStats({
        totalClasses: classes?.length || 0,
        totalGraded: submissions?.length || 0,
        recentActivity,
        recentClasses: recentClasses.slice(0, 5), // Only show top 5 most recently modified
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto">
      <PageHeader
        breadcrumbItems={[
          { label: 'Dashboard', href: '/dashboard', isCurrent: true },
        ]}
        actions={
          <Button
            onClick={() => navigate('/dashboard/classes')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            New Class
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Recent Classes
            </CardTitle>
            <CardDescription>Recently modified classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.recentClasses.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No classes yet
              </div>
            ) : (
              <div className="space-y-2">
                {stats.recentClasses.map((cls) => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between text-sm cursor-pointer hover:text-primary hover:bg-muted/50 p-2 rounded-md transition-colors"
                    onClick={() => navigate(`/dashboard/classes/${cls.id}`)}
                  >
                    <span className="font-medium">{cls.title}</span>
                    <span className="text-muted-foreground">
                      {new Date(cls.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={() => navigate('/dashboard/classes')}
            >
              <BookOpen className="h-4 w-4" />
              View All Classes
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No recent assignments
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.recentActivity.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between text-sm cursor-pointer hover:text-primary hover:bg-muted/50 p-2 rounded-md transition-colors"
                      onClick={() => {
                        if (activity.classId) {
                          navigate(
                            `/dashboard/classes/${activity.classId}/assignments/${activity.id}`
                          );
                        } else {
                          toast.error(
                            'Cannot navigate to assignment: missing class information'
                          );
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-primary" />
                        <span className="font-medium">{activity.title}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {new Date(activity.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => navigate('/dashboard/classes')}
              >
                View All Assignments
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
                <span className="font-medium">{stats.totalClasses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Graded
                </span>
                <span className="font-medium">{stats.totalGraded}</span>
              </div>
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
