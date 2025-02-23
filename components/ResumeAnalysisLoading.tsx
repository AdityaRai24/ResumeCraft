import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ResumeAnalysisLoading = () => {
  return (
    <div className="w-full space-y-6">
      {/* Score and Main Analysis */}
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-4">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Skeleton className="h-full w-full rounded-full bg-pink-100" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 animate-pulse">...</div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold">Analysis Results</h2>
              <Skeleton className="h-4 w-3/4 bg-pink-200" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Analysis */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Skills Analysis</h3>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Matching Skills */}
          <div>
            <h4 className="text-md font-medium mb-2">Matching Skills</h4>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full bg-green-200" />
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <h4 className="text-md font-medium mb-2">Missing Skills</h4>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-28 rounded-full bg-red-200" />
              ))}
            </div>
          </div>

          {/* Funny Takes */}
          <div>
            <h4 className="text-md font-medium mb-2">Funny Takes</h4>
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-4 w-full bg-pink-200" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Career Story Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Career Story Roast</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full bg-pink-200" />
          <div className="space-y-2">
            <h4 className="text-md font-medium">Funny Highlights</h4>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-4 w-5/6 bg-pink-200" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Projects Analysis</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full bg-pink-200" />
          {[1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-1/4 bg-pink-200" />
              <Skeleton className="h-4 w-full bg-pink-200" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalysisLoading;