export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto px-4 py-8 container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground text-sm">
            Built by{' '}
            <a
              href="https://lucassilbernagel.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary"
            >
              Lucas Silbernagel
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
