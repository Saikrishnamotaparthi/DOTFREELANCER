/**
 * Generates an event series code (always "D") and a gate access key (D + 4 random digits).
 * Example: Event "Tech Summit" -> Series: "D", Access Code: "D8439"
 */
export function generateEventPasskey(eventName: string): {
  passKeySeries: string;
  accessCode: string;
} {
  // Generate 4 random digits
  const digits = Math.floor(1000 + Math.random() * 9000).toString();
  const accessCode = `D${digits}`; // e.g. D1948

  return {
    passKeySeries: "D",
    accessCode,
  };
}
