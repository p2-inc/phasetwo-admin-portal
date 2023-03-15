export const BasicFormClasses =
  "block rounded border-gray-300 focus:border-gray-400 focus:ring-gray-400 sm:text-sm bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-500 transition";

const FormTextInput = () => {
  return (
    <input
      type="text"
      name="text"
      id="text"
      className={BasicFormClasses}
      placeholder="placeholder"
    />
  );
};

export default FormTextInput;
