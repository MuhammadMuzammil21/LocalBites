type Props = {
    title: string;
  };
  
  const SectionHeader = ({ title }: Props) => {
    return (
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800">{title}</h2>
        <div className="mt-2 h-1 w-24 mx-auto bg-orange-500 rounded-full" />
      </div>
    );
  };
  
  export default SectionHeader;
  