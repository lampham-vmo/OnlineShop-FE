interface IBreadcrumbProps {
  title: string;
}

const Breadcrumb = ({ title }: IBreadcrumbProps) => {
  return (
    <div className="overflow-hidden shadow-breadcrumb">
      <div className="border-t-0 border-gray-3">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h1 className="font-semibold text-dark text-xl sm:text-2xl xl:text-custom-2">
              {title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
