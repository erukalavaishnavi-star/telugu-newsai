import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

const JWT_SECRET       = process.env.JWT_SECRET ?? 'change-me-in-production';
const JWT_EXPIRES_IN   = process.env.JWT_EXPIRES_IN ?? '7d';
const REFRESH_SECRET   = process.env.JWT_SECRET + '_refresh';
const REFRESH_EXPIRES  = '30d';

function signTokens(userId: string) {
  const token        = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  const refreshToken = jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES } as jwt.SignOptions);
  return { token, refreshToken };
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const { token, refreshToken } = signTokens(user.id);

    res.json({
      success: true,
      data: {
        token,
        refreshToken,
        user: {
          id:      user.id,
          email:   user.email,
          name:    user.name,
          orgName: user.orgName,
          role:    user.role,
          plan:    user.plan,
        },
      },
    });
  } catch (err) {
    console.error('login error:', err);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
}

export async function signup(req: Request, res: Response) {
  const { email, password, name, orgName } = req.body;

  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 12);
    const user   = await prisma.user.create({
      data: { email, password: hashed, name, orgName },
    });

    const { token, refreshToken } = signTokens(user.id);

    res.status(201).json({
      success: true,
      data: {
        token,
        refreshToken,
        user: { id: user.id, email: user.email, name: user.name, role: user.role, plan: user.plan },
      },
    });
  } catch (err) {
    console.error('signup error:', err);
    res.status(500).json({ success: false, message: 'Signup failed' });
  }
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;

  try {
    const payload = jwt.verify(refreshToken, REFRESH_SECRET) as { userId: string };
    const token   = jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
    res.json({ success: true, data: { token } });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
  }
}
