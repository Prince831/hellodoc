import { MessageSquare, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EmptyStateProps {
  type: 'no-conversations' | 'no-messages' | 'select-conversation';
  onStartConversation?: () => void;
}

const EmptyState = ({ type, onStartConversation }: EmptyStateProps) => {
  const getContent = () => {
    switch (type) {
      case 'no-conversations':
        return {
          icon: <Users className="h-16 w-16 text-muted-foreground/50" />,
          title: "No conversations yet",
          description: "Start your first conversation with a doctor or healthcare provider.",
          action: onStartConversation && (
            <Button onClick={onStartConversation} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Start Conversation
            </Button>
          )
        };
      case 'no-messages':
        return {
          icon: <MessageSquare className="h-16 w-16 text-muted-foreground/50" />,
          title: "No messages in this conversation",
          description: "Send your first message to start the conversation.",
          action: null
        };
      case 'select-conversation':
      default:
        return {
          icon: <MessageSquare className="h-16 w-16 text-muted-foreground/50" />,
          title: "Select a conversation",
          description: "Choose a conversation from the sidebar to start messaging.",
          action: null
        };
    }
  };

  const content = getContent();

  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="w-full max-w-md border-dashed">
        <CardContent className="text-center p-8">
          <div className="mb-6">
            {content.icon}
          </div>
          <CardTitle className="text-xl mb-3">{content.title}</CardTitle>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {content.description}
          </p>
          {content.action}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;