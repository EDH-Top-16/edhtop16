export function CedhPromo() {
  return (
    <a
      href="https://cedh.io?ref=edhtop16"
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-4 block rounded-lg border border-purple-500/30 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 transition-all hover:border-purple-500/50 hover:from-purple-900/50 hover:to-indigo-900/50"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-xl font-bold text-purple-300">
          io
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white group-hover:text-purple-200">
            Get personalized insights into your deck with cedh.io
          </h4>
          <p className="mt-0.5 text-xs text-purple-300">
            Use code <span className="font-bold">EDHTOP16</span> for 50% off
            your first month
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="rounded-md bg-purple-500 px-3 py-1.5 text-sm font-medium text-white transition-colors group-hover:bg-purple-400">
            Try it
          </span>
        </div>
      </div>
    </a>
  );
}
