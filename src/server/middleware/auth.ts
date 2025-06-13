import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../shared/types';
import { logger } from '../utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends Request {
  user: User;
}

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access token required' 
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // In a real application, you would fetch the user from the database
    // For now, we'll use the decoded token data
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      role: decoded.role,
      organizationId: decoded.organizationId,
      isActive: true,
      createdAt: new Date(decoded.createdAt),
      updatedAt: new Date()
    };

    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        error: 'Authentication required' 
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        success: false, 
        error: 'Insufficient permissions' 
      });
      return;
    }

    next();
  };
};

export const requireOrganization = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({ 
      success: false, 
      error: 'Authentication required' 
    });
    return;
  }

  if (!req.user.organizationId) {
    res.status(403).json({ 
      success: false, 
      error: 'Organization access required' 
    });
    return;
  }

  next();
};

export const generateToken = (user: User): string => {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      organizationId: user.organizationId,
      createdAt: user.createdAt
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};