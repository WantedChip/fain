/**
 * CRC8 Dallas/Maxim implementation (Polynomial: 0x31 or 0x07 SMBus)
 * Used in LoRa microcontroller sensor payloads to verify packet integrity over IN865 band.
 */
export function calculateCrc8(bytes: number[] | Uint8Array, polynomial: number = 0x07): number {
  let crc = 0x00;
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i];
    for (let bit = 0; bit < 8; bit++) {
      if ((crc & 0x80) !== 0) {
        crc = ((crc << 1) ^ polynomial) & 0xff;
      } else {
        crc = (crc << 1) & 0xff;
      }
    }
  }
  return crc;
}

/**
 * Format a byte to 2-digit uppercase hex
 */
export function byteToHex(byte: number): string {
  return (byte & 0xff).toString(16).padStart(2, '0').toUpperCase();
}

/**
 * Format byte array to space-separated hex string
 */
export function bytesToHexString(bytes: number[] | Uint8Array): string {
  return Array.from(bytes).map(b => byteToHex(b)).join(' ');
}

/**
 * Format byte to 8-bit binary string
 */
export function byteToBinary(byte: number): string {
  return (byte & 0xff).toString(2).padStart(8, '0');
}
