import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import { registerSchema, loginSchema } from "@mg/shared";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(input: unknown) {
    const data = registerSchema.parse(input);
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (existing) throw new ConflictException("Email already registered");

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        name: data.name,
        phone: data.phone,
        cart: { create: {} },
      },
    });

    return this.tokenResponse(user.id, user.email, user.role, user.name);
  }

  async login(input: unknown) {
    const data = loginSchema.parse(input);
    const user = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });
    if (!user?.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    return this.tokenResponse(user.id, user.email, user.role, user.name);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        locale: true,
        image: true,
        createdAt: true,
      },
    });
  }

  private tokenResponse(
    id: string,
    email: string,
    role: string,
    name: string,
  ) {
    const accessToken = this.jwt.sign({ sub: id, email, role });
    return { accessToken, user: { id, email, role, name } };
  }
}
