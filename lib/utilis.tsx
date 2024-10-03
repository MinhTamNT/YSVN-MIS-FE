export const convertToBase64 = async (uri: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const cleanedBase64 = base64String.split(",")[1];
      resolve(cleanedBase64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
