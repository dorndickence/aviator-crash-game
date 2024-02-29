const Logout = () => {
  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Please login</h1>
            <p className="py-6">Login to continue</p>
            <a href="./login" className="btn btn-primary">
              Return to login
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Logout;
