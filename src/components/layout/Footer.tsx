export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} ClashSync Lite. All rights reserved.</p>
      </div>
    </footer>
  );
}
