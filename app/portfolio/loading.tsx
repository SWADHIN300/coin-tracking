const PortfolioLoading = () => {
  return (
    <main className="main-container py-10">
      <div className="animate-pulse space-y-6">
        <div className="h-48 rounded-[32px] bg-dark-500/70" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-96 rounded-[28px] bg-dark-500/70" />
          <div className="h-96 rounded-[28px] bg-dark-500/70" />
        </div>
        <div className="h-[28rem] rounded-[28px] bg-dark-500/70" />
      </div>
    </main>
  );
};

export default PortfolioLoading;
