export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center gap-2">
        <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
