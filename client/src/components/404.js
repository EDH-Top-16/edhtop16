export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center grow text-lightText dark:text-text p-6">
      <h1 className="text-4xl font-bold text-center">404</h1>
      <p className="text-center text-2xl">
        Page Not Found. Please check the URL and try again.
      </p>
    </div>
  );
}
