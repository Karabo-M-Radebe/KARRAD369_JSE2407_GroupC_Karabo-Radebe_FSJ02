import SkeletonCard from "./SkeletonCard";

const Loading = () => (
    <div className="container mx-auto py-8 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">Loading Products...</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
  
  export default Loading;
  