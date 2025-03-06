// src/pages/NotFound.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <CardDescription className="text-xl mt-2">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="default" size="lg">
            <Link to="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotFound;
