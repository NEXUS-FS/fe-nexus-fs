const FormHeader = () => {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <h1 className="text-2xl font-general-medium">Login to your account</h1>
      <p className="text-muted-foreground text-sm text-balance mt-2">
        Enter your username below to login to your account
      </p>
    </div>
  );
};

export default FormHeader;