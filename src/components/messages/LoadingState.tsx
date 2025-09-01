import { MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  type: 'conversations' | 'messages' | 'sending';
}

const LoadingState = ({ type }: LoadingStateProps) => {
  const getContent = () => {
    switch (type) {
      case 'conversations':
        return {
          icon: <Users className="h-8 w-8 text-muted-foreground animate-pulse" />,
          title: "Loading conversations...",
          skeleton: (
            <div className="space-y-4 mt-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )
        };
      case 'messages':
        return {
          icon: <MessageSquare className="h-8 w-8 text-muted-foreground animate-pulse" />,
          title: "Loading messages...",
          skeleton: (
            <div className="space-y-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`flex gap-3 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
                  <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
                  <div className="space-y-2 max-w-[70%]">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              ))}
            </div>
          )
        };
      case 'sending':
        return {
          icon: <MessageSquare className="h-6 w-6 text-muted-foreground animate-spin" />,
          title: "Sending message...",
          skeleton: null
        };
      default:
        return {
          icon: <MessageSquare className="h-8 w-8 text-muted-foreground animate-pulse" />,
          title: "Loading...",
          skeleton: null
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          {content.icon}
        </div>
        <p className="text-sm text-muted-foreground">{content.title}</p>
        {content.skeleton}
      </div>
    </div>
  );
};

export default LoadingState;