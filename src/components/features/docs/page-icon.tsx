import {
  BookOpen,
  Code,
  FileText,
  Layers,
  Puzzle,
  Component,
  Workflow,
  Key,
  BookA,
  Play,
  TestTube,
} from "lucide-react";

export function PageIcon({ name }: { name: string }) {
  switch (name) {
    case "play":
      return <Play className="h-4 w-4" />;
    case "test":
      return <TestTube className="h-4 w-4" />;
    case "stack":
      return <Layers className="h-4 w-4" />;
    case "book":
      return <BookA className="h-4 w-4" />;
    case "workflow":
      return <Workflow className="h-4 w-4" />;
    case "component":
      return <Component className="h-4 w-4" />;
    case "book":
      return <BookOpen className="h-4 w-4" />;
    case "key":
      return <Key className="h-4 w-4" />;
    case "code":
      return <Code className="h-4 w-4" />;
    case "file":
      return <FileText className="h-4 w-4" />;
    case "puzzle":
      return <Puzzle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}
