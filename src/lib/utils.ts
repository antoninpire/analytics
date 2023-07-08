export const cx = (...args: (string | undefined | false)[]) =>
  args.filter(Boolean).join(" ");

export const formatNumber = (num: number) => Intl.NumberFormat().format(+num);

export function kFormatter(value: number): string {
  return value > 999 ? `${(value / 1000).toFixed(1)}K` : String(value);
}

export function formatMinSec(totalSeconds: number) {
  if (isNaN(totalSeconds)) return "0s";

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const padTo2Digits = (value: number) => value.toString().padStart(2, "0");
  return `${minutes ? `${minutes}m` : ""} ${padTo2Digits(seconds)}s`;
}

export function formatPercentage(value: number) {
  return `${value ? (value * 100).toFixed(2) : "0"}%`;
}

export function getDeviceType(ua: string) {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

export function getBrowser(userAgent: string) {
  if (userAgent.includes("Chrome")) {
    return "Google Chrome";
  } else if (userAgent.includes("Firefox")) {
    return "Mozilla Firefox";
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Apple Safari";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    return "Internet Explorer";
  } else if (userAgent.includes("Edge")) {
    return "Microsoft Edge";
  } else {
    return "Unknown Browser";
  }
}
