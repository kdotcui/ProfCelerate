import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, BookOpen, Clock } from 'lucide-react';
import { ClassData } from '@/types/class';

interface ClassHeaderProps {
  classData: ClassData;
}

export const ClassHeader: React.FC<ClassHeaderProps> = ({ classData }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{classData.title}</h1>
              {getStatusBadge(classData.status)}
            </div>
            <p className="text-xl text-muted-foreground">
              {classData.department} • {classData.code}
            </p>
            <p className="max-w-2xl mt-2">{classData.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span>
              <strong>{classData.students}</strong> students enrolled
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <span>{classData.schedule}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>Term: {classData.term || 'Spring 2025'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
