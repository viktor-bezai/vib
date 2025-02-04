const convertToEmbedUrl = (url: string) => {
  if (!url) return "";

  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  let timestamp = urlObj.searchParams.get("t");

  if (!videoId) return url;

  if (timestamp && timestamp.endsWith("s")) {
    timestamp = timestamp.slice(0, -1);
  }

  // Append hl=en to prioritize English audio when available
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&hl=en${timestamp ? `&start=${timestamp}` : ""}`;
};

export default convertToEmbedUrl;
