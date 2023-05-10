import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Password {
  static async hash(plainPassword: string): Promise<string> {
    const salt = randomBytes(8).toString("hex");
    const buffer = (await scryptAsync(plainPassword, salt, 64)) as Buffer;

    return `${buffer.toString("hex")}.${salt}`;
  }

  static async compare(
    storedPassword: string,
    plainPassword: string
  ): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split(".");
    const buffer = (await scryptAsync(plainPassword, salt, 64)) as Buffer;

    return buffer.toString("hex") === hashedPassword;
  }
}
