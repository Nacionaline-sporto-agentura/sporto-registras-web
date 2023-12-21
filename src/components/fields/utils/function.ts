export const getFilteredOptions = (
  options: any[],
  input: string,
  getOptionLabel: (option: any) => string,
) =>
  options?.filter((option) => {
    const label = getOptionLabel(option)?.toString().toLowerCase();
    return label?.includes(input.toLowerCase());
  });

export const filterSelectedOptions = (suggestions: any[], values: any[], getOptionValue) =>
  suggestions.filter(
    (opt) => !values?.some((value) => getOptionValue(value) === getOptionValue(opt)),
  );
