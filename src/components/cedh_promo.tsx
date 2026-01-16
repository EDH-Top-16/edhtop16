export function CedhPromo() {
  return (
    <a
      href="https://cedh.io?ref=edhtop16"
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-4 block rounded-lg border border-orange-500/30 bg-gradient-to-r from-orange-900/40 to-amber-900/40 p-4 transition-all hover:border-orange-500/50 hover:from-orange-900/50 hover:to-amber-900/50"
    >
      <div className="flex items-center gap-3">
        <img
          src="/promos/cedh-io.png"
          alt="cedh.io"
          className="h-10 w-10 flex-shrink-0 rounded-lg"
        />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white group-hover:text-orange-200">
            Want more? Try cedh.io for personalized deck analysis
          </h4>
          <p className="mt-0.5 text-xs text-orange-300">
            Use code <span className="font-bold">EDHTOP16</span> for 50% off
            your first month
          </p>
        </div>
        <div className="flex-shrink-0">
          <span className="rounded-md bg-orange-500 px-3 py-1.5 text-sm font-medium text-white transition-colors group-hover:bg-orange-400">
            Try it
          </span>
        </div>
      </div>
    </a>
  );
}
